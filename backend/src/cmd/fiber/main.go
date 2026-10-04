// Entry point service backend SMK Telkom Sidoarjo berbasis Go Fiber.
// Jalankan lokal: go run ./src/cmd/fiber
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/haristhropic/skomda-website/backend/src/api"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/observability"
)

func main() {
	cfg := config.Load()

	// Inisialisasi Database & Seeder
	config.InitDB(cfg)
	observability.StartPrivateServer(cfg.MonitoringPort)

	// Buat instance Fiber
	app := api.NewFiberApp(cfg)
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() { <-ctx.Done(); _ = app.ShutdownWithTimeout(30 * time.Second) }()

	log.Printf("🚀 backend (Fiber Engine) jalan di port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("gagal menjalankan server Fiber: %v", err)
	}
}
