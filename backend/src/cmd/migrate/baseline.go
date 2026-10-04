package main

import (
	"context"
	"database/sql"
	"fmt"
	"sort"
	"strings"

	"github.com/pressly/goose/v3"
)

var expectedPublicTables = []string{
	"alumnis", "audit_logs", "bkk_alumnis", "bkk_jobs", "bkk_partners",
	"digital_talents", "documents", "ekstrakurikulers", "fasilitas", "jurusans",
	"news", "prestasis", "site_settings", "teachers", "trial_class_events",
	"trial_class_registrations", "users",
}

var expectedPublicSequences = []string{
	"alumnis_id_seq", "audit_logs_id_seq", "bkk_alumnis_id_seq", "bkk_jobs_id_seq",
	"bkk_partners_id_seq", "digital_talents_id_seq", "documents_id_seq",
	"ekstrakurikulers_id_seq", "fasilitas_id_seq", "jurusans_id_seq", "news_id_seq",
	"prestasis_id_seq", "site_settings_id_seq", "teachers_id_seq",
	"trial_class_events_id_seq", "trial_class_registrations_id_seq", "users_id_seq",
}

var expectedRLSTables = []string{
	"alumnis", "audit_logs", "digital_talents", "jurusans", "news",
	"trial_class_events", "users",
}

var expectedColumns = map[string][]string{
	"alumnis":                   {"id", "nisn", "name", "angkatan", "tahun_lulus", "tahun_ajaran", "status_kelulusan", "kategori", "status_aktivitas", "keterangan", "institusi", "jurusan", "created_at", "updated_at", "deleted_at"},
	"audit_logs":                {"id", "user_id", "user_name", "action", "entity", "entity_id", "details", "ip_address", "created_at"},
	"bkk_alumnis":               {"id", "name", "grad_year", "company", "role", "quote", "photo", "created_at", "updated_at", "deleted_at"},
	"bkk_jobs":                  {"id", "title", "company", "location", "job_type", "deadline", "salary", "requirements", "description", "company_logo", "apply_url", "status", "created_at", "updated_at", "deleted_at", "contact_person", "email_or_wa", "jurusan", "source"},
	"bkk_partners":              {"id", "name", "category", "logo", "description", "website", "order_index", "created_at", "updated_at", "deleted_at"},
	"digital_talents":           {"id", "slug", "number", "title", "category", "image", "short_desc", "full_desc", "core_skills", "supporting_skills", "career_prospects", "tools", "badge_text", "order_index", "is_active", "created_at", "updated_at", "deleted_at"},
	"documents":                 {"id", "title", "category", "file_url", "file_size", "file_type", "description", "download_count", "is_public", "order_index", "created_at", "updated_at", "deleted_at"},
	"ekstrakurikulers":          {"id", "name", "slug", "category", "pembina", "schedule", "description", "image", "badge_color", "order_index", "created_at", "updated_at", "deleted_at"},
	"fasilitas":                 {"id", "name", "category", "image", "description", "capacity", "features", "order_index", "created_at", "updated_at", "deleted_at"},
	"jurusans":                  {"id", "kode", "nama", "slug", "deskripsi", "skills", "prospek_karier", "gambar", "created_at", "updated_at"},
	"news":                      {"id", "title", "slug", "category", "day", "month", "date_formatted", "time", "image", "summary", "content", "author", "created_at", "updated_at", "status", "deleted_at"},
	"prestasis":                 {"id", "slug", "title", "category", "award", "badge_level", "competition", "organizer", "year", "student_name", "student_class", "image", "description", "created_at", "updated_at", "deleted_at"},
	"site_settings":             {"id", "key", "value", "category", "description", "updated_at"},
	"teachers":                  {"id", "name", "role", "category", "image", "bio", "pendidikan_terakhir", "bidang_keahlian", "motto", "kontak", "order_index", "created_at", "updated_at", "deleted_at"},
	"trial_class_events":        {"id", "title", "badge", "date_day", "date_full", "time_range", "timezone", "mode", "submode", "status", "quota", "description", "is_active", "created_at", "updated_at", "deleted_at"},
	"trial_class_registrations": {"id", "ticket_code", "full_name", "school_origin", "whatsapp", "email", "major", "status", "notes", "created_at", "updated_at", "deleted_at"},
	"users":                     {"id", "name", "email", "password", "role", "avatar", "created_at", "updated_at", "deleted_at"},
}

