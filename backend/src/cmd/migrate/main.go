// Command migrate applies reviewed, embedded PostgreSQL schema migrations.
// Initial admin/content seeding remains an explicit operator action.
package main

import (
	"context"
	"flag"
	"log"
	"strings"
	"time"

	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/migrations"
	"github.com/pressly/goose/v3"
)

const migrationSchema = "skomda_internal"

func main() {
	seedInitial := flag.Bool("seed-initial", false, "buat data awal hanya untuk database production yang kosong")
	baselineExisting := flag.Bool("baseline-existing", false, "catat migrasi awal pada schema production yang sudah ada dan lolos pemeriksaan")
	flag.Parse()

	if *seedInitial && *baselineExisting {
		log.Fatal("--seed-initial dan --baseline-existing tidak boleh dipakai bersamaan")
	}

	cfg := config.LoadForMigration()
	if !strings.EqualFold(cfg.Env, "production") || !strings.EqualFold(cfg.DatabaseDriver, "postgres") {
		log.Fatal("migrate hanya boleh dijalankan dengan ENV=production dan DATABASE_DRIVER=postgres")
	}

	gormDB := config.OpenDB(cfg)
	sqlDB, err := gormDB.DB()
	if err != nil {
		log.Fatalf("gagal membuka koneksi SQL migrasi: %v", err)
	}
	defer sqlDB.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	if *baselineExisting {
		if err := verifyInitialSchema(ctx, sqlDB); err != nil {
			log.Fatalf("baseline ditolak sebelum menulis ledger: %v", err)
		}
	}

	// Keep migration bookkeeping outside public so it is not exposed through a future Supabase API
	// schema configuration. Newly created schemas are private to their owner by default.
	if _, err := sqlDB.ExecContext(ctx, "CREATE SCHEMA IF NOT EXISTS "+migrationSchema); err != nil {
		log.Fatalf("gagal menyiapkan schema internal migrasi: %v", err)
	}
	if _, err := sqlDB.ExecContext(ctx, "REVOKE ALL ON SCHEMA "+migrationSchema+" FROM PUBLIC"); err != nil {
		log.Fatalf("gagal membatasi akses schema internal migrasi: %v", err)
	}

	provider, err := goose.NewProvider(
		goose.DialectPostgres,
		sqlDB,
		migrations.FS,
		goose.WithTableName(migrationSchema+".goose_db_version"),
	)
	if err != nil {
		log.Fatalf("gagal memuat migrasi: %v", err)
	}
	defer provider.Close()

	if *baselineExisting {
		if err := baselineExistingDatabase(ctx, provider, sqlDB); err != nil {
			log.Fatalf("baseline ditolak: %v", err)
		}
		log.Println("inventaris tabel, sequence, RLS, dan policy cocok; ledger versi awal dicatat tanpa menjalankan DDL aplikasi")
		return
	}

	currentVersion, err := provider.GetDBVersion(ctx)
	if err != nil {
		log.Fatalf("gagal membaca versi migrasi: %v", err)
	}
	publicTables, err := listPublicTables(ctx, sqlDB)
	if err != nil {
		log.Fatalf("gagal memeriksa schema public: %v", err)
	}
	if currentVersion == 0 && len(publicTables) > 0 {
		log.Fatal("database sudah berisi tabel tetapi belum memiliki baseline migrasi; periksa kecocokan schema dan backup, lalu jalankan /app/migrate --baseline-existing secara eksplisit")
	}

	results, err := provider.Up(ctx)
	if err != nil {
		log.Fatalf("migrasi gagal: %v", err)
	}
	for _, result := range results {
		log.Printf("migrasi versi %d berhasil (%s)", result.Source.Version, result.Source.Path)
	}
	if len(results) == 0 {
		log.Printf("schema sudah pada versi migrasi %d", currentVersion)
	}

	if *seedInitial {
		config.SeedInitialData(gormDB)
		log.Println("seeding awal diminta dan selesai; periksa log di atas untuk setiap peringatan")
	}
}
