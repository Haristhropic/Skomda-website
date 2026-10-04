package middleware

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/haristhropic/skomda-website/backend/src/shared"
)

func SharedRateLimit(scope string, maximum int, window time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(context.Background(), 750*time.Millisecond)
		defer cancel()
		allowed, retry, err := shared.Current.Allow(ctx, scope, ClientIPKey(c), maximum, window)
		if err != nil {
			c.Set("Retry-After", "5")
			return c.Status(503).JSON(fiber.Map{"error": "Proteksi layanan sementara tidak tersedia. Silakan coba kembali."})
		}
		if !allowed {
			seconds := int(retry.Seconds()) + 1
			c.Set("Retry-After", strconv.Itoa(seconds))
			return c.Status(429).JSON(fiber.Map{"error": "Batas permintaan tercapai. Silakan tunggu sebelum mencoba kembali."})
		}
		return c.Next()
	}
}

var uploadSlots = make(chan struct{}, 2)
var loginSlots = make(chan struct{}, 8)

func LoginConcurrency(c *fiber.Ctx) error {
	select {
	case loginSlots <- struct{}{}:
		defer func() { <-loginSlots }()
		return c.Next()
	default:
		c.Set("Retry-After", "5")
		return c.Status(503).JSON(fiber.Map{"error": "Layanan masuk sedang sibuk. Silakan coba kembali."})
	}
}

func UploadConcurrency(c *fiber.Ctx) error {
	select {
	case uploadSlots <- struct{}{}:
		defer func() { <-uploadSlots }()
		return c.Next()
	default:
		c.Set("Retry-After", "10")
		return c.Status(503).JSON(fiber.Map{"error": "Unggahan sedang sibuk. Silakan coba kembali."})
	}
}

type cachedResponse struct {
	Body        []byte `json:"body"`
	ContentType string `json:"content_type"`
	Route       string `json:"route"`
}

// PublicCache never caches authenticated requests, health, forms, tickets,
// settings or admin data. Cache keys include the complete path and query.
func PublicCache() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Method() != fiber.MethodGet {
			err := c.Next()
			if err == nil && c.Response().StatusCode() < 400 && contentMutation(c.Path()) {
				ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
				_ = shared.Current.Invalidate(ctx)
				cancel()
			}
			return err
		}
		if !shared.Current.Enabled() || !publicContentPath(c.Path()) || c.Get("Authorization") != "" || c.Cookies("skomda_admin_token") != "" || len(c.OriginalURL()) > 2048 {
			return c.Next()
		}
		ctx, cancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
		generation, err := shared.Current.Generation(ctx)
		if err != nil {
			cancel()
			return c.Next()
		}
		key := "skomda:public:v1:" + generation + ":" + shared.Hash(c.OriginalURL())
		value, err := shared.Current.Client.Get(ctx, key).Bytes()
		cancel()
		var cached cachedResponse
		if err == nil && json.Unmarshal(value, &cached) == nil {
			c.Locals("cache_route", cached.Route)
			c.Set("Content-Type", cached.ContentType)
			c.Set("X-Cache", "HIT")
			return c.Send(cached.Body)
		}
		c.Set("X-Cache", "MISS")
		// One DB fill per cache key, across replicas. A traffic burst must not
		// enqueue thousands of identical Supabase reads behind the SQL pool.
		var leaseBytes [16]byte
		_, _ = rand.Read(leaseBytes[:])
		leaseID := hex.EncodeToString(leaseBytes[:])
		leaseKey := key + ":fill"
		leaseCtx, leaseCancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
		owner, leaseErr := shared.Current.Client.SetNX(leaseCtx, leaseKey, leaseID, 5*time.Second).Result()
		leaseCancel()
		if leaseErr == nil && !owner {
			deadline := time.Now().Add(2 * time.Second)
			for time.Now().Before(deadline) {
				time.Sleep(50 * time.Millisecond)
				pollCtx, pollCancel := context.WithTimeout(context.Background(), 150*time.Millisecond)
				value, pollErr := shared.Current.Client.Get(pollCtx, key).Bytes()
				pollCancel()
				if pollErr == nil && json.Unmarshal(value, &cached) == nil {
					c.Locals("cache_route", cached.Route)
					c.Set("Content-Type", cached.ContentType)
					c.Set("X-Cache", "HIT")
					return c.Send(cached.Body)
				}
			}
			c.Set("Retry-After", "1")
			return c.Status(503).JSON(fiber.Map{"error": "Informasi sedang dimuat. Silakan coba kembali."})
		}
		if owner {
			defer func() {
				releaseCtx, releaseCancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
				defer releaseCancel()
				_ = shared.Current.Client.Eval(releaseCtx, `if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0`, []string{leaseKey}, leaseID).Err()
			}()
		}
		err = c.Next()
		if err == nil && c.Response().StatusCode() == 200 && len(c.Response().Body()) <= 512*1024 && strings.Contains(string(c.Response().Header.ContentType()), "application/json") && len(c.Response().Header.Peek("Set-Cookie")) == 0 {
			route := "unmatched"
			if c.Route() != nil {
				route = c.Route().Path
			}
			payload, _ := json.Marshal(cachedResponse{Body: append([]byte(nil), c.Response().Body()...), ContentType: string(c.Response().Header.ContentType()), Route: route})
			ctx, cancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
			_ = shared.Current.Client.Set(ctx, key, payload, 30*time.Second).Err()
			cancel()
		}
		return err
	}
}
func publicContentPath(path string) bool {
	for _, prefix := range []string{"/api/news", "/api/jurusan", "/api/teachers", "/api/prestasi", "/api/bkk/jobs", "/api/bkk/partners", "/api/ekskul", "/api/fasilitas", "/api/documents", "/api/dtp"} {
		if path == prefix || strings.HasPrefix(path, prefix+"/") {
			return true
		}
	}
	return path == "/api/trial-class/event"
}
func contentMutation(path string) bool {
	return strings.HasPrefix(path, "/api/") && !strings.HasPrefix(path, "/api/auth/") && !strings.HasPrefix(path, "/api/chatbot/")
}