var expectedPublicIndexes = []string{
	"alumnis_pkey", "audit_logs_pkey", "bkk_alumnis_pkey", "bkk_jobs_pkey", "bkk_partners_pkey",
	"digital_talents_pkey", "documents_pkey", "ekstrakurikulers_pkey", "fasilitas_pkey", "jurusans_pkey",
	"news_pkey", "prestasis_pkey", "site_settings_pkey", "teachers_pkey", "trial_class_events_pkey",
	"trial_class_registrations_pkey", "users_pkey",
	"idx_alumnis_deleted_at", "idx_alumnis_kategori", "idx_alumnis_name", "idx_alumnis_nisn",
	"idx_audit_logs_action", "idx_audit_logs_created_at", "idx_audit_logs_entity", "idx_audit_logs_user_id",
	"idx_bkk_alumnis_deleted_at", "idx_bkk_jobs_deleted_at", "idx_bkk_partners_deleted_at", "idx_bkk_partners_order_index",
	"idx_digital_talents_category", "idx_digital_talents_deleted_at", "idx_digital_talents_is_active", "idx_digital_talents_order_index", "idx_digital_talents_slug",
	"idx_documents_category", "idx_documents_deleted_at", "idx_documents_order_index",
	"idx_ekstrakurikulers_category", "idx_ekstrakurikulers_deleted_at", "idx_ekstrakurikulers_order_index", "idx_ekstrakurikulers_slug",
	"idx_fasilitas_category", "idx_fasilitas_deleted_at", "idx_fasilitas_order_index",
	"idx_jurusans_kode", "idx_jurusans_slug", "idx_news_deleted_at", "idx_news_slug",
	"idx_prestasis_category", "idx_prestasis_deleted_at", "idx_prestasis_slug", "idx_prestasis_year", "idx_site_settings_key",
	"idx_teachers_category", "idx_teachers_deleted_at", "idx_teachers_order_index",
	"idx_trial_class_events_deleted_at", "idx_trial_class_events_is_active", "idx_trial_class_registrations_deleted_at",
	"idx_trial_class_registrations_full_name", "idx_trial_class_registrations_ticket_code", "idx_trial_class_registrations_whatsapp",
	"idx_users_deleted_at", "idx_users_email",
}

var expectedPolicies = []string{
	"jurusans.allow public read on jurusans:SELECT",
	"news.Allow public read on news:SELECT",
}

func baselineExistingDatabase(ctx context.Context, provider *goose.Provider, sqlDB *sql.DB) error {
	current, target, err := provider.GetVersions(ctx)
	if err != nil {
		return fmt.Errorf("gagal membaca status migrasi: %w", err)
	}
	if target < 1 {
		return fmt.Errorf("migrasi baseline versi 1 tidak ditemukan")
	}
	if current > 0 {
		return fmt.Errorf("database sudah mencatat versi migrasi %d", current)
	}

	if err := verifyInitialSchema(ctx, sqlDB); err != nil {
		return err
	}

	// Ensure the Goose ledger exists and has its initial version-0 record, then adopt version 1
	// under a transaction lock. This only records history; it never runs the CREATE statements.
	if _, err := provider.GetDBVersion(ctx); err != nil {
		return fmt.Errorf("gagal menyiapkan ledger migrasi: %w", err)
	}
	tx, err := sqlDB.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("gagal memulai transaksi baseline: %w", err)
	}
	defer tx.Rollback()
	if _, err := tx.ExecContext(ctx, "SELECT pg_advisory_xact_lock(hashtext('skomda-schema-baseline-v1'))"); err != nil {
		return fmt.Errorf("gagal mengunci baseline: %w", err)
	}
	var latest int64
	if err := tx.QueryRowContext(ctx, "SELECT COALESCE(MAX(version_id), 0) FROM skomda_internal.goose_db_version").Scan(&latest); err != nil {
		return fmt.Errorf("gagal membaca ledger migrasi: %w", err)
	}
	if latest != 0 {
		return fmt.Errorf("ledger migrasi berubah bersamaan; versi tertinggi sekarang %d", latest)
	}
	if _, err := tx.ExecContext(ctx, "INSERT INTO skomda_internal.goose_db_version (version_id, is_applied) VALUES (1, TRUE)"); err != nil {
		return fmt.Errorf("gagal mencatat versi baseline: %w", err)
	}
	return tx.Commit()
}

