// Package config memuat konfigurasi environment untuk backend.
// Semua secret (DB URL, LLM API key, Cloudinary secret) WAJIB lewat env var,
// jangan pernah di-hardcode atau commit ke repo.
package config

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Env            string // development | production | test
	Port           string
	DatabaseDriver string // postgres | sqlite (sqlite hanya untuk development/test)
	DatabaseURL    string
	CloudinaryURL  string
	LLMAPIKey      string
	JWTSecret      string
	AllowedOrigin  string // origin frontend Next.js, untuk CORS
	NexusRouterURL string // URL NexusRouter AI gateway (default: http://localhost:3000)
	ServerEngine   string // gin | fiber (default: gin)
	ChatbotModel   string // Model AI untuk chatbot (default: llama-3.3-70b-versatile)
	RedisURL       string // Private Redis connection; never exposed to clients.
	MonitoringPort string // Unpublished Docker network port for Prometheus.
}

// Load membaca .env (kalau ada, biasanya cuma di local dev) lalu env var asli.
func Load() Config {
	return load(true)
}

// LoadForMigration hanya memvalidasi konfigurasi yang diperlukan migrator.
// Command migrasi tidak perlu menerima JWT secret atau origin web.
func LoadForMigration() Config {
	return load(false)
}

func load(validateRuntimeConfig bool) Config {
	if err := godotenv.Load(); err != nil {
		log.Println("info: tidak menemukan file .env, lanjut pakai env var sistem")
	}

	env := strings.ToLower(strings.TrimSpace(getEnv("ENV", getEnv("APP_ENV", "development"))))
	allowedOriginDefault := "http://localhost:3000"
	if env == "production" {
		allowedOriginDefault = ""
	}

	cfg := Config{
		Env:            env,
		Port:           getEnv("PORT", "8080"),
		DatabaseDriver: strings.ToLower(getEnv("DATABASE_DRIVER", "postgres")),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		CloudinaryURL:  getEnv("CLOUDINARY_URL", ""),
		LLMAPIKey:      getEnv("LLM_API_KEY", ""),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		AllowedOrigin:  getEnv("ALLOWED_ORIGIN", allowedOriginDefault),
		NexusRouterURL: getEnv("NEXUS_ROUTER_URL", "https://fahlyce.vercel.app"),
		ServerEngine:   strings.ToLower(getEnv("SERVER_ENGINE", "fiber")),
		ChatbotModel:   getEnv("CHATBOT_MODEL", "llama-3.3-70b-versatile"),
		RedisURL:       getEnv("REDIS_URL", ""),
		MonitoringPort: getEnv("MONITORING_PORT", ""),
	}
	if validateRuntimeConfig && strings.EqualFold(cfg.Env, "production") {
		if err := validateProductionOrigins(cfg.AllowedOrigin); err != nil {
			log.Fatalf("[FATAL SECURITY] konfigurasi ALLOWED_ORIGIN production tidak valid: %v", err)
		}
	}

	if validateRuntimeConfig && len(strings.TrimSpace(cfg.JWTSecret)) < 16 {
		if strings.EqualFold(cfg.Env, "production") {
			log.Fatal("[FATAL SECURITY] JWT_SECRET wajib dikonfigurasi dengan aman (minimal 16 karakter) pada environment production!")
		} else {
			log.Println("[SECURITY WARNING] JWT_SECRET belum disetel atau kurang dari 16 karakter. Fitur otentikasi admin diblokir hingga JWT_SECRET diisi.")
		}
	}

	return cfg
}

func validateProductionOrigins(raw string) error {
	origins := strings.Split(raw, ",")
	if strings.TrimSpace(raw) == "" {
		return fmt.Errorf("ALLOWED_ORIGIN wajib diisi dengan origin frontend HTTPS")
	}
	for _, value := range origins {
		origin := strings.TrimRight(strings.TrimSpace(value), "/")
		parsed, err := url.Parse(origin)
		if err != nil || parsed.Scheme != "https" || parsed.Host == "" || parsed.User != nil || parsed.Path != "" || parsed.RawQuery != "" || parsed.Fragment != "" {
			return fmt.Errorf("%q harus berupa origin HTTPS tanpa path, query, atau fragment", value)
		}
	}
	return nil
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
