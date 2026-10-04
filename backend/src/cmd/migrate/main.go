// Command migrate menerapkan skema secara eksplisit di luar startup HTTP server.
// Seed awal hanya dijalankan bila operator meminta flag --seed-initial.
package main

import (
	"flag"
	"log"
	"strings"

	"github.com/haristhropic/skomda-website/backend/src/config"
)

func main() {
	seedInitial := flag.Bool("seed-initial", false, "buat data awal hanya untuk database production yang kosong")
	flag.Parse()

	cfg := config.LoadForMigration()
	if !strings.EqualFold(cfg.Env, "production") || !strings.EqualFold(cfg.DatabaseDriver, "postgres") {
		log.Fatal("migrate hanya boleh dijalankan dengan ENV=production dan DATABASE_DRIVER=postgres")
	}

	db := config.OpenDB(cfg)
	if err := config.MigrateDB(db); err != nil {
		log.Fatalf("migrasi gagal: %v", err)
	}
	log.Println("migrasi skema berhasil")

	if *seedInitial {
		config.SeedInitialData(db)
		log.Println("seeding awal diminta dan selesai; periksa log di atas untuk setiap peringatan")
	}
}
