// Package news menyediakan route handler CRUD untuk domain Berita/Artikel.
package news

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/models"
)

// RegisterRoutes mendaftarkan route CRUD berita ke router group Gin.
func RegisterRoutes(r *gin.RouterGroup) {
	nGroup := r.Group("/news")
	{
		nGroup.GET("", getNewsList)
		nGroup.GET("/:slug", getNewsBySlug)
		nGroup.POST("", createNews)
		nGroup.PUT("/:id", updateNews)
		nGroup.DELETE("/:id", deleteNews)
	}
}

// Request payload untuk Create/Update Berita
type NewsInput struct {
	Title         string `json:"title" binding:"required"`
	Slug          string `json:"slug"`
	Category      string `json:"category" binding:"required"`
	Day           string `json:"day"`
	Month         string `json:"month"`
	DateFormatted string `json:"dateFormatted"`
	Time          string `json:"time"`
	Image         string `json:"image"`
	Summary       string `json:"summary"`
	Content       string `json:"content"`
	Author        string `json:"author"`
}

// slugify mengubah judul menjadi URL slug yang bersih
func slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	// Ganti karakter non-alphanumeric dengan dash
	reg := regexp.MustCompile(`[^a-z0-9]+`)
	s = reg.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

// getNewsList mengembalikan list berita dengan filter opsional category dan search.
func getNewsList(c *gin.Context) {
	category := strings.TrimSpace(c.Query("category"))
	search := strings.TrimSpace(c.Query("search"))

	query := config.DB.Model(&models.News{}).Order("id DESC")

	if category != "" && !strings.EqualFold(category, "semua") {
		query = query.Where("LOWER(category) = ?", strings.ToLower(category))
	}

	if search != "" {
		searchTerm := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(title) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(content) LIKE ?", searchTerm, searchTerm, searchTerm)
	}

	var newsList []models.News
	if err := query.Find(&newsList).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal mengambil data berita dari database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  newsList,
		"total": len(newsList),
	})
}

// getNewsBySlug mengembalikan detail satu berita berdasarkan slug.
func getNewsBySlug(c *gin.Context) {
	slugParam := strings.TrimSpace(c.Param("slug"))
	if slugParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Parameter slug tidak boleh kosong",
		})
		return
	}

	var item models.News
	err := config.DB.Where("LOWER(slug) = ?", strings.ToLower(slugParam)).First(&item).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Berita tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Terjadi kesalahan server saat mencari berita",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": item,
	})
}

// createNews menangani pembuatan berita baru (POST /api/news).
func createNews(c *gin.Context) {
	var input NewsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Data tidak valid",
			"details": err.Error(),
		})
		return
	}

	// Generate slug jika kosong
	slug := strings.TrimSpace(input.Slug)
	if slug == "" {
		slug = slugify(input.Title)
	} else {
		slug = slugify(slug)
	}

	// Cek apakah slug sudah ada, jika ada tambahkan suffix timestamp
	var count int64
	config.DB.Model(&models.News{}).Where("slug = ?", slug).Count(&count)
	if count > 0 {
		slug = fmt.Sprintf("%s-%d", slug, time.Now().Unix()%10000)
	}

	now := time.Now()
	day := input.Day
	if day == "" {
		day = fmt.Sprintf("%02d", now.Day())
	}
	month := input.Month
	if month == "" {
		months := []string{"", "JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"}
		month = months[int(now.Month())]
	}
	dateFormatted := input.DateFormatted
	if dateFormatted == "" {
		monthsFull := []string{"", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"}
		dateFormatted = fmt.Sprintf("%d %s %d", now.Day(), monthsFull[int(now.Month())], now.Year())
	}
	timeStr := input.Time
	if timeStr == "" {
		timeStr = now.Format("15.04")
	}
	image := input.Image
	if image == "" {
		image = "/images/berita/news-thumb-1.png"
	}
	author := input.Author
	if author == "" {
		author = "Humas SKOMDA"
	}

	news := models.News{
		Title:         input.Title,
		Slug:          slug,
		Category:      input.Category,
		Day:           day,
		Month:         month,
		DateFormatted: dateFormatted,
		Time:          timeStr,
		Image:         image,
		Summary:       input.Summary,
		Content:       input.Content,
		Author:        author,
	}

	if err := config.DB.Create(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal menyimpan berita ke database",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Berita berhasil diterbitkan",
		"data":    news,
	})
}

// updateNews menangani pembaruan data berita (PUT /api/news/:id).
func updateNews(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID berita tidak valid",
		})
		return
	}

	var existing models.News
	if err := config.DB.First(&existing, uint(id)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Berita tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Terjadi kesalahan server saat mencari berita",
		})
		return
	}

	var input NewsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Data tidak valid",
			"details": err.Error(),
		})
		return
	}

	existing.Title = input.Title
	if input.Slug != "" {
		existing.Slug = slugify(input.Slug)
	}
	existing.Category = input.Category
	if input.Day != "" {
		existing.Day = input.Day
	}
	if input.Month != "" {
		existing.Month = input.Month
	}
	if input.DateFormatted != "" {
		existing.DateFormatted = input.DateFormatted
	}
	if input.Time != "" {
		existing.Time = input.Time
	}
	if input.Image != "" {
		existing.Image = input.Image
	}
	existing.Summary = input.Summary
	existing.Content = input.Content
	if input.Author != "" {
		existing.Author = input.Author
	}

	if err := config.DB.Save(&existing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal memperbarui berita",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Berita berhasil diperbarui",
		"data":    existing,
	})
}

// deleteNews menangani penghapusan berita (DELETE /api/news/:id).
func deleteNews(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID berita tidak valid",
		})
		return
	}

	result := config.DB.Delete(&models.News{}, uint(id))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal menghapus berita dari database",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Berita tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Berita berhasil dihapus",
	})
}
