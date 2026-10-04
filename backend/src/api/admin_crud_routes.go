package api

import (
	crand "crypto/rand"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/haristhropic/skomda-website/backend/src/api/middleware"
	"github.com/haristhropic/skomda-website/backend/src/audit"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/models"
)

// registerCrudRoutes mendaftarkan seluruh endpoint CRUD untuk Guru, Prestasi, BKK, Ekskul, Fasilitas, Dokumen, dan Pengaturan.
func registerCrudRoutes(api fiber.Router, cfg config.Config) {
	authGuard := middleware.AuthMiddleware(cfg.JWTSecret)

	// ==================== 1. TEACHERS / GURU & STAF ====================
	teacherGroup := api.Group("/teachers")
	teacherGroup.Get("", func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		query := requestDB(c).Model(&models.Teacher{}).Order("order_index ASC, id ASC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		var list []models.Teacher
		if err := query.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data guru"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	teacherGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Teacher
		if err := parseContentBody(c, &item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(item.Name) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Nama guru/staf wajib diisi"})
		}
		if err := requestDB(c).Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan data guru"})
		}
		recordAudit(c, "CREATE", "teacher", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan guru: %s (%s)", item.Name, item.Role))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Data guru berhasil ditambahkan", "data": item})
	})

	teacherGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Teacher
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		if err := parseContentBody(c, &existing); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if id > 0 {
			existing.ID = uint(id)
		}
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "teacher", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui profil guru: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Data guru berhasil diperbarui", "data": existing})
	})

	teacherGroup.Delete("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Teacher
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data guru tidak ditemukan"})
		}
		result := requestDB(c).Delete(&existing)
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "teacher", fmt.Sprint(id), fmt.Sprintf("Menghapus data guru: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Data guru berhasil dihapus"})
	})

	// ==================== 2. PRESTASI SISWA ====================
	prestasiGroup := api.Group("/prestasi")
	prestasiGroup.Get("", func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		year := strings.TrimSpace(c.Query("year"))
		query := requestDB(c).Model(&models.Prestasi{}).Order("id DESC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		if year != "" && !strings.EqualFold(year, "semua") {
			query = query.Where("year = ?", year)
		}
		var list []models.Prestasi
		if err := query.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data prestasi"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	prestasiGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Prestasi
		if err := parseContentBody(c, &item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(item.Title) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Judul prestasi wajib diisi"})
		}
		if strings.TrimSpace(item.Slug) == "" {
			item.Slug = slugify(item.Title)
		}
		if err := requestDB(c).Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan prestasi"})
		}
		recordAudit(c, "CREATE", "prestasi", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan prestasi: %s (%s)", item.Title, item.Award))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Data prestasi berhasil disimpan", "data": item})
	})

	prestasiGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Prestasi
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		if err := parseContentBody(c, &existing); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if id > 0 {
			existing.ID = uint(id)
		}
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "prestasi", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui prestasi: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Data prestasi berhasil diperbarui", "data": existing})
	})

	prestasiGroup.Delete("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Prestasi
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data prestasi tidak ditemukan"})
		}
		result := requestDB(c).Delete(&existing)
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "prestasi", fmt.Sprint(id), fmt.Sprintf("Menghapus prestasi: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Data prestasi berhasil dihapus"})
	})

	// ==================== 3. BKK (BURSA KERJA & MITRA) ====================
	bkkGroup := api.Group("/bkk")
	listBKKJobs := func(c *fiber.Ctx, publicOnly bool) error {
		query := requestDB(c).Model(&models.BKKJob{}).Order("id DESC")
		if publicOnly {
			query = query.Where("LOWER(status) = ?", "active")
		} else if status := strings.TrimSpace(c.Query("status")); status != "" && !strings.EqualFold(status, "semua") {
			query = query.Where("LOWER(status) = ?", strings.ToLower(status))
		}
		var list []models.BKKJob
		if err := query.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil lowongan kerja"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	}
	adminGroup := api.Group("/admin", authGuard)
	adminGroup.Get("/bkk/jobs", middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		return listBKKJobs(c, false)
	})
	bkkGroup.Get("/jobs", func(c *fiber.Ctx) error {
		return listBKKJobs(c, true)
	})

	// Public endpoint: Pasang Lowongan oleh Mitra / Perusahaan / Pengguna Publik
	// Status selalu otomatis 'pending' (menunggu verifikasi admin agar tidak langsung tayang jika tidak valid)
	bkkSubmitLimiter := middleware.SharedRateLimit("job-submit", 5, 10*time.Minute)
	bkkGroup.Post("/jobs/submit", bkkSubmitLimiter, func(c *fiber.Ctx) error {
		var item models.BKKJob
		if err := parseContentBody(c, &item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Format permohonan lowongan tidak valid"})
		}
		if strings.TrimSpace(item.Title) == "" || strings.TrimSpace(item.Company) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Posisi yang dibuka dan nama perusahaan wajib diisi"})
		}

		item.Status = "pending"
		item.Source = "mitra"
		if strings.TrimSpace(item.Location) == "" {
			item.Location = "Sidoarjo / Fleksibel"
		}
		if strings.TrimSpace(item.JobType) == "" {
			item.JobType = "Full Time"
		}
		if strings.TrimSpace(item.CompanyLogo) == "" {
			item.CompanyLogo = "/images/partners/logo-telkom-indonesia.jpg"
		}
		if strings.TrimSpace(item.Deadline) == "" {
			item.Deadline = "Segera"
		}

		if err := requestDB(c).Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan pengajuan lowongan kerja"})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Pengajuan lowongan berhasil terkirim. Menunggu verifikasi dan persetujuan dari tim BKK SKOMDA.",
			"data":    item,
		})
	})

	bkkGroup.Post("/jobs", authGuard, func(c *fiber.Ctx) error {
		var item models.BKKJob
		if err := parseContentBody(c, &item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if role, _ := c.Locals("user_role").(string); !strings.EqualFold(role, "super_admin") {
			// Editor boleh menyiapkan lowongan, tetapi hanya super admin yang dapat menerbitkannya.
			item.Status = "pending"
			item.Source = "admin"
		}
		if strings.TrimSpace(item.Status) == "" {
			item.Status = "active"
		}
		if strings.TrimSpace(item.Source) == "" {
			item.Source = "admin"
		}
		requestDB(c).Create(&item)
		recordAudit(c, "CREATE", "bkk_job", fmt.Sprint(item.ID), fmt.Sprintf("Membuat lowongan: %s di %s", item.Title, item.Company))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Lowongan kerja berhasil ditambahkan", "data": item})
	})

	// Endpoint khusus update status (ACC/Setujui, Tolak, atau Tutup) oleh Admin
	bkkGroup.Put("/jobs/:id/status", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var input struct {
			Status string `json:"status"`
		}
		if err := c.BodyParser(&input); err != nil || strings.TrimSpace(input.Status) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Status tidak valid"})
		}
		var existing models.BKKJob
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lowongan tidak ditemukan"})
		}
		oldStatus := existing.Status
		existing.Status = strings.ToLower(strings.TrimSpace(input.Status))
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		var actionDesc string
		switch existing.Status {
		case "active":
			actionDesc = fmt.Sprintf("Menyetujui (ACC) lowongan: %s (%s)", existing.Title, existing.Company)
		case "rejected":
			actionDesc = fmt.Sprintf("Menolak pengajuan lowongan: %s (%s)", existing.Title, existing.Company)
		default:
			actionDesc = fmt.Sprintf("Memperbarui status lowongan '%s' dari %s menjadi %s", existing.Title, oldStatus, existing.Status)
		}
		recordAudit(c, "STATUS_UPDATE", "bkk_job", fmt.Sprint(id), actionDesc)
		return c.JSON(fiber.Map{"message": "Status lowongan berhasil diperbarui", "data": existing})
	})

	bkkGroup.Put("/jobs/:id", authGuard, func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.BKKJob
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lowongan tidak ditemukan"})
		}
		originalStatus, originalSource := existing.Status, existing.Source
		parseContentBody(c, &existing)
		existing.ID = uint(id)
		if role, _ := c.Locals("user_role").(string); !strings.EqualFold(role, "super_admin") {
			// Status dan asal pengajuan tidak dapat diubah lewat endpoint edit umum.
			existing.Status = originalStatus
			existing.Source = originalSource
		}
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "bkk_job", fmt.Sprint(id), fmt.Sprintf("Memperbarui lowongan: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Lowongan berhasil diperbarui", "data": existing})
	})

	bkkGroup.Delete("/jobs/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.BKKJob
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lowongan tidak ditemukan"})
		}
		result := requestDB(c).Delete(&existing)
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "bkk_job", fmt.Sprint(id), fmt.Sprintf("Menghapus lowongan: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Lowongan berhasil dihapus"})
	})

	bkkGroup.Get("/partners", func(c *fiber.Ctx) error {
		var list []models.BKKPartner
		if err := requestDB(c).Order("order_index ASC, id ASC").Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(503).JSON(fiber.Map{"error": "Data sementara belum dapat dimuat"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	bkkGroup.Post("/partners", authGuard, func(c *fiber.Ctx) error {
		var item models.BKKPartner
		parseContentBody(c, &item)
		requestDB(c).Create(&item)
		recordAudit(c, "CREATE", "bkk_partner", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan mitra industri: %s", item.Name))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Mitra berhasil ditambahkan", "data": item})
	})

	bkkGroup.Put("/partners/:id", authGuard, func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.BKKPartner
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Mitra tidak ditemukan"})
		}
		var input models.BKKPartner
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		existing.Name = input.Name
		existing.Category = input.Category
		existing.Logo = input.Logo
		existing.Description = input.Description
		existing.Website = input.Website
		if input.OrderIndex > 0 {
			existing.OrderIndex = input.OrderIndex
		}
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "bkk_partner", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui mitra industri: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Mitra berhasil diperbarui", "data": existing})
	})

	bkkGroup.Delete("/partners/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		result := requestDB(c).Delete(&models.BKKPartner{}, uint(id))
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "bkk_partner", fmt.Sprint(id), "Menghapus mitra industri")
		return c.JSON(fiber.Map{"message": "Mitra berhasil dihapus"})
	})

	// ==================== 4. EKSTRAKURIKULER ====================
	ekskulGroup := api.Group("/ekskul")
	ekskulGroup.Get("", func(c *fiber.Ctx) error {
		var list []models.Ekstrakurikuler
		if err := requestDB(c).Order("order_index ASC, id ASC").Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(503).JSON(fiber.Map{"error": "Data sementara belum dapat dimuat"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	ekskulGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Ekstrakurikuler
		parseContentBody(c, &item)
		if item.Slug == "" {
			item.Slug = slugify(item.Name)
		}
		requestDB(c).Create(&item)
		recordAudit(c, "CREATE", "ekskul", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan ekstrakurikuler: %s", item.Name))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Ekstrakurikuler berhasil ditambahkan", "data": item})
	})

	ekskulGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Ekstrakurikuler
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		parseContentBody(c, &existing)
		existing.ID = uint(id)
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "ekskul", fmt.Sprint(id), fmt.Sprintf("Memperbarui ekstrakurikuler: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Ekstrakurikuler berhasil diperbarui", "data": existing})
	})

	ekskulGroup.Delete("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		result := requestDB(c).Delete(&models.Ekstrakurikuler{}, uint(id))
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "ekskul", fmt.Sprint(id), "Menghapus ekstrakurikuler")
		return c.JSON(fiber.Map{"message": "Ekstrakurikuler berhasil dihapus"})
	})

	// ==================== 5. FASILITAS ====================
	fasilitasGroup := api.Group("/fasilitas")
	fasilitasGroup.Get("", func(c *fiber.Ctx) error {
		var list []models.Fasilitas
		if err := requestDB(c).Order("order_index ASC, id ASC").Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(503).JSON(fiber.Map{"error": "Data sementara belum dapat dimuat"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	fasilitasGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Fasilitas
		parseContentBody(c, &item)
		requestDB(c).Create(&item)
		recordAudit(c, "CREATE", "fasilitas", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan fasilitas: %s", item.Name))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Fasilitas berhasil ditambahkan", "data": item})
	})

	fasilitasGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Fasilitas
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		parseContentBody(c, &existing)
		existing.ID = uint(id)
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "fasilitas", fmt.Sprint(id), fmt.Sprintf("Memperbarui fasilitas: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Fasilitas berhasil diperbarui", "data": existing})
	})

	fasilitasGroup.Delete("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		result := requestDB(c).Delete(&models.Fasilitas{}, uint(id))
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "fasilitas", fmt.Sprint(id), "Menghapus fasilitas")
		return c.JSON(fiber.Map{"message": "Fasilitas berhasil dihapus"})
	})

	// ==================== 6. DOKUMEN & REGULASI ====================
	docGroup := api.Group("/documents")
	docGroup.Get("", func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		query := requestDB(c).Model(&models.Document{}).Where("is_public = ?", true).Order("order_index ASC, id ASC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		var list []models.Document
		if err := query.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(503).JSON(fiber.Map{"error": "Data sementara belum dapat dimuat"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})
	api.Get("/admin/documents", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		query := requestDB(c).Model(&models.Document{}).Order("order_index ASC, id ASC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		var list []models.Document
		if err := query.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil dokumen"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	// Endpoint publik: Mendapatkan dokumen Brosur PPDB aktif
	docGroup.Get("/active-brochure", func(c *fiber.Ctx) error {
		var activeDoc models.Document

		// 1. Cek konfigurasi ppdb_active_brochure_id di SiteSetting
		var setting models.SiteSetting
		err := requestDB(c).Where("key = ?", "ppdb_active_brochure_id").First(&setting).Error
		if err == nil && setting.Value != "" {
			if docID, errParse := strconv.ParseUint(setting.Value, 10, 32); errParse == nil && docID > 0 {
				if errDoc := requestDB(c).Where("id = ? AND is_public = ?", uint(docID), true).First(&activeDoc).Error; errDoc == nil {
					return c.JSON(fiber.Map{
						"success": true,
						"data":    activeDoc,
						"source":  "setting",
					})
				}
			}
		}

		// 2. Jika belum ditentukan, cari berkas publik berkategori Brosur PPDB atau yang judulnya mengandung Brosur
		err = requestDB(c).Where("is_public = ? AND (LOWER(category) = ? OR LOWER(title) LIKE ?)", true, "brosur ppdb", "%brosur%").
			Order("order_index ASC, id DESC").
			First(&activeDoc).Error
		if err == nil {
			return c.JSON(fiber.Map{
				"success": true,
				"data":    activeDoc,
				"source":  "auto",
			})
		}

		// 3. Fallback default jika database kosong
		fallback := models.Document{
			ID:          0,
			Title:       "Brosur PPDB SMK Telkom Sidoarjo 2026/2027",
			Category:    "Brosur PPDB",
			FileURL:     "/documents/brosur-ppdb-smk-telkom-sidoarjo-2026-2027.pdf",
			FileSize:    "8.0 MB",
			FileType:    "PDF",
			Description: "Informasi lengkap alur Penerimaan Peserta Didik Baru (PPDB), profil keahlian SIJA & TJAT, beasiswa, rincian biaya pendidikan, serta fasilitas unggulan.",
			IsPublic:    true,
		}
		return c.JSON(fiber.Map{
			"success": true,
			"data":    fallback,
			"source":  "fallback",
		})
	})

	// Endpoint terproteksi: Menetapkan dokumen tertentu sebagai Brosur PPDB aktif
	docGroup.Post("/active-brochure", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		var payload struct {
			DocumentID uint `json:"documentId"`
		}
		if err := c.BodyParser(&payload); err != nil || payload.DocumentID == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID Dokumen tidak valid"})
		}

		var targetDoc models.Document
		if err := requestDB(c).First(&targetDoc, payload.DocumentID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Dokumen tidak ditemukan"})
		}

		var setting models.SiteSetting
		err := requestDB(c).Where("key = ?", "ppdb_active_brochure_id").First(&setting).Error
		valStr := fmt.Sprint(payload.DocumentID)
		if err != nil {
			setting = models.SiteSetting{
				Key:         "ppdb_active_brochure_id",
				Value:       valStr,
				Category:    "ppdb",
				Description: "ID Dokumen brosur PPDB resmi yang aktif tampil di halaman PPDB",
				UpdatedAt:   time.Now(),
			}
			requestDB(c).Create(&setting)
		} else {
			setting.Value = valStr
			setting.UpdatedAt = time.Now()
			if err := requestDB(c).Save(&setting).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan pengaturan"})
			}
		}

		recordAudit(c, "UPDATE", "setting", "ppdb_active_brochure_id", fmt.Sprintf("Menetapkan brosur PPDB aktif: %s (ID: %d)", targetDoc.Title, targetDoc.ID))
		return c.JSON(fiber.Map{
			"message": "Brosur PPDB aktif berhasil diperbarui",
			"data":    targetDoc,
		})
	})

	docGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Document
		parseContentBody(c, &item)
		requestDB(c).Create(&item)
		recordAudit(c, "CREATE", "document", fmt.Sprint(item.ID), fmt.Sprintf("Mengunggah dokumen: %s", item.Title))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Dokumen berhasil disimpan", "data": item})
	})

	docGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Document
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		parseContentBody(c, &existing)
		existing.ID = uint(id)
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "document", fmt.Sprint(id), fmt.Sprintf("Memperbarui dokumen: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Dokumen berhasil diperbarui", "data": existing})
	})

	docGroup.Delete("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		result := requestDB(c).Delete(&models.Document{}, uint(id))
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "document", fmt.Sprint(id), "Menghapus dokumen")
		return c.JSON(fiber.Map{"message": "Dokumen berhasil dihapus"})
	})

	// ==================== 7. SITE SETTINGS ====================
	settingsGroup := api.Group("/settings")
	settingsGroup.Get("", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		list := []models.SiteSetting{}
		if err := requestDB(c).Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(503).JSON(fiber.Map{"error": "Data sementara tidak tersedia"})
		}
		settingsMap := make(map[string]string)
		for _, s := range list {
			settingsMap[s.Key] = s.Value
		}
		return c.JSON(fiber.Map{"data": list, "map": settingsMap})
	})

	settingsGroup.Put("/:key", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		key := strings.TrimSpace(c.Params("key"))
		var payload struct {
			Value string `json:"value"`
		}
		c.BodyParser(&payload)

		var item models.SiteSetting
		err := requestDB(c).Where("key = ?", key).First(&item).Error
		if err != nil {
			item = models.SiteSetting{Key: key, Value: payload.Value, UpdatedAt: time.Now()}
			requestDB(c).Create(&item)
		} else {
			item.Value = payload.Value
			item.UpdatedAt = time.Now()
			if err := requestDB(c).Save(&item).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan pengaturan"})
			}
		}
		recordAudit(c, "UPDATE", "setting", key, fmt.Sprintf("Mengubah pengaturan %s: %s", key, payload.Value))
		return c.JSON(fiber.Map{"message": "Pengaturan berhasil diperbarui", "data": item})
	})

	// ==================== 8. ALUMNI / DATA KELULUSAN ====================
	alumniGroup := api.Group("/alumni")
	alumniGroup.Get("", func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		q := strings.TrimSpace(c.Query("q"))
		limitStr := strings.TrimSpace(c.Query("limit"))
		offsetStr := strings.TrimSpace(c.Query("offset"))

		query := requestDB(c).Model(&models.Alumni{}).Order("id ASC")

		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(kategori) = ?", strings.ToLower(category))
		}
		if q != "" {
			query = query.Where("LOWER(name) LIKE ? OR LOWER(institusi) LIKE ? OR LOWER(keterangan) LIKE ?",
				"%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%")
		}

		var total int64
		query.Count(&total)

		if limitStr != "" {
			if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 {
				query = query.Limit(limit)
			}
		}
		if offsetStr != "" {
			if offset, err := strconv.Atoi(offsetStr); err == nil && offset >= 0 {
				query = query.Offset(offset)
			}
		}

		var list []models.Alumni
		if err := query.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data alumni"})
		}
		publicList := make([]fiber.Map, 0, len(list))
		for _, item := range list {
			publicList = append(publicList, fiber.Map{
				"id": item.ID, "name": item.Name, "angkatan": item.Angkatan,
				"tahunLulus": item.TahunLulus, "tahunAjaran": item.TahunAjaran,
				"statusKelulusan": item.StatusKelulusan, "kategori": item.Kategori,
				"statusAktivitas": item.StatusAktivitas, "keterangan": item.Keterangan,
				"institusi": item.Institusi, "jurusan": item.Jurusan,
			})
		}
		return c.JSON(fiber.Map{"data": publicList, "total": total})
	})
	api.Get("/admin/alumni", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		q := strings.TrimSpace(c.Query("q"))
		query := requestDB(c).Model(&models.Alumni{}).Order("id ASC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(kategori) = ?", strings.ToLower(category))
		}
		if q != "" {
			pattern := "%" + strings.ToLower(q) + "%"
			query = query.Where("LOWER(name) LIKE ? OR LOWER(nisn) LIKE ? OR LOWER(institusi) LIKE ? OR LOWER(keterangan) LIKE ?", pattern, pattern, pattern, pattern)
		}
		var total int64
		if err := query.Count(&total).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menghitung data alumni"})
		}
		if limit, err := strconv.Atoi(c.Query("limit")); err == nil && limit > 0 {
			query = query.Limit(limit)
		}
		if offset, err := strconv.Atoi(c.Query("offset")); err == nil && offset >= 0 {
			query = query.Offset(offset)
		}
		var list []models.Alumni
		if err := query.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data alumni"})
		}
		return c.JSON(fiber.Map{"data": list, "total": total})
	})

	alumniGroup.Get("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var item models.Alumni
		if err := requestDB(c).First(&item, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data siswa kelulusan tidak ditemukan"})
		}
		return c.JSON(fiber.Map{"data": item})
	})

	alumniGroup.Post("", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		var item models.Alumni
		if err := parseContentBody(c, &item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(item.Name) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Nama siswa wajib diisi"})
		}
		if strings.TrimSpace(item.StatusKelulusan) == "" {
			item.StatusKelulusan = "LULUS"
		}
		if strings.TrimSpace(item.TahunLulus) == "" {
			item.TahunLulus = "2024"
		}
		if strings.TrimSpace(item.TahunAjaran) == "" {
			item.TahunAjaran = "2023/2024"
		}
		if strings.TrimSpace(item.Angkatan) == "" {
			item.Angkatan = "6"
		}
		if strings.TrimSpace(item.Kategori) == "" {
			item.Kategori = "Alumni"
		}

		if err := requestDB(c).Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan data siswa"})
		}
		recordAudit(c, "CREATE", "alumni", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan siswa kelulusan: %s (NISN: %s)", item.Name, item.NISN))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Data kelulusan siswa berhasil ditambahkan", "data": item})
	})

	alumniGroup.Put("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Alumni
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data siswa tidak ditemukan"})
		}
		if err := parseContentBody(c, &existing); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		existing.ID = uint(id)
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "alumni", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui data siswa kelulusan: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Data siswa kelulusan berhasil diperbarui", "data": existing})
	})

	alumniGroup.Delete("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.Alumni
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data siswa tidak ditemukan"})
		}
		result := requestDB(c).Delete(&existing)
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "alumni", fmt.Sprint(id), fmt.Sprintf("Menghapus data siswa kelulusan: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Data siswa kelulusan berhasil dihapus"})
	})

	// ==================== 9. DIGITAL TALENT PROGRAM (DTP) ====================
	dtpGroup := api.Group("/dtp")
	listDTP := func(c *fiber.Ctx, publicOnly bool) error {
		category := strings.TrimSpace(c.Query("category"))
		q := strings.TrimSpace(c.Query("q"))
		query := requestDB(c).Model(&models.DigitalTalent{}).Order("order_index ASC, id ASC")
		if publicOnly {
			query = query.Where("is_active = ?", true)
		}
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		if q != "" {
			query = query.Where("LOWER(title) LIKE ? OR LOWER(short_desc) LIKE ? OR LOWER(core_skills) LIKE ? OR LOWER(tools) LIKE ?",
				"%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%")
		}
		var list []models.DigitalTalent
		if err := query.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data program digital talent"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	}
	dtpGroup.Get("", func(c *fiber.Ctx) error { return listDTP(c, true) })
	adminGroup.Get("/dtp", middleware.RequireRole("editor"), func(c *fiber.Ctx) error { return listDTP(c, false) })
	dtpGroup.Get("/:id", func(c *fiber.Ctx) error {
		param := strings.TrimSpace(c.Params("id"))
		var item models.DigitalTalent
		if id, err := strconv.ParseUint(param, 10, 32); err == nil && id > 0 {
			if err := requestDB(c).Where("is_active = ?", true).First(&item, uint(id)).Error; err == nil {
				return c.JSON(fiber.Map{"data": item})
			}
		}
		if err := requestDB(c).Where("is_active = ?", true).Where("LOWER(slug) = ?", strings.ToLower(param)).First(&item).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Program Digital Talent tidak ditemukan"})
		}
		return c.JSON(fiber.Map{"data": item})
	})

	dtpGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.DigitalTalent
		if err := parseContentBody(c, &item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(item.Title) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Judul spesialisasi DTP wajib diisi"})
		}
		if strings.TrimSpace(item.Slug) == "" {
			item.Slug = slugify(item.Title)
		}
		if strings.TrimSpace(item.Category) == "" {
			item.Category = "Software & AI"
		}
		if item.OrderIndex == 0 {
			var count int64
			requestDB(c).Model(&models.DigitalTalent{}).Count(&count)
			item.OrderIndex = int(count) + 1
		}
		item.IsActive = true

		if err := requestDB(c).Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan program digital talent"})
		}
		recordAudit(c, "CREATE", "dtp", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan spesialisasi DTP: %s", item.Title))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Program Digital Talent berhasil ditambahkan", "data": item})
	})

	dtpGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		param := strings.TrimSpace(c.Params("id"))
		var existing models.DigitalTalent
		var found bool

		if id, err := strconv.ParseUint(param, 10, 32); err == nil && id > 0 {
			if err := requestDB(c).First(&existing, uint(id)).Error; err == nil {
				found = true
			}
		}
		if !found {
			if err := requestDB(c).Where("LOWER(slug) = ?", strings.ToLower(param)).First(&existing).Error; err == nil {
				found = true
			}
		}

		if err := parseContentBody(c, &existing); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}

		if !found {
			return c.Status(404).JSON(fiber.Map{"error": "Program Digital Talent tidak ditemukan"})
		}

		if strings.TrimSpace(existing.Slug) == "" {
			existing.Slug = slugify(existing.Title)
		}
		if strings.TrimSpace(existing.Category) == "" {
			existing.Category = "Software & AI"
		}
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "dtp", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui spesialisasi DTP: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Program Digital Talent berhasil diperbarui", "data": existing})
	})

	dtpGroup.Delete("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.DigitalTalent
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Program Digital Talent tidak ditemukan"})
		}
		result := requestDB(c).Delete(&existing)
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "dtp", fmt.Sprint(id), fmt.Sprintf("Menghapus spesialisasi DTP: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Program Digital Talent berhasil dihapus"})
	})

	// ==================== 11. TRIAL CLASS REGISTRATIONS ====================
	trialGroup := api.Group("/trial-class")
	trialRegisterLimiter := middleware.SharedRateLimit("trial-register", 10, 10*time.Minute)

	// Public: Register for Trial Class
	trialGroup.Post("/register", trialRegisterLimiter, func(c *fiber.Ctx) error {
		if len(c.Body()) > 8*1024 {
			return c.Status(fiber.StatusRequestEntityTooLarge).JSON(fiber.Map{"error": "Ukuran data pendaftaran terlalu besar"})
		}
		var req struct {
			FullName     string `json:"fullName"`
			SchoolOrigin string `json:"schoolOrigin"`
			Whatsapp     string `json:"whatsapp"`
			Email        string `json:"email"`
			Major        string `json:"major"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(req.FullName) == "" || strings.TrimSpace(req.SchoolOrigin) == "" || strings.TrimSpace(req.Whatsapp) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Nama lengkap, asal sekolah, dan nomor WhatsApp wajib diisi"})
		}
		if strings.TrimSpace(req.Major) == "" {
			req.Major = "SIJA"
		}
		if utf8.RuneCountInString(strings.TrimSpace(req.FullName)) > 255 ||
			utf8.RuneCountInString(strings.TrimSpace(req.SchoolOrigin)) > 255 ||
			utf8.RuneCountInString(strings.TrimSpace(req.Whatsapp)) > 50 ||
			utf8.RuneCountInString(strings.TrimSpace(req.Email)) > 255 ||
			utf8.RuneCountInString(strings.TrimSpace(req.Major)) > 100 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Salah satu data pendaftaran melebihi batas karakter"})
		}

		// Use a cryptographically random ticket instead of a guessable timestamp-derived code.
		ticketEntropy := make([]byte, 12)
		if _, err := crand.Read(ticketEntropy); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal membuat kode tiket aman"})
		}
		ticketCode := "TC-" + strings.ToUpper(hex.EncodeToString(ticketEntropy))

		item := models.TrialClassRegistration{
			TicketCode:   ticketCode,
			FullName:     strings.TrimSpace(req.FullName),
			SchoolOrigin: strings.TrimSpace(req.SchoolOrigin),
			Whatsapp:     strings.TrimSpace(req.Whatsapp),
			Email:        strings.TrimSpace(req.Email),
			Major:        strings.TrimSpace(req.Major),
			Status:       "registered",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}

		if err := requestDB(c).Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan pendaftaran trial class"})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Pendaftaran Trial Class berhasil",
			"data":    fiber.Map{"ticketCode": item.TicketCode},
		})
	})

	trialTicketLimiter := middleware.SharedRateLimit("trial-ticket", 30, time.Minute)

	// Public: Verify / Check Ticket
	trialGroup.Post("/check-ticket", trialTicketLimiter, func(c *fiber.Ctx) error {
		if len(c.Body()) > 1024 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		var req struct {
			Code string `json:"code"`
		}
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		code := strings.TrimSpace(req.Code)
		if code == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Kode tiket wajib disertakan"})
		}
		var item models.TrialClassRegistration
		if err := requestDB(c).Select("ticket_code", "major").Where("ticket_code = ?", code).First(&item).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tiket tidak ditemukan"})
		}
		return c.JSON(fiber.Map{"data": fiber.Map{"ticketCode": item.TicketCode, "major": item.Major}})
	})

	// Admin: List all registrations
	trialGroup.Get("", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		q := strings.TrimSpace(c.Query("q"))
		major := strings.TrimSpace(c.Query("major"))
		status := strings.TrimSpace(c.Query("status"))

		dbQuery := requestDB(c).Model(&models.TrialClassRegistration{}).Order("created_at DESC")
		if q != "" {
			searchVal := "%" + strings.ToLower(q) + "%"
			dbQuery = dbQuery.Where("LOWER(full_name) LIKE ? OR LOWER(school_origin) LIKE ? OR LOWER(ticket_code) LIKE ? OR whatsapp LIKE ?", searchVal, searchVal, searchVal, searchVal)
		}
		if major != "" && !strings.EqualFold(major, "semua") {
			dbQuery = dbQuery.Where("major = ?", major)
		}
		if status != "" && !strings.EqualFold(status, "semua") {
			dbQuery = dbQuery.Where("status = ?", status)
		}

		var list []models.TrialClassRegistration
		var total int64
		dbQuery.Count(&total)
		if err := dbQuery.Limit(listLimit(c)).Offset(listOffset(c)).Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal memuat data pendaftar"})
		}
		return c.JSON(fiber.Map{"data": list, "total": total})
	})

	// Public: Get Active Upcoming Event
	trialGroup.Get("/event", func(c *fiber.Ctx) error {
		var event models.TrialClassEvent
		if err := requestDB(c).Where("is_active = ?", true).Order("id DESC").First(&event).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.JSON(fiber.Map{"data": nil})
			}
			return c.Status(503).JSON(fiber.Map{"error": "Jadwal belum dapat dimuat"})
		}
		return c.JSON(fiber.Map{"data": event})
	})

	// Admin: Update / Save Active Upcoming Event
	trialGroup.Put("/event", authGuard, func(c *fiber.Ctx) error {
		var payload struct {
			Title       string `json:"title"`
			Badge       string `json:"badge"`
			DateDay     string `json:"dateDay"`
			DateFull    string `json:"dateFull"`
			TimeRange   string `json:"timeRange"`
			Timezone    string `json:"timezone"`
			Mode        string `json:"mode"`
			Submode     string `json:"submode"`
			Status      string `json:"status"`
			Quota       int    `json:"quota"`
			Description string `json:"description"`
			IsActive    *bool  `json:"isActive"`
		}
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(payload.Title) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Judul event wajib diisi"})
		}

		var event models.TrialClassEvent
		err := requestDB(c).Order("id DESC").First(&event).Error
		if err != nil {
			event = models.TrialClassEvent{
				Title:       strings.TrimSpace(payload.Title),
				Badge:       strings.TrimSpace(payload.Badge),
				DateDay:     strings.TrimSpace(payload.DateDay),
				DateFull:    strings.TrimSpace(payload.DateFull),
				TimeRange:   strings.TrimSpace(payload.TimeRange),
				Timezone:    strings.TrimSpace(payload.Timezone),
				Mode:        strings.TrimSpace(payload.Mode),
				Submode:     strings.TrimSpace(payload.Submode),
				Status:      payload.Status,
				Quota:       payload.Quota,
				Description: payload.Description,
				IsActive:    true,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			}
			if payload.IsActive != nil {
				event.IsActive = *payload.IsActive
			}
			if err := requestDB(c).Create(&event).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal membuat event"})
			}
			recordAudit(c, "CREATE", "trial_class_event", fmt.Sprint(event.ID), fmt.Sprintf("Membuat jadwal event terdekat: %s", event.Title))
			return c.JSON(fiber.Map{"message": "Jadwal event berhasil dibuat", "data": event})
		}

		event.Title = strings.TrimSpace(payload.Title)
		if payload.Badge != "" {
			event.Badge = strings.TrimSpace(payload.Badge)
		}
		if payload.DateDay != "" {
			event.DateDay = strings.TrimSpace(payload.DateDay)
		}
		if payload.DateFull != "" {
			event.DateFull = strings.TrimSpace(payload.DateFull)
		}
		if payload.TimeRange != "" {
			event.TimeRange = strings.TrimSpace(payload.TimeRange)
		}
		if payload.Timezone != "" {
			event.Timezone = strings.TrimSpace(payload.Timezone)
		}
		if payload.Mode != "" {
			event.Mode = strings.TrimSpace(payload.Mode)
		}
		if payload.Submode != "" {
			event.Submode = strings.TrimSpace(payload.Submode)
		}
		if payload.Status != "" {
			event.Status = payload.Status
		}
		if payload.Quota > 0 {
			event.Quota = payload.Quota
		}
		event.Description = payload.Description
		if payload.IsActive != nil {
			event.IsActive = *payload.IsActive
		}
		event.UpdatedAt = time.Now()

		if err := requestDB(c).Save(&event).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan perubahan event"})
		}
		recordAudit(c, "UPDATE", "trial_class_event", fmt.Sprint(event.ID), fmt.Sprintf("Memperbarui jadwal event terdekat: %s (%s %s)", event.Title, event.DateDay, event.DateFull))
		return c.JSON(fiber.Map{"message": "Jadwal event berhasil diperbarui", "data": event})
	})

	// Admin: Update status / notes
	trialGroup.Put("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.TrialClassRegistration
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data pendaftar tidak ditemukan"})
		}

		var payload struct {
			Status string `json:"status"`
			Notes  string `json:"notes"`
			Major  string `json:"major"`
		}
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if payload.Status != "" {
			existing.Status = payload.Status
		}
		if payload.Notes != "" {
			existing.Notes = payload.Notes
		}
		if payload.Major != "" {
			existing.Major = payload.Major
		}
		existing.UpdatedAt = time.Now()
		if err := requestDB(c).Save(&existing).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menyimpan perubahan"})
		}
		recordAudit(c, "UPDATE", "trial_class", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui status pendaftar: %s (%s)", existing.FullName, existing.Status))
		return c.JSON(fiber.Map{"message": "Data pendaftar berhasil diperbarui", "data": existing})
	})

	// Admin: Delete participant
	trialGroup.Delete("/:id", authGuard, middleware.RequireRole("editor"), func(c *fiber.Ctx) error {
		id, idErr := strconv.ParseUint(c.Params("id"), 10, 32)
		if idErr != nil || id == 0 {
			return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
		}
		var existing models.TrialClassRegistration
		if err := requestDB(c).First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data pendaftar tidak ditemukan"})
		}
		result := requestDB(c).Delete(&existing)
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal menghapus data"})
		}
		if result.RowsAffected == 0 {
			return c.Status(404).JSON(fiber.Map{"error": "Data tidak ditemukan"})
		}
		recordAudit(c, "DELETE", "trial_class", fmt.Sprint(id), fmt.Sprintf("Menghapus pendaftar trial class: %s (%s)", existing.FullName, existing.TicketCode))
		return c.JSON(fiber.Map{"message": "Pendaftar berhasil dihapus"})
	})
}

// recordAudit mencatat log aktivitas admin ke database
func recordAudit(c *fiber.Ctx, action, entity, entityID, details string) {
	userName, _ := c.Locals("user_name").(string)
	userID, _ := c.Locals("user_id").(uint)
	// Callers may pass names, email addresses, student identifiers, ticket codes,
	// or setting values. Keep the parameter for call-site compatibility, but do
	// not persist free-form details in the audit log.
	safeDetails := "Aktivitas tercatat; detail objek tidak disimpan."

	audit.Enqueue(config.DB, models.AuditLog{
		UserID:    userID,
		UserName:  userName,
		Action:    action,
		Entity:    entity,
		EntityID:  entityID,
		Details:   safeDetails,
		IPAddress: c.IP(),
		CreatedAt: time.Now(),
	})
}
