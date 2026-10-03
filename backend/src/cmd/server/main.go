// Entry point service backend SMK Telkom Sidoarjo (Go/Gin).
// Jalankan lokal: go run ./src/cmd/server
package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/haristhropic/skomda-website/backend/src/api"
	"github.com/haristhropic/skomda-website/backend/src/api/chatbot"
	"github.com/haristhropic/skomda-website/backend/src/api/health"
	"github.com/haristhropic/skomda-website/backend/src/api/jurusan"
	"github.com/haristhropic/skomda-website/backend/src/api/news"
	"github.com/haristhropic/skomda-website/backend/src/config"
)

func main() {
	cfg := config.Load()

	// Inisialisasi Database & Seeder
	config.InitDB(cfg)

	// Default engine: Fiber (mendukung seluruh fitur Auth, Admin, dan CRUD)
	if cfg.ServerEngine != "gin" {
		log.Printf("🚀 Memulai backend dengan engine: FIBER (port %s)", cfg.Port)
		fiberApp := api.NewFiberApp(cfg)
		if err := fiberApp.Listen(":" + cfg.Port); err != nil {
			log.Fatalf("gagal menjalankan server Fiber: %v", err)
		}
		return
	}

	// Default: Gunakan engine GIN
	log.Printf("🚀 Memulai backend dengan engine: GIN (port %s)", cfg.Port)
	router := gin.Default()
	_ = router.SetTrustedProxies(nil)
	router.Use(corsMiddleware(cfg.AllowedOrigin))

	apiGroup := router.Group("/api")
	health.RegisterRoutes(apiGroup)
	jurusan.RegisterRoutes(apiGroup)
	news.RegisterRoutes(apiGroup)
	chatbot.RegisterRoutes(apiGroup, cfg)

	log.Printf("backend Gin jalan di port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("gagal menjalankan server: %v", err)
	}
}

// corsMiddleware mengizinkan request dari origin frontend Next.js dan local dev ports.
func corsMiddleware(allowedOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			if allowedOrigin == "*" || allowedOrigin == "" || origin == allowedOrigin ||
				strings.HasPrefix(origin, "http://localhost:") ||
				strings.HasPrefix(origin, "http://127.0.0.1:") ||
				strings.HasPrefix(origin, "http://10.") ||
				strings.HasPrefix(origin, "http://192.168.") ||
				strings.HasPrefix(origin, "http://172.") {
				c.Header("Access-Control-Allow-Origin", origin)
			} else {
				c.Header("Access-Control-Allow-Origin", allowedOrigin)
			}
		} else if allowedOrigin != "" {
			c.Header("Access-Control-Allow-Origin", allowedOrigin)
		} else {
			c.Header("Access-Control-Allow-Origin", "*")
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
