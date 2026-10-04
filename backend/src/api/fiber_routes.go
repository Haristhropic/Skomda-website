// Package api menyediakan registrasi route berbasis Go Fiber.
// Menggunakan models GORM dan database yang sama persis dengan service Gin.
package api

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/mail"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"gorm.io/gorm"

	"github.com/haristhropic/skomda-website/backend/src/api/auth"
	"github.com/haristhropic/skomda-website/backend/src/api/middleware"
	"github.com/haristhropic/skomda-website/backend/src/client/cloudinary"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/models"
)

// NewFiberApp menginisialisasi router Fiber beserta middleware dan seluruh route domain.
func NewFiberApp(cfg config.Config) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName:      "SMK Telkom Sidoarjo API (Fiber Edition)",
		ServerHeader: "Fiber",
		BodyLimit:    15 * 1024 * 1024, // 15 MB limit untuk upload gambar dan dokumen
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())

	allowedOrigins := "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:4321,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:3002,http://127.0.0.1:4321,http://127.0.0.1:5173"
	if cfg.AllowedOrigin != "" {
		for _, o := range strings.Split(cfg.AllowedOrigin, ",") {
			trimmed := strings.TrimRight(strings.TrimSpace(o), "/")
			if trimmed != "" && !strings.Contains(allowedOrigins, trimmed) {
				allowedOrigins = allowedOrigins + "," + trimmed
			}
		}
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-Requested-With",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	_ = os.MkdirAll("./uploads", 0755)
	app.Static("/uploads", "./uploads")

	cldClient, _ := cloudinary.NewClient(cfg.CloudinaryURL)

	api := app.Group("/api")

	// 1. Health check
	api.Get("/health", func(c *fiber.Ctx) error {
		if config.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"status":   "unavailable",
				"database": "unavailable",
			})
		}
		sqlDB, err := config.DB.DB()
		if err != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"status":   "unavailable",
				"database": "unavailable",
			})
		}
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		if err := sqlDB.PingContext(ctx); err != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"status":   "unavailable",
				"database": "unavailable",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":   "ok",
			"service":  "smktelkom-web-backend",
			"engine":   "fiber-v2",
			"database": "ok",
		})
	})

	// 1.1 Auth Routes
	authGroup := api.Group("/auth")
	loginLimiter := limiter.New(limiter.Config{
		Max:          5,
		Expiration:   1 * time.Minute,
		KeyGenerator: middleware.ClientIPKey,
		LimitReached: func(c *fiber.Ctx) error {
			c.Set("Retry-After", "60")
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Batas frekuensi percobaan masuk terlampaui. Silakan tunggu 1 menit sebelum mencoba kembali.",
			})
		},
	})
	authGroup.Post("/login", loginLimiter, auth.LoginHandler(cfg))
	authGroup.Get("/me", middleware.AuthMiddleware(cfg.JWTSecret), auth.MeHandler())
	authGroup.Post("/logout", auth.LogoutHandler())

	// 1.2 Admin Protected Routes
	adminGroup := api.Group("/admin", middleware.AuthMiddleware(cfg.JWTSecret))
	listNews := func(c *fiber.Ctx, publicOnly bool) error {
		category := strings.TrimSpace(c.Query("category"))
		search := strings.TrimSpace(c.Query("search"))
		query := config.DB.Model(&models.News{}).Order("id DESC")

		if publicOnly {
			// Query status dari client publik tidak boleh membuka berita draft.
			query = query.Where("LOWER(status) = ?", "published")
		} else if status := strings.TrimSpace(c.Query("status")); status != "" && !strings.EqualFold(status, "semua") {
			query = query.Where("LOWER(status) = ?", strings.ToLower(status))
		}
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		if search != "" {
			searchTerm := "%" + strings.ToLower(search) + "%"
			query = query.Where("LOWER(title) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(content) LIKE ?", searchTerm, searchTerm, searchTerm)
		}

		var total int64
		if err := query.Count(&total).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menghitung data berita"})
		}

		if pageStr := c.Query("page"); pageStr != "" {
			page, _ := strconv.Atoi(pageStr)
			limit, _ := strconv.Atoi(c.Query("limit", "10"))
			if page < 1 {
				page = 1
			}
			if limit < 1 || limit > 100 {
				limit = 10
			}
			query = query.Offset((page - 1) * limit).Limit(limit)
		}

		var newsList []models.News
		if err := query.Find(&newsList).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data berita dari database"})
		}
		return c.JSON(fiber.Map{"data": newsList, "total": total})
	}
	adminGroup.Get("/news", func(c *fiber.Ctx) error {
		return listNews(c, false)
	})
	adminUserGuard := middleware.RequireRole("super_admin")
	adminGroup.Get("/users", adminUserGuard, func(c *fiber.Ctx) error {
		var users []models.User
		if err := config.DB.Select("id", "name", "email", "role", "avatar", "created_at").Order("id ASC").Find(&users).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil daftar akun admin"})
		}
		return c.JSON(fiber.Map{"data": users})
	})
	adminGroup.Post("/users", adminUserGuard, func(c *fiber.Ctx) error {
		var input struct {
			Name     string `json:"name"`
			Email    string `json:"email"`
			Password string `json:"password"`
			Role     string `json:"role"`
		}
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload akun admin tidak valid"})
		}
		input.Name = strings.TrimSpace(input.Name)
		input.Email = strings.ToLower(strings.TrimSpace(input.Email))
		input.Password = strings.TrimSpace(input.Password)
		input.Role = strings.ToLower(strings.TrimSpace(input.Role))
		parsedEmail, emailErr := mail.ParseAddress(input.Email)
		if input.Name == "" || len(input.Name) > 100 || emailErr != nil || parsedEmail.Address != input.Email || len(input.Email) > 150 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Nama atau alamat email tidak valid"})
		}
		if len(input.Password) < 16 || len(input.Password) > 72 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password admin harus 16 sampai 72 byte"})
		}
		if input.Role != "editor" && input.Role != "super_admin" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Role harus editor atau super_admin"})
		}

		var existing models.User
		if err := config.DB.Unscoped().Where("LOWER(email) = ?", input.Email).First(&existing).Error; err == nil {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Email sudah digunakan"})
		} else if err != gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal memeriksa email akun"})
		}

		user := models.User{Name: input.Name, Email: input.Email, Role: input.Role, Avatar: "/images/common/telkom-schools-icon.png"}
		if err := user.SetPassword(input.Password); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengamankan password akun"})
		}
		if err := config.DB.Create(&user).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal membuat akun admin"})
		}
		recordAudit(c, "CREATE", "admin_user", fmt.Sprint(user.ID), fmt.Sprintf("Membuat akun admin %s dengan role %s", user.Email, user.Role))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Akun admin berhasil dibuat",
			"user":    fiber.Map{"id": user.ID, "name": user.Name, "email": user.Email, "role": user.Role, "avatar": user.Avatar},
		})
	})
	adminGroup.Patch("/users/:id/role", adminUserGuard, func(c *fiber.Ctx) error {
		id, err := strconv.ParseUint(c.Params("id"), 10, 32)
		if err != nil || id == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID akun tidak valid"})
		}
		currentUserID, _ := c.Locals("user_id").(uint)
		if uint(id) == currentUserID {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Role akun yang sedang dipakai tidak dapat diubah dari sesi ini"})
		}
		var input struct {
			Role string `json:"role"`
		}
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload role tidak valid"})
		}
		input.Role = strings.ToLower(strings.TrimSpace(input.Role))
		if input.Role != "editor" && input.Role != "super_admin" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Role harus editor atau super_admin"})
		}

		var target models.User
		if err := config.DB.First(&target, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Akun admin tidak ditemukan"})
		}
		if strings.EqualFold(target.Role, "super_admin") && input.Role == "editor" {
			var superAdminCount int64
			if err := config.DB.Model(&models.User{}).Where("LOWER(role) = ?", "super_admin").Count(&superAdminCount).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal memeriksa akun super admin"})
			}
			if superAdminCount <= 1 {
				return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Tidak dapat menurunkan role super admin terakhir"})
			}
		}
		oldRole := target.Role
		if err := config.DB.Model(&target).Update("role", input.Role).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal memperbarui role akun"})
		}
		recordAudit(c, "UPDATE", "admin_user", fmt.Sprint(target.ID), fmt.Sprintf("Mengubah role akun %s dari %s menjadi %s", target.Email, oldRole, input.Role))
		return c.JSON(fiber.Map{"message": "Role akun berhasil diperbarui", "user": fiber.Map{"id": target.ID, "name": target.Name, "email": target.Email, "role": input.Role}})
	})
	adminGroup.Get("/dashboard/stats", func(c *fiber.Ctx) error {
		var totalNews int64
		var publishedNews int64
		var draftNews int64
		var totalUsers int64
		var totalTeachers int64
		var totalPrestasi int64
		var totalEkskul int64
		var totalFasilitas int64
		var totalJobs int64
		var totalPartners int64
		var totalDocuments int64
		var totalDtp int64
		var totalTrialClass int64
		var recentLogs []models.AuditLog
		var recentNews []models.News

		config.DB.Model(&models.News{}).Count(&totalNews)
		config.DB.Model(&models.News{}).Where("status = ?", "published").Count(&publishedNews)
		config.DB.Model(&models.News{}).Where("status = ?", "draft").Count(&draftNews)
		config.DB.Model(&models.User{}).Count(&totalUsers)

		config.DB.Model(&models.Teacher{}).Count(&totalTeachers)
		config.DB.Model(&models.Prestasi{}).Count(&totalPrestasi)
		config.DB.Model(&models.Ekstrakurikuler{}).Count(&totalEkskul)
		config.DB.Model(&models.Fasilitas{}).Count(&totalFasilitas)
		config.DB.Model(&models.BKKJob{}).Count(&totalJobs)
		config.DB.Model(&models.BKKPartner{}).Count(&totalPartners)
		config.DB.Model(&models.Document{}).Count(&totalDocuments)
		config.DB.Model(&models.DigitalTalent{}).Count(&totalDtp)
		config.DB.Model(&models.TrialClassRegistration{}).Count(&totalTrialClass)

		if strings.EqualFold(c.Locals("user_role").(string), "super_admin") {
			config.DB.Order("created_at DESC").Limit(10).Find(&recentLogs)
		}
		config.DB.Order("id DESC").Limit(5).Find(&recentNews)

		response := fiber.Map{
			"totalNews":       totalNews,
			"publishedNews":   publishedNews,
			"draftNews":       draftNews,
			"totalUsers":      totalUsers,
			"totalTeachers":   totalTeachers,
			"totalPrestasi":   totalPrestasi,
			"totalEkskul":     totalEkskul,
			"totalFasilitas":  totalFasilitas,
			"totalJobs":       totalJobs,
			"totalPartners":   totalPartners,
			"totalDocuments":  totalDocuments,
			"totalDtp":        totalDtp,
			"totalTrialClass": totalTrialClass,
			"recentNews":      recentNews,
		}
		if strings.EqualFold(c.Locals("user_role").(string), "super_admin") {
			response["recentLogs"] = recentLogs
		}
		return c.JSON(response)
	})

	adminGroup.Get("/audit-logs", middleware.RequireRole("super_admin"), func(c *fiber.Ctx) error {
		var logs []models.AuditLog
		limit, _ := strconv.Atoi(c.Query("limit", "50"))
		if limit <= 0 || limit > 100 {
			limit = 50
		}
		if err := config.DB.Order("id DESC").Limit(limit).Find(&logs).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal mengambil audit log",
			})
		}
		return c.JSON(fiber.Map{"data": logs})
	})

	// 2. Jurusan routes
	jurusanGroup := api.Group("/jurusan")
	jurusanGroup.Get("", func(c *fiber.Ctx) error {
		var list []models.Jurusan
		if err := config.DB.Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal mengambil data jurusan dari server",
			})
		}
		return c.JSON(fiber.Map{"data": list})
	})

	jurusanGroup.Get("/:slug", func(c *fiber.Ctx) error {
		slug := strings.TrimSpace(c.Params("slug"))
		if slug == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Parameter slug tidak boleh kosong",
			})
		}

		var item models.Jurusan
		err := config.DB.Where("LOWER(slug) = ?", strings.ToLower(slug)).First(&item).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error": "Jurusan tidak ditemukan",
				})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Terjadi kesalahan server saat mencari jurusan",
			})
		}
		return c.JSON(fiber.Map{"data": item})
	})

	// 3. News routes
	newsGroup := api.Group("/news")
	newsGroup.Get("", func(c *fiber.Ctx) error {
		return listNews(c, true)
	})

	newsGroup.Get("/:slug", func(c *fiber.Ctx) error {
		slug := strings.TrimSpace(c.Params("slug"))
		var item models.News
		err := config.DB.Where("LOWER(slug) = ? AND LOWER(status) = ?", strings.ToLower(slug), "published").First(&item).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error": "Berita tidak ditemukan",
				})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Terjadi kesalahan server saat mencari berita",
			})
		}
		return c.JSON(fiber.Map{"data": item})
	})

	type NewsPayload struct {
		Title         string `json:"title"`
		Slug          string `json:"slug"`
		Category      string `json:"category"`
		Day           string `json:"day"`
		Month         string `json:"month"`
		DateFormatted string `json:"dateFormatted"`
		Time          string `json:"time"`
		Image         string `json:"image"`
		Summary       string `json:"summary"`
		Content       string `json:"content"`
		Author        string `json:"author"`
		Status        string `json:"status"`
	}

	newsGroup.Post("", middleware.AuthMiddleware(cfg.JWTSecret), func(c *fiber.Ctx) error {
		var input NewsPayload
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Payload tidak valid",
			})
		}

		if strings.TrimSpace(input.Title) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Judul berita wajib diisi",
			})
		}

		slug := strings.TrimSpace(input.Slug)
		if slug == "" {
			slug = slugify(input.Title)
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
		status := input.Status
		if status == "" {
			status = "published"
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
			Status:        status,
		}

		if err := config.DB.Create(&news).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal menyimpan berita",
			})
		}

		userName, _ := c.Locals("user_name").(string)
		userID, _ := c.Locals("user_id").(uint)
		go func(uid uint, uname, ip string) {
			config.DB.Create(&models.AuditLog{
				UserID:    uid,
				UserName:  uname,
				Action:    "CREATE",
				Entity:    "news",
				EntityID:  fmt.Sprint(news.ID),
				Details:   fmt.Sprintf("Membuat berita: %s (%s)", news.Title, news.Status),
				IPAddress: ip,
				CreatedAt: time.Now(),
			})
		}(userID, userName, c.IP())

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Berita berhasil diterbitkan",
			"data":    news,
		})
	})

	newsGroup.Put("/:id", middleware.AuthMiddleware(cfg.JWTSecret), func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "ID berita tidak valid",
			})
		}

		var existing models.News
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Berita tidak ditemukan",
			})
		}

		var input NewsPayload
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Payload tidak valid",
			})
		}

		if strings.TrimSpace(input.Title) != "" {
			existing.Title = input.Title
			if strings.TrimSpace(input.Slug) != "" {
				existing.Slug = input.Slug
			} else {
				existing.Slug = slugify(input.Title)
			}
		}
		if input.Category != "" {
			existing.Category = input.Category
		}
		if input.Summary != "" {
			existing.Summary = input.Summary
		}
		if input.Content != "" {
			existing.Content = input.Content
		}
		if input.Image != "" {
			existing.Image = input.Image
		}
		if input.Author != "" {
			existing.Author = input.Author
		}
		if input.Status != "" {
			existing.Status = input.Status
		}

		if err := config.DB.Save(&existing).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal memperbarui berita",
			})
		}

		userName, _ := c.Locals("user_name").(string)
		userID, _ := c.Locals("user_id").(uint)
		go func(uid uint, uname, ip string) {
			config.DB.Create(&models.AuditLog{
				UserID:    uid,
				UserName:  uname,
				Action:    "UPDATE",
				Entity:    "news",
				EntityID:  fmt.Sprint(existing.ID),
				Details:   fmt.Sprintf("Memperbarui berita: %s (%s)", existing.Title, existing.Status),
				IPAddress: ip,
				CreatedAt: time.Now(),
			})
		}(userID, userName, c.IP())

		return c.JSON(fiber.Map{
			"message": "Berita berhasil diperbarui",
			"data":    existing,
		})
	})

	newsGroup.Delete("/:id", middleware.AuthMiddleware(cfg.JWTSecret), middleware.RequireRole("super_admin"), func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "ID berita tidak valid",
			})
		}

		var existing models.News
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Berita tidak ditemukan",
			})
		}

		if err := config.DB.Delete(&existing).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal menghapus berita",
			})
		}

		userName, _ := c.Locals("user_name").(string)
		userID, _ := c.Locals("user_id").(uint)
		go func(uid uint, uname, ip string) {
			config.DB.Create(&models.AuditLog{
				UserID:    uid,
				UserName:  uname,
				Action:    "DELETE",
				Entity:    "news",
				EntityID:  fmt.Sprint(existing.ID),
				Details:   fmt.Sprintf("Menghapus berita: %s", existing.Title),
				IPAddress: ip,
				CreatedAt: time.Now(),
			})
		}(userID, userName, c.IP())

		return c.JSON(fiber.Map{"message": "Berita berhasil dihapus"})
	})

	// 4. Chatbot
	cbGroup := api.Group("/chatbot")
	chatbotSlots := make(chan struct{}, 16)
	chatbotLimiter := limiter.New(limiter.Config{
		Max:          60,
		Expiration:   time.Minute,
		KeyGenerator: middleware.ClientIPKey,
		LimitReached: func(c *fiber.Ctx) error {
			c.Set("Retry-After", "60")
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Batas permintaan chatbot tercapai. Silakan coba lagi dalam satu menit.",
			})
		},
	})
	cbGroup.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ready",
			"engine": "fiber",
			"target": cfg.NexusRouterURL,
		})
	})
	cbGroup.Post("/message", chatbotLimiter, func(c *fiber.Ctx) error {
		select {
		case chatbotSlots <- struct{}{}:
		default:
			c.Set("Retry-After", "10")
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "Layanan chatbot sedang sibuk. Silakan coba kembali beberapa saat lagi.",
			})
		}
		streamingResponse := false
		defer func() {
			if !streamingResponse {
				<-chatbotSlots
			}
		}()

		var req struct {
			Message string        `json:"message"`
			History []interface{} `json:"history"`
			Stream  bool          `json:"stream"`
			Model   string        `json:"model"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Permintaan tidak valid: format data JSON salah.",
			})
		}
		trimmed := strings.TrimSpace(req.Message)
		if trimmed == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Pesan tidak boleh kosong.",
			})
		}

		if req.Model == "" || req.Model == "groq" || req.Model == "gemini" || req.Model == "gemini-3.8-flash" {
			if cfg.ChatbotModel != "" {
				req.Model = cfg.ChatbotModel
			} else {
				req.Model = "llama-3.3-70b-versatile"
			}
		}

		// Cek apakah query DTP memiliki intensi spesifik (magang/karir, sertifikasi, daftar 9 spesialisasi, atau overview)
		if isDtpQuery(trimmed) {
			lower := strings.ToLower(trimmed)
			var targetedResp string
			var targetedSources []fiber.Map

			if isDtpInternshipOrCareerQuery(lower) {
				targetedResp = getDtpInternshipCareerResponse()
				targetedSources = []fiber.Map{
					{
						"title":    "Peluang Magang & Prospek Karir Lulusan DTP",
						"url":      "/program/digital-talent",
						"category": "Karir & Magang",
					},
					{
						"title":    "Bursa Kerja Khusus (BKK) & Rekrutmen Industri",
						"url":      "/program/profil-jurusan#prospek-karir",
						"category": "Kemitraan",
					},
				}
			} else if isDtpCertificationsQuery(lower) {
				targetedResp = getDtpCertificationsResponse()
				targetedSources = []fiber.Map{
					{
						"title":    "Kurikulum & Sertifikasi Internasional DTP",
						"url":      "/program/digital-talent#kurikulum",
						"category": "Sertifikasi",
					},
					{
						"title":    "Digital Talent Program (DTP) SMK Telkom Sidoarjo",
						"url":      "/program/digital-talent",
						"category": "Program Unggulan",
					},
				}
			} else if isDtp9SpecializationsListQuery(lower) && !strings.Contains(lower, "apa itu") && !strings.Contains(lower, "jelaskan") {
				targetedResp = getDtp9SpecializationsListResponse()
				targetedSources = []fiber.Map{
					{
						"title":    "Digital Talent Program (DTP) - 9 Spesialisasi Industri",
						"url":      "/program/digital-talent",
						"category": "Program Unggulan",
					},
					{
						"title":    "Kurikulum & Sertifikasi Internasional DTP",
						"url":      "/program/digital-talent#kurikulum",
						"category": "Sertifikasi",
					},
				}
			} else if strings.Contains(lower, "apa itu") || strings.Contains(lower, "jelaskan") || strings.Contains(lower, "tentang") || strings.Contains(lower, "definisi") {
				targetedResp = getDtpKnowledgeResponse()
				targetedSources = []fiber.Map{
					{
						"title":    "Digital Talent Program (DTP) - 9 Spesialisasi Industri",
						"url":      "/program/digital-talent",
						"category": "Program Unggulan",
					},
					{
						"title":    "Kurikulum & Sertifikasi Internasional DTP",
						"url":      "/program/digital-talent#kurikulum",
						"category": "Sertifikasi",
					},
				}
			}

			if targetedResp != "" {
				if req.Stream {
					c.Set("Content-Type", "text/event-stream")
					c.Set("Cache-Control", "no-cache")
					c.Set("Connection", "keep-alive")
					c.Set("Transfer-Encoding", "chunked")
					streamingResponse = true
					c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
						defer func() { <-chatbotSlots }()
						words := strings.Split(targetedResp, " ")
						chunkSize := 8
						for i := 0; i < len(words); i += chunkSize {
							end := i + chunkSize
							if end > len(words) {
								end = len(words)
							}
							chunk := strings.Join(words[i:end], " ")
							if i > 0 {
								chunk = " " + chunk
							}
							payload, _ := json.Marshal(fiber.Map{
								"delta":   fiber.Map{"content": chunk},
								"sources": targetedSources,
							})
							_, _ = w.Write([]byte("data: " + string(payload) + "\n\n"))
							_ = w.Flush()
							time.Sleep(5 * time.Millisecond)
						}
						_, _ = w.Write([]byte("data: [DONE]\n\n"))
						_ = w.Flush()
					})
					return nil
				}

				return c.Status(fiber.StatusOK).JSON(fiber.Map{
					"response": targetedResp,
					"sources":  targetedSources,
					"model":    "Skomda Knowledge Engine (DTP Curated)",
				})
			}
		}

		// Siapkan query cerdas dengan injeksi konteks DTP/SKOMDA terkini bila relevan agar AI menjawab akurat dan dinamis
		processedMessage := trimmed
		if isDtpQuery(trimmed) {
			processedMessage = "[INFORMASI RESMI SKOMDA - DIGITAL TALENT PROGRAM (DTP):\n" +
				"- DTP SMK Telkom Sidoarjo adalah inisiatif strategis akselerasi keahlian teknologi digital berbasis Project-Based Learning dan sertifikasi global.\n" +
				"- Terdapat 9 Pilihan Spesialisasi Industri resmi:\n" +
				"  1. Software Developer (Klaster Software & AI): Web modern, RESTful API, React, Laravel, Node.js, Docker, Linux Server.\n" +
				"  2. Network System Administrator (Klaster Network & Cloud): Linux/Windows Server, Proxmox, VMware, high availability enterprise.\n" +
				"  3. Network Infrastructure Engineer (Klaster Network & Cloud): Fiber optic splicing, OTDR, OLT/ONT, routing & switching MikroTik.\n" +
				"  4. Visual Communication Designer (Klaster Design & Creative): UI/UX Figma prototyping, branding, motion graphics, videografi & fotografi.\n" +
				"  5. Internet of Things (IoT) Engineer (Klaster Hardware & Security): Mikrokontroler ESP32, sensor/aktuator, protokol MQTT & HTTP, dashboard real-time.\n" +
				"  6. Cloud Engineer (Klaster Network & Cloud): Cloud AWS/GCP/Azure, containerization Docker, CI/CD GitHub Actions, observabilitas server.\n" +
				"  7. Artificial Intelligence (AI) Specialist (Klaster Software & AI): Python data & AI, EDA, Machine Learning, Deep Learning, NLP, Computer Vision.\n" +
				"  8. Digital Marketing Specialist (Klaster Design & Creative): Riset pasar & persona, copywriting, SEO & SEM Google Ads, Meta Ads Manager.\n" +
				"  9. Cyber Security Specialist (Klaster Hardware & Security): Vulnerability assessment, penetration testing web & network, SOC, ethical hacking.\n" +
				"- Sertifikasi Internasional & Industri Resmi: Cisco (CCNA & CCST), AWS Certified (AWS Cloud Practitioner & Architecting via AWS Academy), MikroTik (MTCNA), Oracle Academy (Java & DB), BNSP.\n" +
				"- Peluang Magang & Karir: Magang industri 6 bulan di mitra nasional terkemuka (Telkom Group, Wowrack, Jagoan Hosting, ISP CitraNet/Hypernet, software house). Penyaluran kerja difasilitasi penuh oleh Bursa Kerja Khusus (BKK Skomda) dengan on-campus recruitment sebelum wisuda, inkubasi bisnis di SKOMDA KUBIK, dan beasiswa kuliah OPES Telkom University.\n" +
				"- INSTRUKSI ASISTEN: Jawablah secara cerdas, spesifik, natural, dan langsung menjawab apa yang ditanyakan pengguna tanpa mengulang template yang sama. Jangan gunakan em dash (—). Jika ditanya magang/karir, fokuskan pada peluang magang dan karir; jika ditanya daftar spesialisasi, sebutkan 9 bidangnya secara ringkas dan rapi; jika ditanya pengertian DTP, jelaskan konsep programnya. Selalu berikan respon yang relevan dan variatif.]\n\nPertanyaan: " + trimmed
		}

		targetURL := strings.TrimRight(cfg.NexusRouterURL, "/") + "/api/v1/skomda/chat"
		forwardPayload, err := json.Marshal(map[string]interface{}{
			"message": processedMessage,
			"history": req.History,
			"stream":  req.Stream,
			"model":   req.Model,
		})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal memproses data pesan.",
			})
		}

		httpReq, err := http.NewRequestWithContext(c.Context(), http.MethodPost, targetURL, bytes.NewBuffer(forwardPayload))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal menghubungkan ke gateway AI.",
			})
		}

		httpReq.Header.Set("Content-Type", "application/json")
		if cfg.LLMAPIKey != "" {
			httpReq.Header.Set("Authorization", "Bearer "+cfg.LLMAPIKey)
		}
		httpReq.Header.Set("X-Agent-Name", "Skomda-Website-Bot")
		httpReq.Header.Set("X-Internal-Client", "skomda")
		httpReq.Header.Set("X-Virtual-Key", "vk-skomda")
		if req.Stream {
			httpReq.Header.Set("Accept", "text/event-stream")
		}

		client := &http.Client{
			Timeout: 45 * time.Second,
		}

		resp, err := client.Do(httpReq)
		if err != nil || (resp != nil && resp.StatusCode != fiber.StatusOK) {
			if err != nil {
				log.Printf("[Fiber Chatbot] Gagal menghubungi NexusRouter di %s: %v", targetURL, err)
			} else {
				log.Printf("[Fiber Chatbot] NexusRouter status error: %d", resp.StatusCode)
			}

			// Fallback cerdas jika gateway offline
			if isDtpQuery(trimmed) {
				return c.Status(fiber.StatusOK).JSON(fiber.Map{
					"response": getDtpKnowledgeResponse(),
					"sources": []fiber.Map{
						{
							"title":    "Digital Talent Program (DTP) - 9 Spesialisasi Industri",
							"url":      "/program/digital-talent",
							"category": "Program Unggulan",
						},
						{
							"title":    "Kurikulum & Sertifikasi Internasional DTP",
							"url":      "/program/digital-talent#kurikulum",
							"category": "Sertifikasi",
						},
					},
					"fallback": true,
				})
			}

			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"response": "Mohon maaf, layanan asisten virtual sedang dalam pemeliharaan berkala.\n\nUntuk pertanyaan seputar PPDB 2026/2027 atau konsultasi jurusan SIJA & TJAT, silakan hubungi WhatsApp Humas resmi SMK Telkom Sidoarjo di 0811-3021-919 atau unduh brosur resmi di menu [Unduh Informasi](/unduh-informasi).",
				"sources": []fiber.Map{
					{
						"title":    "Unduh Brosur PPDB & Informasi",
						"url":      "/unduh-informasi",
						"category": "PPDB & Regulasi",
					},
				},
				"fallback": true,
			})
		}

		if req.Stream && strings.Contains(resp.Header.Get("Content-Type"), "text/event-stream") {
			c.Set("Content-Type", "text/event-stream")
			c.Set("Cache-Control", "no-cache")
			c.Set("Connection", "keep-alive")
			c.Set("Transfer-Encoding", "chunked")
			streamingResponse = true
			c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
				defer func() { <-chatbotSlots }()
				defer resp.Body.Close()
				reader := bufio.NewReader(resp.Body)
				for {
					line, readErr := reader.ReadBytes('\n')
					if len(line) > 0 {
						_, _ = w.Write(line)
						_ = w.Flush()
					}
					if readErr != nil {
						break
					}
				}
			})
			return nil
		}

		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal membaca respons dari gateway AI.",
			})
		}

		c.Status(resp.StatusCode)
		c.Set("Content-Type", resp.Header.Get("Content-Type"))
		return c.Send(body)
	})

	// 5. Cloudinary Signed Upload & Direct Image Upload
	api.Get("/cloudinary/sign", middleware.AuthMiddleware(cfg.JWTSecret), func(c *fiber.Ctx) error {
		if cldClient == nil || cldClient.CloudName == "" {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "Cloudinary belum dikonfigurasi di server backend",
			})
		}
		folder := c.Query("folder", "skomda/uploads")
		params := cldClient.GetSignedUploadParams(folder)
		return c.JSON(fiber.Map{
			"data": params,
		})
	})

	api.Post("/upload/image", middleware.AuthMiddleware(cfg.JWTSecret), func(c *fiber.Ctx) error {
		fileHeader, err := c.FormFile("image")
		if err != nil {
			fileHeader, err = c.FormFile("file")
		}
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Berkas gambar tidak ditemukan. Silakan pilih file gambar.",
			})
		}

		// Validasi tipe berkas dan ekstensi gambar aman
		ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
		allowedImgExts := map[string]bool{
			".jpg":  true,
			".jpeg": true,
			".png":  true,
			".webp": true,
			".gif":  true,
		}
		if !allowedImgExts[ext] {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Format ekstensi gambar tidak didukung. Format yang diizinkan: JPG, JPEG, PNG, WEBP, GIF.",
			})
		}

		if fileHeader.Size <= 0 || fileHeader.Size > 10*1024*1024 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Ukuran berkas gambar tidak valid atau melebihi batas maksimum 10 MB.",
			})
		}

		contentType := fileHeader.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "image/") {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Format berkas harus berupa gambar (JPG, PNG, WebP, atau GIF).",
			})
		}

		file, err := fileHeader.Open()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal membaca berkas gambar yang diunggah.",
			})
		}
		defer file.Close()

		folder := c.FormValue("folder", "skomda/admin-uploads")
		if cldClient != nil && cldClient.CloudName != "" && cldClient.APIKey != "" {
			uploadRes, err := cldClient.UploadImage(c.Context(), file, fileHeader.Filename, folder)
			if err == nil && uploadRes != nil && uploadRes.SecureURL != "" {
				return c.JSON(fiber.Map{
					"success":   true,
					"url":       uploadRes.SecureURL,
					"public_id": uploadRes.PublicID,
					"format":    uploadRes.Format,
				})
			}
			log.Printf("peringatan: upload langsung Cloudinary gagal: %v, beralih ke penyimpanan lokal...", err)
		}

		// Fallback simpan lokal jika koneksi Cloudinary offline
		uniqueName := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), slugify(strings.TrimSuffix(fileHeader.Filename, ext)), ext)
		localDir := os.Getenv("UPLOAD_DIR")
		if localDir == "" {
			if _, err := os.Stat("../frontend/public"); err == nil {
				localDir = "../frontend/public/uploads"
			} else {
				localDir = "./uploads"
			}
		}
		_ = os.MkdirAll(localDir, 0755)
		destPath := filepath.Join(localDir, uniqueName)
		if err := c.SaveFile(fileHeader, destPath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal menyimpan berkas gambar ke server.",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"url":     "/uploads/" + uniqueName,
		})
	})

	api.Post("/upload/document", middleware.AuthMiddleware(cfg.JWTSecret), func(c *fiber.Ctx) error {
		fileHeader, err := c.FormFile("file")
		if err != nil {
			fileHeader, err = c.FormFile("document")
		}
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Berkas dokumen tidak ditemukan. Silakan pilih berkas dokumen.",
			})
		}

		// Validasi format berkas dokumen
		ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
		allowedExts := map[string]bool{
			".pdf":  true,
			".doc":  true,
			".docx": true,
			".xls":  true,
			".xlsx": true,
			".ppt":  true,
			".pptx": true,
			".zip":  true,
			".rar":  true,
			".txt":  true,
			".csv":  true,
		}
		if !allowedExts[ext] {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Format berkas tidak didukung. Format yang diizinkan: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, TXT, CSV.",
			})
		}

		if fileHeader.Size <= 0 || fileHeader.Size > 15*1024*1024 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Ukuran berkas dokumen tidak valid atau melebihi batas maksimum 15 MB.",
			})
		}

		fileType := strings.ToUpper(strings.TrimPrefix(ext, "."))
		var fileSize string
		bytes := fileHeader.Size
		if bytes < 1024 {
			fileSize = fmt.Sprintf("%d B", bytes)
		} else if bytes < 1024*1024 {
			fileSize = fmt.Sprintf("%.1f KB", float64(bytes)/1024)
		} else {
			fileSize = fmt.Sprintf("%.1f MB", float64(bytes)/(1024*1024))
		}

		file, err := fileHeader.Open()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal membaca berkas dokumen yang diunggah.",
			})
		}
		defer file.Close()

		folder := c.FormValue("folder", "skomda/documents")
		if cldClient != nil && cldClient.CloudName != "" && cldClient.APIKey != "" {
			uploadRes, err := cldClient.UploadRaw(c.Context(), file, fileHeader.Filename, folder)
			if err == nil && uploadRes != nil && uploadRes.SecureURL != "" {
				return c.JSON(fiber.Map{
					"success":      true,
					"url":          uploadRes.SecureURL,
					"public_id":    uploadRes.PublicID,
					"format":       fileType,
					"fileSize":     fileSize,
					"originalName": fileHeader.Filename,
				})
			}
			log.Printf("peringatan: upload dokumen Cloudinary gagal: %v, beralih ke penyimpanan lokal...", err)
		}

		// Fallback simpan lokal di folder frontend/public/documents
		cleanBase := slugify(strings.TrimSuffix(fileHeader.Filename, ext))
		if cleanBase == "" {
			cleanBase = "dokumen"
		}
		uniqueName := fmt.Sprintf("%s-%d%s", cleanBase, time.Now().Unix(), ext)
		localDir := os.Getenv("DOCUMENTS_DIR")
		if localDir == "" {
			if _, err := os.Stat("../frontend/public"); err == nil {
				localDir = "../frontend/public/documents"
			} else {
				localDir = "./documents"
			}
		}
		_ = os.MkdirAll(localDir, 0755)
		destPath := filepath.Join(localDir, uniqueName)
		if err := c.SaveFile(fileHeader, destPath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal menyimpan berkas dokumen ke server.",
			})
		}

		return c.JSON(fiber.Map{
			"success":      true,
			"url":          "/documents/" + uniqueName,
			"format":       fileType,
			"fileSize":     fileSize,
			"originalName": fileHeader.Filename,
		})
	})

	// 6. Entitas Tambahan Panel Admin (Guru, Prestasi, BKK, Ekskul, Fasilitas, Dokumen, Settings)
	registerCrudRoutes(api, cfg)

	return app
}

func slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	reg := regexp.MustCompile(`[^a-z0-9]+`)
	s = reg.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

func isDtpQuery(msg string) bool {
	lower := strings.ToLower(strings.TrimSpace(msg))
	matched, _ := regexp.MatchString(`\bdtp\b`, lower)
	if matched {
		return true
	}
	if strings.Contains(lower, "digital talent") {
		return true
	}
	if (strings.Contains(lower, "9") || strings.Contains(lower, "sembilan")) &&
		(strings.Contains(lower, "spesialisasi") || strings.Contains(lower, "peminatan") || strings.Contains(lower, "keahlian") || strings.Contains(lower, "track")) {
		return true
	}
	if strings.Contains(lower, "spesialisasi") && (strings.Contains(lower, "skomda") || strings.Contains(lower, "telkom") || strings.Contains(lower, "program")) {
		return true
	}
	return false
}

func isDtpInternshipOrCareerQuery(lower string) bool {
	return strings.Contains(lower, "magang") ||
		strings.Contains(lower, "karir") ||
		strings.Contains(lower, "karier") ||
		strings.Contains(lower, "prospek") ||
		strings.Contains(lower, "kerja") ||
		strings.Contains(lower, "pkl") ||
		strings.Contains(lower, "prakerin") ||
		strings.Contains(lower, "bkk") ||
		strings.Contains(lower, "lulusan") ||
		strings.Contains(lower, "internship") ||
		strings.Contains(lower, "career")
}

func isDtpCertificationsQuery(lower string) bool {
	return strings.Contains(lower, "sertifikasi") ||
		strings.Contains(lower, "sertifikat") ||
		strings.Contains(lower, "certification") ||
		strings.Contains(lower, "certificate") ||
		strings.Contains(lower, "ccna") ||
		strings.Contains(lower, "aws") ||
		strings.Contains(lower, "mtcna") ||
		strings.Contains(lower, "bnsp")
}

func isDtp9SpecializationsListQuery(lower string) bool {
	return (strings.Contains(lower, "9") || strings.Contains(lower, "sembilan") || strings.Contains(lower, "apa saja") || strings.Contains(lower, "daftar") || strings.Contains(lower, "sebutkan") || strings.Contains(lower, "list")) &&
		(strings.Contains(lower, "spesialisasi") || strings.Contains(lower, "peminatan") || strings.Contains(lower, "specialization") || strings.Contains(lower, "keahlian") || strings.Contains(lower, "track"))
}

func getDtp9SpecializationsListResponse() string {
	return `### 9 Spesialisasi Industri Digital Talent Program (DTP) SMK Telkom Sidoarjo

SMK Telkom Sidoarjo menyediakan **9 Pilihan Spesialisasi Industri** dalam Digital Talent Program yang dikelompokkan ke dalam 4 klaster keahlian utama:

#### 1. Klaster Software & Artificial Intelligence
- **Software Developer:** Pembuatan website dan aplikasi modern, perancangan database terstruktur, RESTful API, penguasaan framework modern (Laravel, React, Node.js), hingga deployment aplikasi dengan container Docker di Linux Server.
- **Artificial Intelligence (AI) Specialist:** Pengembangan kecerdasan buatan terapan, pemrograman Python untuk data & AI, analisis data (EDA), Machine Learning, Deep Learning, Natural Language Processing (NLP), Computer Vision, dan implementasi model AI siap pakai untuk kebutuhan industri.

#### 2. Klaster Network & Cloud Computing
- **Network System Administrator:** Pengelolaan dan pemeliharaan server fisik maupun virtual (Linux Server, Windows Server, Proxmox, VMware) agar operasional sistem enterprise stabil, aman, dan memiliki ketersediaan tinggi (*high availability*).
- **Network Infrastructure Engineer:** Pembangunan infrastruktur jaringan telekomunikasi berkecepatan tinggi: terminasi & penyambungan kabel fiber optic (*splicing*), pengukuran OTDR, konfigurasi OLT/ONT, serta routing & switching MikroTik.
- **Cloud Engineer:** Penyusunan dan pengelolaan arsitektur cloud computing (AWS, Google Cloud Platform, Microsoft Azure), virtualisasi, Docker containerization, otomasi pipeline CI/CD (GitHub Actions), serta sistem observabilitas/monitoring server.

#### 3. Klaster Hardware & Cyber Security
- **Internet of Things (IoT) Engineer:** Integrasi perangkat keras dan internet: pemrograman mikrokontroler (ESP32 / MicroPython), sensor cerdas & aktuator industri, komunikasi data protokol IoT (MQTT & HTTP), serta dashboard monitoring real-time.
- **Cyber Security Specialist:** Keamanan sistem informasi dan infrastruktur data: identifikasi kerentanan (*vulnerability assessment*), pengujian penetrasi (*penetration testing* web & network), pertahanan jaringan, ethical hacking, dan pemahaman fondasi Security Operations Center (SOC).

#### 4. Klaster Design & Creative Media
- **Visual Communication Designer:** Eksplorasi komunikasi visual terpadu: perancangan identitas brand, desain UI/UX & interactive prototyping Figma, motion graphics, videografi & fotografi profesional, serta produksi konten digital kreatif.
- **Digital Marketing Specialist:** Strategi pemasaran digital komprehensif: riset pasar & buyer persona, creative copywriting, optimasi mesin pencari (SEO & SEM Google Ads), periklanan berbayar media sosial (Meta Ads Manager), dan analitik performa konversi.

Pelajari silabus lengkap dan portofolio karya di halaman resmi [Digital Talent Program](/program/digital-talent).`
}

func getDtpInternshipCareerResponse() string {
	return `### Peluang Magang & Prospek Karir Lulusan DTP SMK Telkom Sidoarjo

Siswa peserta **Digital Talent Program (DTP)** di SMK Telkom Sidoarjo memiliki keunggulan kompetitif tinggi di dunia kerja berkat metode *Project-Based Learning* dan portofolio riil berstandar industri.

#### 1. Peluang Magang Industri (Prakerin 6 Bulan)
Siswa DTP diterjunkan langsung dalam program Praktik Kerja Industri (PKL) selama 6 bulan penuh di berbagai mitra industri nasional bereputasi tinggi:
- **Telkom Group Ecosystem:** PT Telkom Indonesia, PT Telkom Akses, Telkomsel, dan PT Infomedia Nusantara.
- **Penyedia Data Center & Cloud:** Wowrack Indonesia, Jagoan Hosting, dan mitra infrastruktur server.
- **Internet Service Provider (ISP):** CitraNet, Hypernet, dan penyedia jaringan fiber optic regional/nasional.
- **Software House & Creative Agency:** Berbagai studio pengembang aplikasi web/mobile, agensi pemasaran digital, dan rumah produksi multimedia.

Selama magang, siswa menangani project riil seperti perancangan API, konfigurasi server, perbaikan redaman fiber optic, hingga pengujian keamanan sistem. Kinerja magang yang unggul membuka peluang rekrutmen kerja langsung (*on-campus recruitment*) oleh industri bahkan sebelum prosesi wisuda.

#### 2. Prospek Karir Berdasarkan Spesialisasi
Lulusan dibekali sertifikasi global (Cisco CCNA/CCST, AWS Cloud, Oracle Java, MikroTik MTCNA, dan BNSP) yang membuka peluang profesi strategis:
- **Bidang Software & AI:** Full-Stack Developer, Frontend/Backend Engineer, Mobile App Developer, Junior AI/ML Engineer, dan Data Analyst.
- **Bidang Network & Cloud:** Cloud Support Associate, DevOps Junior Engineer, Linux System Administrator, Network Operations Center (NOC) Engineer, dan Fiber Optic Specialist.
- **Bidang Hardware & Keamanan:** IoT Solutions Engineer, Junior Cybersecurity Analyst, Penetration Tester, dan Hardware Integration Specialist.
- **Bidang Desain & Pemasaran:** UI/UX Designer, Visual Brand Designer, Digital Marketing Strategist, SEO Specialist, dan Content Strategist.

#### 3. Penyaluran Kerja Terpadu via BKK Skomda
Sekolah memiliki unit resmi **Bursa Kerja Khusus (BKK)** yang secara aktif:
- Menyelenggarakan seleksi kerja langsung di sekolah (*on-campus recruitment*).
- Memfasilitasi bimbingan karir, simulasi wawancara kerja, dan uji portofolio profesional.
- Mendukung siswa yang ingin merintis startup digital mandiri melalui inkubator kewirausahaan **SKOMDA KUBIK**.
- Memfasilitasi siswa yang ingin melanjutkan kuliah ke perguruan tinggi mitra (seperti Telkom University melalui program beasiswa *One Pipe Education System* / OPES).

Informasi lebih lanjut dapat dilihat di [Profil Jurusan & BKK](/program/profil-jurusan#prospek-karir) serta [Digital Talent Program](/program/digital-talent).`
}

func getDtpCertificationsResponse() string {
	return `### Sertifikasi Internasional & Industri Digital Talent Program (DTP)

Untuk memastikan kompetensi siswa diakui secara global, setiap peserta DTP di SMK Telkom Sidoarjo dipersiapkan dan difasilitasi meraih sertifikasi resmi:

1. **Cisco Certified (CCNA & CCST)**
   - *Cisco Certified Support Technician (CCST)* Networking & Cybersecurity.
   - *Cisco Certified Network Associate (CCNA)* untuk kompetensi routing, switching, dan keamanan jaringan enterprise.

2. **AWS Certified (via AWS Academy)**
   - *AWS Certified Cloud Practitioner* untuk fondasi arsitektur komputasi awan.
   - *AWS Academy Cloud Architecting* untuk perancangan sistem cloud skala enterprise.

3. **MikroTik Certified Network Associate (MTCNA)**
   - Standarisasi internasional pengelolaan jaringan, routing MikroTik RouterOS, firewall, bandwidth management, dan tunneling.

4. **Oracle Academy**
   - *Java Foundations* dan *Database Foundations* untuk standarisasi pemrograman berorientasi objek dan arsitektur database relasional.

5. **Sertifikasi Kompetensi BNSP (Badan Nasional Sertifikasi Profesi)**
   - Sertifikasi profesi berstandar nasional Indonesia yang diterbitkan oleh Lembaga Sertifikasi Profesi (LSP) pihak pertama di SMK Telkom Sidoarjo.

Sertifikasi ini menjadi bukti validasi keahlian yang sangat diperhitungkan oleh HRD industri saat rekrutmen kerja maupun seleksi beasiswa kuliah.

Pelajari jadwal dan kurikulum sertifikasi di halaman resmi [Kurikulum DTP](/program/digital-talent#kurikulum).`
}

func getDtpKnowledgeResponse() string {
	return `### Digital Talent Program (DTP) SMK Telkom Sidoarjo

**Digital Talent Program (DTP)** adalah program unggulan dan inisiatif strategis di SMK Telkom Sidoarjo yang dirancang untuk membekali siswa dengan kompetensi teknologi digital mutakhir berstandar industri global serta sertifikasi internasional resmi.

Melalui DTP, siswa tidak hanya belajar teori di kelas, tetapi juga langsung mempraktikkan keahliannya melalui project nyata (*Project-Based Learning*), inkubasi karya digital, dan pendampingan intensif dari mentor praktisi industri.

Di SMK Telkom Sidoarjo, terdapat **9 Pilihan Spesialisasi / Peminatan DTP**:

1. **Software Developer** (*Kategori: Software & AI*)
   Fokus pada pembuatan website dan aplikasi modern: perancangan database terstruktur, arsitektur RESTful API, penguasaan framework modern (Laravel, React, Node.js), hingga deployment aplikasi berbasis container (Docker & Linux Server).

2. **Network System Administrator** (*Kategori: Network & Cloud*)
   Pengelolaan dan pemeliharaan server fisik maupun virtual (Linux Server, Windows Server, Proxmox, VMware) agar operasional sistem enterprise berjalan aman, stabil, dan memiliki ketersediaan tinggi (*high availability*).

3. **Network Infrastructure Engineer** (*Kategori: Network & Cloud*)
   Pembangunan dan pengelolaan infrastruktur jaringan telekomunikasi berkecepatan tinggi: terminasi & penyambungan kabel fiber optic (*splicing*), pengukuran OTDR, konfigurasi perangkat OLT/ONT, serta routing & switching MikroTik.

4. **Visual Communication Designer** (*Kategori: Design & Creative*)
   Eksplorasi komunikasi visual terpadu: perancangan identitas brand, desain antarmuka pengguna (UI/UX Design & interactive prototyping Figma), motion graphics, videografi & fotografi profesional, serta produksi konten digital kreatif.

5. **Internet of Things (IoT) Engineer** (*Kategori: Hardware & Security*)
   Integrasi perangkat keras dan internet: pemrograman mikrokontroler (ESP32 / MicroPython), sensor cerdas dan aktuator industri, komunikasi data protokol IoT (MQTT & HTTP), serta dashboard monitoring real-time.

6. **Cloud Engineer** (*Kategori: Network & Cloud*)
   Penyusunan dan pengelolaan arsitektur cloud computing (AWS, Google Cloud Platform, Microsoft Azure): virtualisasi, containerization Docker, otomasi pipeline CI/CD (GitHub Actions), dan sistem observabilitas/monitoring server.

7. **Artificial Intelligence (AI) Specialist** (*Kategori: Software & AI*)
   Pengembangan kecerdasan buatan terapan: pemrograman Python untuk data & AI, analisis data (EDA), Machine Learning, Deep Learning, Natural Language Processing (NLP), Computer Vision, serta implementasi model AI siap pakai untuk kebutuhan industri.

8. **Digital Marketing Specialist** (*Kategori: Design & Creative*)
   Strategi pemasaran digital komprehensif: riset pasar dan buyer persona, creative copywriting, optimasi mesin pencari (SEO & SEM Google Ads), periklanan berbayar media sosial (Meta Ads Manager), dan analitik performa konversi.

9. **Cyber Security Specialist** (*Kategori: Hardware & Security*)
   Keamanan sistem informasi dan infrastruktur data: identifikasi kerentanan (*vulnerability assessment*), pengujian penetrasi keamanan (*penetration testing* web & network), pertahanan jaringan, ethical hacking, serta pemahaman fondasi Security Operations Center (SOC).

---

**Dukungan Sertifikasi Internasional & Industri:**
Siswa DTP dipersiapkan untuk meraih sertifikasi keahlian berstandar global yang diakui industri:
- **Cisco Certified** (CCNA & CCST Networking / CyberOps)
- **AWS Certified** (AWS Cloud Practitioner & Architecting via AWS Academy)
- **MikroTik Certified** (MTCNA: MikroTik Certified Network Associate)
- **Oracle Academy** (Java & Database Foundations)
- **Sertifikasi Kompetensi BNSP**

Pelajari silabus lengkap, portofolio karya, dan prospek karir di halaman resmi [Digital Talent Program](/program/digital-talent).`
}
