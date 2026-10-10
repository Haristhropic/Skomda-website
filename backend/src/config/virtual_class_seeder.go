package config

import (
	_ "embed"
	"encoding/json"
	"log"

	"gorm.io/gorm"

	"github.com/haristhropic/skomda-website/backend/src/models"
)

//go:embed virtual_class_seed.json
var virtualClassSeedJSON []byte

// SeedVirtualClassIfEmpty mengisi modul Virtual Class awal (9 materi DTP lengkap dengan
// satu kuis per video) hanya saat tabel masih kosong. Setelah itu admin yang mengatur kontennya.
func SeedVirtualClassIfEmpty(db *gorm.DB) {
	// Normalisasi trigger seconds lama (150 detik / 2.5 menit) menjadi 30 detik agar kuis responsif saat video diputar
	_ = db.Model(&models.VirtualClassQuiz{}).Where("trigger_seconds = ?", 150).Update("trigger_seconds", 30).Error

	var count int64
	if err := db.Unscoped().Model(&models.VirtualClassModule{}).Count(&count).Error; err != nil || count > 0 {
		return
	}

	var modules []models.VirtualClassModule
	if err := json.Unmarshal(virtualClassSeedJSON, &modules); err != nil {
		log.Printf("seed virtual class dilewati, JSON tidak valid: %v", err)
		return
	}
	for i := range modules {
		modules[i].OrderIndex = i + 1
		modules[i].IsActive = true
	}
	if err := db.Create(&modules).Error; err != nil {
		log.Printf("seed virtual class gagal: %v", err)
		return
	}
	log.Printf("berhasil seed %d modul virtual class", len(modules))
}
