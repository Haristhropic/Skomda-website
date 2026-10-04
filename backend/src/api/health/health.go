// Package health menyediakan endpoint pengecekan kesehatan service —
// dipakai load balancer/uptime monitor, dan sebagai titik awal untuk
// memverifikasi backend hidup sebelum endpoint domain lain dibangun.
package health

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes mendaftarkan route health check ke router Gin.
func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/health", func(c *gin.Context) {
		c.Header("Cache-Control", "no-store")
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "smktelkom-web-backend",
		})
	})
}
