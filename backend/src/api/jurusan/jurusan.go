// Package jurusan menyediakan route handler untuk domain Jurusan.
package jurusan

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/models"
)

// RegisterRoutes mendaftarkan route jurusan ke router group Gin.
func RegisterRoutes(r *gin.RouterGroup) {
	jGroup := r.Group("/jurusan")
	{
		jGroup.GET("", getJurusanList)
		jGroup.GET("/:slug", getJurusanBySlug)
	}
}

// getJurusanList mengembalikan daftar semua jurusan.
func getJurusanList(c *gin.Context) {
	var jurusanList []models.Jurusan
	if err := config.DB.WithContext(c.Request.Context()).Find(&jurusanList).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal mengambil data jurusan dari server",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": jurusanList,
	})
}

// getJurusanBySlug mengembalikan detail satu jurusan berdasarkan parameter slug.
func getJurusanBySlug(c *gin.Context) {
	slugParam := strings.TrimSpace(c.Param("slug"))
	if slugParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Parameter slug tidak boleh kosong",
		})
		return
	}

	var item models.Jurusan
	err := config.DB.WithContext(c.Request.Context()).Where("LOWER(slug) = ?", strings.ToLower(slugParam)).First(&item).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Jurusan tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Terjadi kesalahan pada server saat mencari jurusan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": item,
	})
}