func verifyInitialSchema(ctx context.Context, db *sql.DB) error {
	tables, err := queryNames(ctx, db, `SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p') ORDER BY c.relname`)
	if err != nil {
		return fmt.Errorf("gagal membaca daftar tabel: %w", err)
	}
	if err := requireExactNames("tabel public", expectedPublicTables, tables); err != nil {
		return err
	}

	sequences, err := queryNames(ctx, db, `SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'S' ORDER BY c.relname`)
	if err != nil {
		return fmt.Errorf("gagal membaca daftar sequence: %w", err)
	}
	if err := requireExactNames("sequence public", expectedPublicSequences, sequences); err != nil {
		return err
	}
	for table, expected := range expectedColumns {
		columns, err := queryColumnNames(ctx, db, table)
		if err != nil {
			return fmt.Errorf("gagal membaca kolom tabel %s: %w", table, err)
		}
		if err := requireExactNames("kolom tabel "+table, expected, columns); err != nil {
			return err
		}
	}

	indexes, err := queryNames(ctx, db, `SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname`)
	if err != nil {
		return fmt.Errorf("gagal membaca indeks: %w", err)
	}
	if err := requireExactNames("indeks public", expectedPublicIndexes, indexes); err != nil {
		return err
	}

	rlstables, err := queryNames(ctx, db, `SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p') AND c.relrowsecurity ORDER BY c.relname`)
	if err != nil {
		return fmt.Errorf("gagal membaca status RLS: %w", err)
	}
	if err := requireExactNames("tabel dengan RLS", expectedRLSTables, rlstables); err != nil {
		return err
	}

	policies, err := queryNames(ctx, db, `SELECT tablename || '.' || policyname || ':' || cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname`)
	if err != nil {
		return fmt.Errorf("gagal membaca policies: %w", err)
	}
	if err := requireExactNames("policy", expectedPolicies, policies); err != nil {
		return err
	}
	return nil
}

func listPublicTables(ctx context.Context, db *sql.DB) ([]string, error) {
	return queryNames(ctx, db, `SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p') ORDER BY c.relname`)
}

func queryNames(ctx context.Context, db *sql.DB, query string) ([]string, error) {
	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var names []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		names = append(names, name)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return names, nil
}

func queryColumnNames(ctx context.Context, db *sql.DB, table string) ([]string, error) {
	rows, err := db.QueryContext(ctx, `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`, table)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var names []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		names = append(names, name)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return names, nil
}

func requireExactNames(kind string, expected, actual []string) error {
	want := append([]string(nil), expected...)
	have := append([]string(nil), actual...)
	sort.Strings(want)
	sort.Strings(have)
	if strings.Join(want, "\x00") == strings.Join(have, "\x00") {
		return nil
	}
	return fmt.Errorf("%s tidak cocok dengan schema baseline; harap hentikan dan audit dump terbaru (expected %d object, ditemukan %d)", kind, len(want), len(have))
}
