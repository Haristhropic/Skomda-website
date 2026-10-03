// Entry point service backend SMK Telkom Sidoarjo berbasis Go Fiber.
// Jalankan lokal: go run ./src/cmd/fiber
package main

import (
	"log"

	"github.com/haristhropic/skomda-website/backend/src/api"
	"github.com/haristhropic/skomda-website/backend/src/config"
)

func main() {
	cfg := config.Load()

	// Inisialisasi Database & Seeder
	config.InitDB(cfg)

	// Buat instance Fiber
	app := api.NewFiberApp(cfg)

	log.Printf("🚀 backend (Fiber Engine) jalan di port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("gagal menjalankan server Fiber: %v", err)
	}
}
