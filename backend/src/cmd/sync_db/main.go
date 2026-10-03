package main

import (
	"fmt"
	"log"
	"os"

	"github.com/glebarez/sqlite"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/models"
)

func main() {
	// 1. Muat .env
	_ = godotenv.Load(".env")
	_ = godotenv.Load("backend/.env")

	pgDSN := os.Getenv("DATABASE_URL")
	if pgDSN == "" {
		log.Fatal("DATABASE_URL wajib diatur di file .env atau environment variable")
	}

	sqlitePath := "smktelkom_dev.db"
	if _, err := os.Stat(sqlitePath); os.IsNotExist(err) {
		sqlitePath = "backend/smktelkom_dev.db"
	}

	log.Printf("Connecting to SQLite source: %s", sqlitePath)
	sqliteDB, err := gorm.Open(sqlite.Open(sqlitePath), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal membuka SQLite: %v", err)
	}

	log.Printf("Connecting to Postgres target: %s", pgDSN)
	pgDB, err := gorm.Open(postgres.Open(pgDSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal membuka Postgres: %v", err)
	}

	// 2. AutoMigrate Postgres target
	log.Println("Migrasi skema tabel di Postgres...")
	if err := pgDB.AutoMigrate(
		&models.Jurusan{},
		&models.News{},
		&models.User{},
		&models.AuditLog{},
		&models.Teacher{},
		&models.Prestasi{},
		&models.BKKJob{},
		&models.BKKPartner{},
		&models.BKKAlumni{},
		&models.Ekstrakurikuler{},
		&models.Fasilitas{},
		&models.Document{},
		&models.SiteSetting{},
		&models.Alumni{},
		&models.DigitalTalent{},
	); err != nil {
		log.Fatalf("AutoMigrate error: %v", err)
	}

	// Seed data Digital Talent Program jika tabel masih kosong di Postgres
	config.SeedDtpIfEmpty(pgDB)

	// 3. Sync Teachers
	var teachers []models.Teacher
	sqliteDB.Unscoped().Find(&teachers)
	if len(teachers) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(teachers, 50).Error; err != nil {
			log.Printf("Error syncing teachers: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Guru & Staf ke Postgres", len(teachers))
		}
	}

	// 4. Sync BKK Partners
	var partners []models.BKKPartner
	sqliteDB.Unscoped().Find(&partners)
	if len(partners) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(partners, 50).Error; err != nil {
			log.Printf("Error syncing bkk partners: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Mitra BKK ke Postgres", len(partners))
		}
	}

	// 5. Sync BKK Jobs
	var jobs []models.BKKJob
	sqliteDB.Unscoped().Find(&jobs)
	if len(jobs) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(jobs, 50).Error; err != nil {
			log.Printf("Error syncing bkk jobs: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Lowongan BKK ke Postgres", len(jobs))
		}
	}

	// 6. Sync BKK Alumni
	var bkkAlumni []models.BKKAlumni
	sqliteDB.Unscoped().Find(&bkkAlumni)
	if len(bkkAlumni) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(bkkAlumni, 50).Error; err != nil {
			log.Printf("Error syncing bkk alumni: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Testimoni Alumni BKK ke Postgres", len(bkkAlumni))
		}
	}

	// 7. Sync Fasilitas
	var fasilitas []models.Fasilitas
	sqliteDB.Unscoped().Find(&fasilitas)
	if len(fasilitas) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(fasilitas, 50).Error; err != nil {
			log.Printf("Error syncing fasilitas: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Fasilitas ke Postgres", len(fasilitas))
		}
	}

	// 8. Sync Ekstrakurikuler
	var ekskul []models.Ekstrakurikuler
	sqliteDB.Unscoped().Find(&ekskul)
	if len(ekskul) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(ekskul, 50).Error; err != nil {
			log.Printf("Error syncing ekskul: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Ekstrakurikuler ke Postgres", len(ekskul))
		}
	}

	// 9. Sync Prestasi
	var prestasi []models.Prestasi
	sqliteDB.Unscoped().Find(&prestasi)
	if len(prestasi) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(prestasi, 50).Error; err != nil {
			log.Printf("Error syncing prestasi: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Prestasi ke Postgres", len(prestasi))
		}
	}

	// 10. Sync Documents
	var docs []models.Document
	sqliteDB.Unscoped().Find(&docs)
	if len(docs) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(docs, 50).Error; err != nil {
			log.Printf("Error syncing documents: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Dokumen ke Postgres", len(docs))
		}
	}

	// 11. Sync Site Settings
	var settings []models.SiteSetting
	sqliteDB.Find(&settings)
	if len(settings) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(settings, 50).Error; err != nil {
			log.Printf("Error syncing site settings: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Site Settings ke Postgres", len(settings))
		}
	}

	// 12. Sync Audit Logs
	var logs []models.AuditLog
	sqliteDB.Find(&logs)
	if len(logs) > 0 {
		if err := pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(logs, 50).Error; err != nil {
			log.Printf("Error syncing audit logs: %v", err)
		} else {
			log.Printf("✓ Berhasil sinkronisasi %d data Audit Logs ke Postgres", len(logs))
		}
	}

	// 13. Sync Jurusan & News
	var jurusans []models.Jurusan
	sqliteDB.Unscoped().Find(&jurusans)
	if len(jurusans) > 0 {
		_ = pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(jurusans, 50).Error
		log.Printf("✓ Berhasil sinkronisasi %d data Jurusan ke Postgres", len(jurusans))
	}

	var newsList []models.News
	sqliteDB.Unscoped().Find(&newsList)
	if len(newsList) > 0 {
		_ = pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(newsList, 50).Error
		log.Printf("✓ Berhasil sinkronisasi %d data Berita ke Postgres", len(newsList))
	}

	// 14. Sync Users
	var users []models.User
	sqliteDB.Find(&users)
	if len(users) > 0 {
		_ = pgDB.Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(users, 50).Error
		log.Printf("✓ Berhasil sinkronisasi %d data User ke Postgres", len(users))
	}

	// 15. Update Postgres sequence (SERIAL / BIGSERIAL)
	tablesWithSerial := []string{
		"teachers", "bkk_partners", "bkk_jobs", "bkk_alumnis", "fasilitas",
		"ekstrakurikulers", "prestasis", "documents", "site_settings",
		"audit_logs", "jurusans", "news", "users", "alumnis", "digital_talents",
	}

	for _, tbl := range tablesWithSerial {
		sql := fmt.Sprintf("SELECT setval(pg_get_serial_sequence('%s', 'id'), COALESCE(MAX(id), 1)) FROM %s;", tbl, tbl)
		if err := pgDB.Exec(sql).Error; err != nil {
			log.Printf("Catatan sequence update %s: %v", tbl, err)
		} else {
			log.Printf("✓ Sequence auto-increment Postgres untuk tabel %s berhasil diperbarui", tbl)
		}
	}

	log.Println("==================================================")
	log.Println("🎉 SINKRONISASI DATABASE SQLITE KE POSTGRES SUKSES!")
	log.Println("==================================================")
}
