package api

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/haristhropic/skomda-website/backend/src/api/middleware"
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
		query := config.DB.Model(&models.Teacher{}).Order("order_index ASC, id ASC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		var list []models.Teacher
		if err := query.Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data guru"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	teacherGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Teacher
		if err := c.BodyParser(&item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(item.Name) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Nama guru/staf wajib diisi"})
		}
		if err := config.DB.Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan data guru"})
		}
		recordAudit(c, "CREATE", "teacher", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan guru: %s (%s)", item.Name, item.Role))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Data guru berhasil ditambahkan", "data": item})
	})

	teacherGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Teacher
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data guru tidak ditemukan"})
		}
		if err := c.BodyParser(&existing); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		existing.ID = uint(id)
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "teacher", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui profil guru: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Data guru berhasil diperbarui", "data": existing})
	})

	teacherGroup.Delete("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Teacher
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data guru tidak ditemukan"})
		}
		config.DB.Delete(&existing)
		recordAudit(c, "DELETE", "teacher", fmt.Sprint(id), fmt.Sprintf("Menghapus data guru: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Data guru berhasil dihapus"})
	})

	// ==================== 2. PRESTASI SISWA ====================
	prestasiGroup := api.Group("/prestasi")
	prestasiGroup.Get("", func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		year := strings.TrimSpace(c.Query("year"))
		query := config.DB.Model(&models.Prestasi{}).Order("id DESC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		if year != "" && !strings.EqualFold(year, "semua") {
			query = query.Where("year = ?", year)
		}
		var list []models.Prestasi
		if err := query.Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data prestasi"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	prestasiGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Prestasi
		if err := c.BodyParser(&item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(item.Title) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Judul prestasi wajib diisi"})
		}
		if strings.TrimSpace(item.Slug) == "" {
			item.Slug = slugify(item.Title)
		}
		if err := config.DB.Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan prestasi"})
		}
		recordAudit(c, "CREATE", "prestasi", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan prestasi: %s (%s)", item.Title, item.Award))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Data prestasi berhasil disimpan", "data": item})
	})

	prestasiGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Prestasi
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data prestasi tidak ditemukan"})
		}
		if err := c.BodyParser(&existing); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		existing.ID = uint(id)
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "prestasi", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui prestasi: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Data prestasi berhasil diperbarui", "data": existing})
	})

	prestasiGroup.Delete("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Prestasi
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data prestasi tidak ditemukan"})
		}
		config.DB.Delete(&existing)
		recordAudit(c, "DELETE", "prestasi", fmt.Sprint(id), fmt.Sprintf("Menghapus prestasi: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Data prestasi berhasil dihapus"})
	})

	// ==================== 3. BKK (BURSA KERJA & MITRA) ====================
	bkkGroup := api.Group("/bkk")
	bkkGroup.Get("/jobs", func(c *fiber.Ctx) error {
		status := strings.TrimSpace(c.Query("status"))
		query := config.DB.Model(&models.BKKJob{}).Order("id DESC")
		if status != "" && !strings.EqualFold(status, "semua") {
			query = query.Where("LOWER(status) = ?", strings.ToLower(status))
		}
		var list []models.BKKJob
		query.Find(&list)
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	// Public endpoint: Pasang Lowongan oleh Mitra / Perusahaan / Pengguna Publik
	// Status selalu otomatis 'pending' (menunggu verifikasi admin agar tidak langsung tayang jika tidak valid)
	bkkSubmitLimiter := limiter.New(limiter.Config{
		Max:        5,
		Expiration: 10 * time.Minute,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Batas frekuensi permohonan lowongan terlampaui. Silakan tunggu beberapa saat sebelum mencoba kembali.",
			})
		},
	})
	bkkGroup.Post("/jobs/submit", bkkSubmitLimiter, func(c *fiber.Ctx) error {
		var item models.BKKJob
		if err := c.BodyParser(&item); err != nil {
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

		if err := config.DB.Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan pengajuan lowongan kerja"})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Pengajuan lowongan berhasil terkirim. Menunggu verifikasi dan persetujuan dari tim BKK SKOMDA.",
			"data":    item,
		})
	})

	bkkGroup.Post("/jobs", authGuard, func(c *fiber.Ctx) error {
		var item models.BKKJob
		if err := c.BodyParser(&item); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		if strings.TrimSpace(item.Status) == "" {
			item.Status = "active"
		}
		if strings.TrimSpace(item.Source) == "" {
			item.Source = "admin"
		}
		config.DB.Create(&item)
		recordAudit(c, "CREATE", "bkk_job", fmt.Sprint(item.ID), fmt.Sprintf("Membuat lowongan: %s di %s", item.Title, item.Company))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Lowongan kerja berhasil ditambahkan", "data": item})
	})

	// Endpoint khusus update status (ACC/Setujui, Tolak, atau Tutup) oleh Admin
	bkkGroup.Put("/jobs/:id/status", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var input struct {
			Status string `json:"status"`
		}
		if err := c.BodyParser(&input); err != nil || strings.TrimSpace(input.Status) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Status tidak valid"})
		}
		var existing models.BKKJob
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lowongan tidak ditemukan"})
		}
		oldStatus := existing.Status
		existing.Status = strings.ToLower(strings.TrimSpace(input.Status))
		config.DB.Save(&existing)

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
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.BKKJob
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lowongan tidak ditemukan"})
		}
		c.BodyParser(&existing)
		existing.ID = uint(id)
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "bkk_job", fmt.Sprint(id), fmt.Sprintf("Memperbarui lowongan: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Lowongan berhasil diperbarui", "data": existing})
	})

	bkkGroup.Delete("/jobs/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.BKKJob
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Lowongan tidak ditemukan"})
		}
		config.DB.Delete(&existing)
		recordAudit(c, "DELETE", "bkk_job", fmt.Sprint(id), fmt.Sprintf("Menghapus lowongan: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Lowongan berhasil dihapus"})
	})

	bkkGroup.Get("/partners", func(c *fiber.Ctx) error {
		var list []models.BKKPartner
		config.DB.Order("order_index ASC, id ASC").Find(&list)
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	bkkGroup.Post("/partners", authGuard, func(c *fiber.Ctx) error {
		var item models.BKKPartner
		c.BodyParser(&item)
		config.DB.Create(&item)
		recordAudit(c, "CREATE", "bkk_partner", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan mitra industri: %s", item.Name))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Mitra berhasil ditambahkan", "data": item})
	})

	bkkGroup.Put("/partners/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.BKKPartner
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
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
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "bkk_partner", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui mitra industri: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Mitra berhasil diperbarui", "data": existing})
	})

	bkkGroup.Delete("/partners/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		config.DB.Delete(&models.BKKPartner{}, uint(id))
		recordAudit(c, "DELETE", "bkk_partner", fmt.Sprint(id), "Menghapus mitra industri")
		return c.JSON(fiber.Map{"message": "Mitra berhasil dihapus"})
	})

	// ==================== 4. EKSTRAKURIKULER ====================
	ekskulGroup := api.Group("/ekskul")
	ekskulGroup.Get("", func(c *fiber.Ctx) error {
		var list []models.Ekstrakurikuler
		config.DB.Order("order_index ASC, id ASC").Find(&list)
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	ekskulGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Ekstrakurikuler
		c.BodyParser(&item)
		if item.Slug == "" {
			item.Slug = slugify(item.Name)
		}
		config.DB.Create(&item)
		recordAudit(c, "CREATE", "ekskul", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan ekstrakurikuler: %s", item.Name))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Ekstrakurikuler berhasil ditambahkan", "data": item})
	})

	ekskulGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Ekstrakurikuler
		config.DB.First(&existing, uint(id))
		c.BodyParser(&existing)
		existing.ID = uint(id)
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "ekskul", fmt.Sprint(id), fmt.Sprintf("Memperbarui ekstrakurikuler: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Ekstrakurikuler berhasil diperbarui", "data": existing})
	})

	ekskulGroup.Delete("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		config.DB.Delete(&models.Ekstrakurikuler{}, uint(id))
		recordAudit(c, "DELETE", "ekskul", fmt.Sprint(id), "Menghapus ekstrakurikuler")
		return c.JSON(fiber.Map{"message": "Ekstrakurikuler berhasil dihapus"})
	})

	// ==================== 5. FASILITAS ====================
	fasilitasGroup := api.Group("/fasilitas")
	fasilitasGroup.Get("", func(c *fiber.Ctx) error {
		var list []models.Fasilitas
		config.DB.Order("order_index ASC, id ASC").Find(&list)
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	fasilitasGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Fasilitas
		c.BodyParser(&item)
		config.DB.Create(&item)
		recordAudit(c, "CREATE", "fasilitas", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan fasilitas: %s", item.Name))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Fasilitas berhasil ditambahkan", "data": item})
	})

	fasilitasGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Fasilitas
		config.DB.First(&existing, uint(id))
		c.BodyParser(&existing)
		existing.ID = uint(id)
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "fasilitas", fmt.Sprint(id), fmt.Sprintf("Memperbarui fasilitas: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Fasilitas berhasil diperbarui", "data": existing})
	})

	fasilitasGroup.Delete("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		config.DB.Delete(&models.Fasilitas{}, uint(id))
		recordAudit(c, "DELETE", "fasilitas", fmt.Sprint(id), "Menghapus fasilitas")
		return c.JSON(fiber.Map{"message": "Fasilitas berhasil dihapus"})
	})

	// ==================== 6. DOKUMEN & REGULASI ====================
	docGroup := api.Group("/documents")
	docGroup.Get("", func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		query := config.DB.Model(&models.Document{}).Order("order_index ASC, id ASC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		var list []models.Document
		query.Find(&list)
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	// Endpoint publik: Mendapatkan dokumen Brosur PPDB aktif
	docGroup.Get("/active-brochure", func(c *fiber.Ctx) error {
		var activeDoc models.Document

		// 1. Cek konfigurasi ppdb_active_brochure_id di SiteSetting
		var setting models.SiteSetting
		err := config.DB.Where("key = ?", "ppdb_active_brochure_id").First(&setting).Error
		if err == nil && setting.Value != "" {
			if docID, errParse := strconv.ParseUint(setting.Value, 10, 32); errParse == nil && docID > 0 {
				if errDoc := config.DB.Where("id = ? AND is_public = ?", uint(docID), true).First(&activeDoc).Error; errDoc == nil {
					return c.JSON(fiber.Map{
						"success": true,
						"data":    activeDoc,
						"source":  "setting",
					})
				}
			}
		}

		// 2. Jika belum ditentukan, cari berkas publik berkategori Brosur PPDB atau yang judulnya mengandung Brosur
		err = config.DB.Where("is_public = ? AND (LOWER(category) = ? OR LOWER(title) LIKE ?)", true, "brosur ppdb", "%brosur%").
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
	docGroup.Post("/active-brochure", authGuard, func(c *fiber.Ctx) error {
		var payload struct {
			DocumentID uint `json:"documentId"`
		}
		if err := c.BodyParser(&payload); err != nil || payload.DocumentID == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID Dokumen tidak valid"})
		}

		var targetDoc models.Document
		if err := config.DB.First(&targetDoc, payload.DocumentID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Dokumen tidak ditemukan"})
		}

		var setting models.SiteSetting
		err := config.DB.Where("key = ?", "ppdb_active_brochure_id").First(&setting).Error
		valStr := fmt.Sprint(payload.DocumentID)
		if err != nil {
			setting = models.SiteSetting{
				Key:         "ppdb_active_brochure_id",
				Value:       valStr,
				Category:    "ppdb",
				Description: "ID Dokumen brosur PPDB resmi yang aktif tampil di halaman PPDB",
				UpdatedAt:   time.Now(),
			}
			config.DB.Create(&setting)
		} else {
			setting.Value = valStr
			setting.UpdatedAt = time.Now()
			config.DB.Save(&setting)
		}

		recordAudit(c, "UPDATE", "setting", "ppdb_active_brochure_id", fmt.Sprintf("Menetapkan brosur PPDB aktif: %s (ID: %d)", targetDoc.Title, targetDoc.ID))
		return c.JSON(fiber.Map{
			"message": "Brosur PPDB aktif berhasil diperbarui",
			"data":    targetDoc,
		})
	})

	docGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Document
		c.BodyParser(&item)
		config.DB.Create(&item)
		recordAudit(c, "CREATE", "document", fmt.Sprint(item.ID), fmt.Sprintf("Mengunggah dokumen: %s", item.Title))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Dokumen berhasil disimpan", "data": item})
	})

	docGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Document
		config.DB.First(&existing, uint(id))
		c.BodyParser(&existing)
		existing.ID = uint(id)
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "document", fmt.Sprint(id), fmt.Sprintf("Memperbarui dokumen: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Dokumen berhasil diperbarui", "data": existing})
	})

	docGroup.Delete("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		config.DB.Delete(&models.Document{}, uint(id))
		recordAudit(c, "DELETE", "document", fmt.Sprint(id), "Menghapus dokumen")
		return c.JSON(fiber.Map{"message": "Dokumen berhasil dihapus"})
	})

	// ==================== 7. SITE SETTINGS ====================
	settingsGroup := api.Group("/settings")
	settingsGroup.Get("", func(c *fiber.Ctx) error {
		var list []models.SiteSetting
		config.DB.Find(&list)
		settingsMap := make(map[string]string)
		for _, s := range list {
			settingsMap[s.Key] = s.Value
		}
		return c.JSON(fiber.Map{"data": list, "map": settingsMap})
	})

	settingsGroup.Put("/:key", authGuard, middleware.RequireRole("super_admin"), func(c *fiber.Ctx) error {
		key := strings.TrimSpace(c.Params("key"))
		var payload struct {
			Value string `json:"value"`
		}
		c.BodyParser(&payload)

		var item models.SiteSetting
		err := config.DB.Where("key = ?", key).First(&item).Error
		if err != nil {
			item = models.SiteSetting{Key: key, Value: payload.Value, UpdatedAt: time.Now()}
			config.DB.Create(&item)
		} else {
			item.Value = payload.Value
			item.UpdatedAt = time.Now()
			config.DB.Save(&item)
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

		query := config.DB.Model(&models.Alumni{}).Order("id ASC")

		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(kategori) = ?", strings.ToLower(category))
		}
		if q != "" {
			query = query.Where("LOWER(name) LIKE ? OR LOWER(nisn) LIKE ? OR LOWER(institusi) LIKE ? OR LOWER(keterangan) LIKE ?",
				"%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%")
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
		if err := query.Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data alumni"})
		}
		return c.JSON(fiber.Map{"data": list, "total": total})
	})

	alumniGroup.Get("/:id", func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var item models.Alumni
		if err := config.DB.First(&item, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data siswa kelulusan tidak ditemukan"})
		}
		return c.JSON(fiber.Map{"data": item})
	})

	alumniGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.Alumni
		if err := c.BodyParser(&item); err != nil {
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

		if err := config.DB.Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan data siswa"})
		}
		recordAudit(c, "CREATE", "alumni", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan siswa kelulusan: %s (NISN: %s)", item.Name, item.NISN))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Data kelulusan siswa berhasil ditambahkan", "data": item})
	})

	alumniGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Alumni
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data siswa tidak ditemukan"})
		}
		if err := c.BodyParser(&existing); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		existing.ID = uint(id)
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "alumni", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui data siswa kelulusan: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Data siswa kelulusan berhasil diperbarui", "data": existing})
	})

	alumniGroup.Delete("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.Alumni
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data siswa tidak ditemukan"})
		}
		config.DB.Delete(&existing)
		recordAudit(c, "DELETE", "alumni", fmt.Sprint(id), fmt.Sprintf("Menghapus data siswa kelulusan: %s", existing.Name))
		return c.JSON(fiber.Map{"message": "Data siswa kelulusan berhasil dihapus"})
	})

	// ==================== 9. DIGITAL TALENT PROGRAM (DTP) ====================
	dtpGroup := api.Group("/dtp")
	dtpGroup.Get("", func(c *fiber.Ctx) error {
		category := strings.TrimSpace(c.Query("category"))
		q := strings.TrimSpace(c.Query("q"))
		query := config.DB.Model(&models.DigitalTalent{}).Order("order_index ASC, id ASC")
		if category != "" && !strings.EqualFold(category, "semua") {
			query = query.Where("LOWER(category) = ?", strings.ToLower(category))
		}
		if q != "" {
			query = query.Where("LOWER(title) LIKE ? OR LOWER(short_desc) LIKE ? OR LOWER(core_skills) LIKE ? OR LOWER(tools) LIKE ?",
				"%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%", "%"+strings.ToLower(q)+"%")
		}
		var list []models.DigitalTalent
		if err := query.Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal mengambil data program digital talent"})
		}
		return c.JSON(fiber.Map{"data": list, "total": len(list)})
	})

	dtpGroup.Get("/:id", func(c *fiber.Ctx) error {
		param := strings.TrimSpace(c.Params("id"))
		var item models.DigitalTalent
		if id, err := strconv.ParseUint(param, 10, 32); err == nil && id > 0 {
			if err := config.DB.First(&item, uint(id)).Error; err == nil {
				return c.JSON(fiber.Map{"data": item})
			}
		}
		if err := config.DB.Where("LOWER(slug) = ?", strings.ToLower(param)).First(&item).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Program Digital Talent tidak ditemukan"})
		}
		return c.JSON(fiber.Map{"data": item})
	})

	dtpGroup.Post("", authGuard, func(c *fiber.Ctx) error {
		var item models.DigitalTalent
		if err := c.BodyParser(&item); err != nil {
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
			config.DB.Model(&models.DigitalTalent{}).Count(&count)
			item.OrderIndex = int(count) + 1
		}
		item.IsActive = true

		if err := config.DB.Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan program digital talent"})
		}
		recordAudit(c, "CREATE", "dtp", fmt.Sprint(item.ID), fmt.Sprintf("Menambahkan spesialisasi DTP: %s", item.Title))
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Program Digital Talent berhasil ditambahkan", "data": item})
	})

	dtpGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.DigitalTalent
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Program Digital Talent tidak ditemukan"})
		}
		if err := c.BodyParser(&existing); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload tidak valid"})
		}
		existing.ID = uint(id)
		if strings.TrimSpace(existing.Slug) == "" {
			existing.Slug = slugify(existing.Title)
		}
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "dtp", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui spesialisasi DTP: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Program Digital Talent berhasil diperbarui", "data": existing})
	})

	dtpGroup.Delete("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.DigitalTalent
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Program Digital Talent tidak ditemukan"})
		}
		config.DB.Delete(&existing)
		recordAudit(c, "DELETE", "dtp", fmt.Sprint(id), fmt.Sprintf("Menghapus spesialisasi DTP: %s", existing.Title))
		return c.JSON(fiber.Map{"message": "Program Digital Talent berhasil dihapus"})
	})

	// ==================== 11. TRIAL CLASS REGISTRATIONS ====================
	trialGroup := api.Group("/trial-class")

	// Public: Register for Trial Class
	trialGroup.Post("/register", func(c *fiber.Ctx) error {
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

		// Generate random 6-digit ticket code
		ticketCode := fmt.Sprintf("TC-%d", time.Now().UnixNano()%900000+100000)

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

		if err := config.DB.Create(&item).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan pendaftaran trial class"})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Pendaftaran Trial Class berhasil",
			"data":    item,
		})
	})

	// Public: Verify / Check Ticket
	trialGroup.Get("/check-ticket", func(c *fiber.Ctx) error {
		code := strings.TrimSpace(c.Query("code"))
		if code == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Kode tiket wajib disertakan"})
		}
		var item models.TrialClassRegistration
		if err := config.DB.Where("ticket_code = ?", code).First(&item).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tiket tidak ditemukan"})
		}
		return c.JSON(fiber.Map{"data": item})
	})

	// Admin: List all registrations
	trialGroup.Get("", authGuard, func(c *fiber.Ctx) error {
		q := strings.TrimSpace(c.Query("q"))
		major := strings.TrimSpace(c.Query("major"))
		status := strings.TrimSpace(c.Query("status"))

		dbQuery := config.DB.Model(&models.TrialClassRegistration{}).Order("created_at DESC")
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
		if err := dbQuery.Find(&list).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal memuat data pendaftar"})
		}
		return c.JSON(fiber.Map{"data": list, "total": total})
	})

	// Public: Get Active Upcoming Event
	trialGroup.Get("/event", func(c *fiber.Ctx) error {
		var event models.TrialClassEvent
		if err := config.DB.Where("is_active = ?", true).Order("id DESC").First(&event).Error; err != nil {
			event = models.TrialClassEvent{
				Title:       "Virtual Trial Class 2026",
				Badge:       "EVENT TERDEKAT",
				DateDay:     "Sabtu,",
				DateFull:    "26 September 2026",
				TimeRange:   "09.00 - 11.00",
				Timezone:    "WIB",
				Mode:        "Online",
				Submode:     "(Virtual Class)",
				Status:      "open",
				Quota:       100,
				Description: "Sesi simulasi interaktif pembelajaran vokasi SIJA & TJAT bersama mentor industri dan guru kejuruan.",
				IsActive:    true,
			}
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
		err := config.DB.Order("id DESC").First(&event).Error
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
			if err := config.DB.Create(&event).Error; err != nil {
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

		if err := config.DB.Save(&event).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal menyimpan perubahan event"})
		}
		recordAudit(c, "UPDATE", "trial_class_event", fmt.Sprint(event.ID), fmt.Sprintf("Memperbarui jadwal event terdekat: %s (%s %s)", event.Title, event.DateDay, event.DateFull))
		return c.JSON(fiber.Map{"message": "Jadwal event berhasil diperbarui", "data": event})
	})

	// Admin: Update status / notes
	trialGroup.Put("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.TrialClassRegistration
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
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
		config.DB.Save(&existing)
		recordAudit(c, "UPDATE", "trial_class", fmt.Sprint(existing.ID), fmt.Sprintf("Memperbarui status pendaftar: %s (%s)", existing.FullName, existing.Status))
		return c.JSON(fiber.Map{"message": "Data pendaftar berhasil diperbarui", "data": existing})
	})

	// Admin: Delete participant
	trialGroup.Delete("/:id", authGuard, func(c *fiber.Ctx) error {
		id, _ := strconv.ParseUint(c.Params("id"), 10, 32)
		var existing models.TrialClassRegistration
		if err := config.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Data pendaftar tidak ditemukan"})
		}
		config.DB.Delete(&existing)
		recordAudit(c, "DELETE", "trial_class", fmt.Sprint(id), fmt.Sprintf("Menghapus pendaftar trial class: %s (%s)", existing.FullName, existing.TicketCode))
		return c.JSON(fiber.Map{"message": "Pendaftar berhasil dihapus"})
	})
}

// recordAudit mencatat log aktivitas admin ke database
func recordAudit(c *fiber.Ctx, action, entity, entityID, details string) {
	userName, _ := c.Locals("user_name").(string)
	userID, _ := c.Locals("user_id").(uint)
	ip := c.IP()

	go func() {
		config.DB.Create(&models.AuditLog{
			UserID:    userID,
			UserName:  userName,
			Action:    action,
			Entity:    entity,
			EntityID:  entityID,
			Details:   details,
			IPAddress: ip,
			CreatedAt: time.Now(),
		})
	}()
}
