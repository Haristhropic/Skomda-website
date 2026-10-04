package api

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/observability"
	"github.com/haristhropic/skomda-website/backend/src/shared"
)

func monitoringSnapshot(c *fiber.Ctx) error {
	c.Set("Cache-Control", "no-store")
	result := observability.Snapshot()
	dbStatus := "unavailable"
	if config.DB != nil {
		if db, err := config.DB.DB(); err == nil {
			stats := db.Stats()
			result["database"] = fiber.Map{"open_connections": stats.OpenConnections, "in_use": stats.InUse, "idle": stats.Idle, "max_open_connections": stats.MaxOpenConnections}
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			if db.PingContext(ctx) == nil {
				dbStatus = "ok"
			}
			cancel()
		}
	}
	redisStatus := "disabled"
	if shared.Current.Enabled() {
		ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
		if shared.Current.Healthy(ctx) {
			redisStatus = "ok"
		} else {
			redisStatus = "unavailable"
		}
		cancel()
	}
	result["redis"] = fiber.Map{"enabled": shared.Current.Enabled(), "status": redisStatus}
	result["services"] = []fiber.Map{{"name": "backend", "status": "ok"}, {"name": "database", "status": dbStatus}, {"name": "redis", "status": redisStatus}}
	return c.JSON(result)
}
