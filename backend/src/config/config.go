// Package config memuat konfigurasi environment untuk backend.
// Semua secret (DB URL, LLM API key, Cloudinary secret) WAJIB lewat env var,
// jangan pernah di-hardcode atau commit ke repo.
package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Env             string // development | production | test
	Port            string
	DatabaseURL     string
	CloudinaryURL   string
	LLMAPIKey       string
	JWTSecret       string
	AllowedOrigin   string // origin frontend Next.js, untuk CORS
	NexusRouterURL  string // URL NexusRouter AI gateway (default: http://localhost:3000)
	ServerEngine    string // gin | fiber (default: gin)
	ChatbotModel    string // Model AI untuk chatbot (default: llama-3.3-70b-versatile)
}

// Load membaca .env (kalau ada, biasanya cuma di local dev) lalu env var asli.
func Load() Config {
	if err := godotenv.Load(); err != nil {
		log.Println("info: tidak menemukan file .env, lanjut pakai env var sistem")
	}

	return Config{
		Env:            getEnv("ENV", getEnv("APP_ENV", "development")),
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		CloudinaryURL:  getEnv("CLOUDINARY_URL", ""),
		LLMAPIKey:      getEnv("LLM_API_KEY", ""),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		AllowedOrigin:  getEnv("ALLOWED_ORIGIN", "http://localhost:3000"),
		NexusRouterURL: getEnv("NEXUS_ROUTER_URL", "https://fahlyce.vercel.app"),
		ServerEngine:   strings.ToLower(getEnv("SERVER_ENGINE", "fiber")),
		ChatbotModel:   getEnv("CHATBOT_MODEL", "llama-3.3-70b-versatile"),
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
