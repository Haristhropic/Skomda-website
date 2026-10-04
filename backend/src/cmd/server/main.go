// Entry point service backend SMK Telkom Sidoarjo (Go/Gin).
// Jalankan lokal: go run ./src/cmd/server
package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/haristhropic/skomda-website/backend/src/api"
	"github.com/haristhropic/skomda-website/backend/src/api/chatbot"
	"github.com/haristhropic/skomda-website/backend/src/api/health"
	"github.com/haristhropic/skomda-website/backend/src/api/jurusan"
	"github.com/haristhropic/skomda-website/backend/src/api/news"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/observability"
	"github.com/haristhropic/skomda-website/backend/src/shared"
)

func main() {
	cfg := config.Load()

	// Inisialisasi Database & Seeder
	config.InitDB(cfg)
	observability.StartPrivateServer(cfg.MonitoringPort)

	// Default engine: Fiber (mendukung seluruh fitur Auth, Admin, dan CRUD)
	if cfg.ServerEngine != "gin" {
		log.Printf("🚀 Memulai backend dengan engine: FIBER (port %s)", cfg.Port)
		fiberApp := api.NewFiberApp(cfg)
		ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
		defer stop()
		go func() { <-ctx.Done(); _ = fiberApp.ShutdownWithTimeout(30 * time.Second) }()
		if err := fiberApp.Listen(":" + cfg.Port); err != nil {
			log.Fatalf("gagal menjalankan server Fiber: %v", err)
		}
		return
	}

	// Default: Gunakan engine GIN
	log.Printf("🚀 Memulai backend dengan engine: GIN (port %s)", cfg.Port)
	store, redisErr := shared.New(cfg.RedisURL)
	if redisErr != nil {
		log.Fatal("invalid Redis configuration")
	}
	shared.Current = store
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(func(c *gin.Context) {
		requestID := observability.RequestID(c.GetHeader("X-Request-ID"))
		c.Set("request_id", requestID)
		c.Header("X-Request-ID", requestID)

		startedAt := time.Now()
		c.Next()

		route := c.FullPath()
		if route == "" {
			route = "unmatched"
		}
		log.Printf("request_id=%s method=%s route=%q status=%d duration_ms=%d",
			requestID, c.Request.Method, route, c.Writer.Status(), time.Since(startedAt).Milliseconds())
		observability.Record(c.Request.Method, route, c.Writer.Status(), time.Since(startedAt), requestID)
	})
	_ = router.SetTrustedProxies(nil)
	router.Use(corsMiddleware(cfg.AllowedOrigin, cfg.Env))

	apiGroup := router.Group("/api")
	health.RegisterRoutes(apiGroup)
	jurusan.RegisterRoutes(apiGroup)
	news.RegisterRoutes(apiGroup)
	chatbot.RegisterRoutes(apiGroup, cfg)

	log.Printf("backend Gin jalan di port %s", cfg.Port)
	server := &http.Server{Addr: ":" + cfg.Port, Handler: router, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 40 * time.Second, IdleTimeout: 60 * time.Second}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		<-ctx.Done()
		drainCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		_ = server.Shutdown(drainCtx)
	}()
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("gagal menjalankan server: %v", err)
	}
}

// corsMiddleware hanya mengirim header CORS untuk origin konfigurasi.
// Origin localhost dan jaringan privat hanya dipercaya pada development.
func corsMiddleware(allowedOrigin, env string) gin.HandlerFunc {
	configuredOrigins := make(map[string]struct{})
	for _, value := range strings.Split(allowedOrigin, ",") {
		origin := strings.TrimRight(strings.TrimSpace(value), "/")
		if origin != "" {
			configuredOrigins[origin] = struct{}{}
		}
	}
	production := strings.EqualFold(env, "production")

	return func(c *gin.Context) {
		origin := strings.TrimRight(strings.TrimSpace(c.GetHeader("Origin")), "/")
		_, allowed := configuredOrigins[origin]
		allowed = allowed || (!production && isDevelopmentOrigin(origin))
		if origin != "" && allowed {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, X-Request-ID")
			c.Header("Access-Control-Expose-Headers", "X-Request-ID")
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Max-Age", "86400")
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func isDevelopmentOrigin(origin string) bool {
	parsed, err := url.Parse(origin)
	if err != nil || parsed.Scheme != "http" || parsed.Host == "" || parsed.User != nil || (parsed.Path != "" && parsed.Path != "/") || parsed.RawQuery != "" || parsed.Fragment != "" {
		return false
	}
	host := strings.ToLower(parsed.Hostname())
	if host == "localhost" || strings.HasSuffix(host, ".localhost") {
		return true
	}
	ip := net.ParseIP(host)
	return ip != nil && (ip.IsLoopback() || ip.IsPrivate())
}
