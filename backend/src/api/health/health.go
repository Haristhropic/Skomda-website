// Package health menyediakan endpoint pengecekan kesehatan service —
// dipakai load balancer/uptime monitor, dan sebagai titik awal untuk
// memverifikasi backend hidup sebelum endpoint domain lain dibangun.
package health

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/shared"
)

// RegisterRoutes mendaftarkan route health check ke router Gin.
func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/health", func(c *gin.Context) {
		c.Header("Cache-Control", "no-store")
		ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
		defer cancel()
		if config.DB == nil {
			c.JSON(503, gin.H{"status": "unavailable", "database": "unavailable"})
			return
		}
		db, err := config.DB.DB()
		if err != nil || db.PingContext(ctx) != nil {
			c.JSON(503, gin.H{"status": "unavailable", "database": "unavailable"})
			return
		}
		redisCtx, redisCancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
		defer redisCancel()
		if shared.Current != nil && !shared.Current.Healthy(redisCtx) {
			c.JSON(503, gin.H{"status": "unavailable", "redis": "unavailable"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"status":   "ok",
			"service":  "smktelkom-web-backend",
			"database": "ok",
		})
	})
}
