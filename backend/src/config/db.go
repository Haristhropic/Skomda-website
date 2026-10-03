package config

import (
	"encoding/json"
	"log"
	"os"
	"strings"
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/haristhropic/skomda-website/backend/src/models"
)

var DB *gorm.DB

// InitDB menginisialisasi koneksi database GORM, melakukan migrasi otomatis, dan seeder data awal.
func InitDB(cfg Config) *gorm.DB {
	var err error
	switch strings.ToLower(strings.TrimSpace(cfg.DatabaseDriver)) {
	case "postgres":
		if strings.TrimSpace(cfg.DatabaseURL) == "" {
			log.Fatal("fatal: DATABASE_URL wajib diatur saat DATABASE_DRIVER=postgres")
		}
		log.Println("menghubungkan ke PostgreSQL via DATABASE_URL...")
		DB, err = gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	case "sqlite":
		env := strings.ToLower(strings.TrimSpace(cfg.Env))
		if env != "development" && env != "test" {
			log.Fatalf("fatal: SQLite hanya diizinkan untuk development/test, bukan ENV=%q; gunakan DATABASE_DRIVER=postgres", cfg.Env)
		}
		log.Println("menggunakan SQLite lokal sesuai DATABASE_DRIVER=sqlite (tanpa fallback otomatis)")
		DB, err = gorm.Open(sqlite.Open("file:smktelkom_dev.db?cache=shared"), &gorm.Config{})
	default:
		log.Fatalf("fatal: DATABASE_DRIVER tidak valid (%q); gunakan postgres atau sqlite", cfg.DatabaseDriver)
	}
	if err != nil {
		log.Fatalf("fatal: gagal inisialisasi database %s: %v", cfg.DatabaseDriver, err)
	}

	// Pastikan koneksi benar-benar tersedia sebelum migrasi atau seeding berjalan.
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("fatal: gagal mendapatkan database connection pool: %v", err)
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(15 * time.Minute)
	sqlDB.SetConnMaxIdleTime(5 * time.Minute)
	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("fatal: database %s tidak dapat dijangkau; backend tidak akan berjalan: %v", cfg.DatabaseDriver, err)
	}

	// Migration tabel
	if err := DB.AutoMigrate(
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
		&models.TrialClassRegistration{},
		&models.TrialClassEvent{},
	); err != nil {
		log.Fatalf("fatal: gagal auto migrate database: %v", err)
	}

	// Mengaktifkan Row Level Security (RLS) jika menggunakan Postgres
	if DB.Dialector.Name() == "postgres" {
		DB.Exec("ALTER TABLE IF EXISTS public.jurusans ENABLE ROW LEVEL SECURITY;")
		DB.Exec("ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;")
		DB.Exec("ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;")
		DB.Exec("ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;")
		DB.Exec("ALTER TABLE IF EXISTS public.alumnis ENABLE ROW LEVEL SECURITY;")
		DB.Exec("ALTER TABLE IF EXISTS public.digital_talents ENABLE ROW LEVEL SECURITY;")
		DB.Exec("ALTER TABLE IF EXISTS public.trial_class_events ENABLE ROW LEVEL SECURITY;")
	}

	// Inisialisasi akun Super Admin default hanya jika tabel users kosong (0 user)
	SeedDefaultAdminIfEmpty(DB)

	// Inisialisasi data alumni kelulusan jika tabel alumnis kosong
	SeedAlumniIfEmpty(DB)
	DB.Model(&models.Alumni{}).Where("status_aktivitas = ?", "Lulus Resmi").Update("status_aktivitas", "")

	// Inisialisasi spesialisasi Digital Talent Program jika tabel masih kosong
	SeedDtpIfEmpty(DB)

	// Inisialisasi event terdekat Trial Class jika masih kosong
	SeedTrialClassEventIfEmpty(DB)

	return DB
}

// SeedJurusanIfEmpty memasukkan data jurusan resmi (SIJA & TJAT) jika database kosong atau masih berisi data draft lama.
func SeedJurusanIfEmpty(db *gorm.DB, env string) {
	if strings.EqualFold(env, "production") {
		return
	}

	// Hapus data draft lama jika ada
	var countOld int64
	db.Model(&models.Jurusan{}).Where("LOWER(kode) IN ?", []string{"rpl", "tkj", "mm", "tt"}).Count(&countOld)
	if countOld > 0 {
		log.Println("memperbarui data jurusan: menghapus data draft lama (RPL/TKJ/MM/TT) dari database...")
		db.Exec("DELETE FROM jurusans WHERE LOWER(kode) IN ('rpl', 'tkj', 'mm', 'tt')")
	}

	var count int64
	db.Model(&models.Jurusan{}).Count(&count)
	if count > 0 {
		return
	}

	log.Println("seeding data awal jurusan resmi (SIJA & TJAT)...")
	dummyJurusan := []models.Jurusan{
		{
			Kode:          "SIJA",
			Nama:          "Sistem Informasi Jaringan dan Aplikasi",
			Slug:          "sija",
			Deskripsi:     "Program 4 tahun yang mempelajari pemrograman, pengelolaan basis data, dan sistem informasi berbasis teknologi modern.",
			Skills:        []string{"Software Development", "Database & Cloud Computing", "Networking & Cybersecurity"},
			ProspekKarier: []string{"Software Engineer", "Web Developer", "Mobile App Developer", "Database Administrator", "IT Security Specialist", "System Analyst"},
			Gambar:        "/images/jurusan/sija.jpg",
		},
		{
			Kode:          "TJAT",
			Nama:          "Teknik Jaringan Akses Telekomunikasi",
			Slug:          "tjat",
			Deskripsi:     "Program 3 tahun yang fokus pada teknologi jaringan telekomunikasi, infrastruktur fiber optic, dan sistem komunikasi modern.",
			Skills:        []string{"Telecommunication Networks", "Fiber Optic Technology", "Wireless Communication"},
			ProspekKarier: []string{"Network Engineer", "Telecommunication Technician", "Fiber Optic Specialist", "Wireless Network Administrator", "ISP Technician"},
			Gambar:        "/images/jurusan/tjat.jpg",
		},
	}

	for _, j := range dummyJurusan {
		if err := db.Create(&j).Error; err != nil {
			log.Printf("peringatan: gagal seed jurusan %s: %v", j.Kode, err)
		}
	}
	log.Println("berhasil seed data awal jurusan resmi (SIJA & TJAT).")
}

// SeedNewsIfEmpty memasukkan data awal berita jika tabel news masih kosong atau berisi data dummy lama.
func SeedNewsIfEmpty(db *gorm.DB, env string) {
	if strings.EqualFold(env, "production") {
		return
	}

	// Hapus berita dummy lama dari database
	db.Exec("DELETE FROM news WHERE slug IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		"tidak-sekadar-ziarah-siswa-smk-telkom-sidoarjo-hidupkan-semangat-kepahlawanan-di-tmp",
		"siswi-skomda-sukses-raih-juara-1-insys-fest-5-aplikasi-kustomisasi-batik",
		"lomba-matematika-smp-mts-terbesar-se-sidoarjo-sukses-digelar-di-skomda",
		"siswa-xii-sija-1-raih-juara-3-fitcom-3-di-universitas-dinamika",
		"skomda-kubik-2025-resmi-dibuka-smk-telkom-sidoarjo-dorong-siswa-jadi-inovator-muda",
		"kerjasama-strategis-smk-telkom-sidoarjo-bersama-jagoan-hosting-markaz-design",
		"pengumuman-jadwal-asesmen-sumatif-akhir-semester-ganjil-2025-2026",
		"karya-siswa-inovasi-smart-greenhouse-berbasis-iot-cloud-computing-sija",
		"tips-menghadapi-sertifikasi-ccna-dan-cloud-architect-untuk-siswa-smk",
		"kisah-sukses-alumni-skomda-bekerja-sebagai-software-engineer-tech-startup-jakarta",
		"workshop-cyber-security-bersama-telkom-university-siswa-tjat",
		"pelepasan-siswa-prakerin-industri-angkatan-2025-ke-30-perusahaan-mitra",
	)

	var count int64
	db.Model(&models.News{}).Count(&count)
	if count > 0 {
		return
	}

	log.Println("seeding data awal 12 berita resmi dari Google Docs ke database...")
	initialNews := []models.News{
		{
			Title:         "Penuh Dedikasi! Siswa dan Guru SMK Telkom Sidoarjo Peringati Hari Kemerdekaan RI ke-81",
			Slug:          "penuh-dedikasi-siswa-dan-guru-smk-telkom-sidoarjo-peringati-hari-kemerdekaan-ri-ke-81",
			Category:      "Kegiatan Sekolah",
			Day:           "17",
			Month:         "AGT",
			DateFormatted: "17 Agustus 2026",
			Time:          "08.00",
			Image:         "/images/berita/berita-hut-ri-81.png",
			Summary:       "Upacara peringatan Hari Kemerdekaan Republik Indonesia ke-81 di SMK Telkom Sidoarjo berlangsung dengan khidmat dan penuh semangat nasionalisme.",
			Content:       "Upacara peringatan Hari Kemerdekaan Republik Indonesia ke-81 di SMK Telkom Sidoarjo berlangsung dengan khidmat dan penuh semangat nasionalisme.\n\nBertindak sebagai Inspektur Upacara, Kepala SMK Telkom Sidoarjo, Bapak Abror, S.Hum., M.Pd.\n\nTerima kasih kepada seluruh petugas upacara yang telah menjalankan tugas dengan penuh tanggung jawab dan dedikasi. Mari terus kobarkan semangat kemerdekaan dan semangat berkarya untuk Indonesia!",
			Author:        "Humas SKOMDA",
		},
		{
			Title:         "Bikin Suasana 17-an Makin Pecah, Intip Keseruan Rangkaian Lomba di Kegiatan SPECTRA!",
			Slug:          "bikin-suasana-17-an-makin-pecah-intip-keseruan-rangkaian-lomba-di-kegiatan-spectra",
			Category:      "Kegiatan Sekolah",
			Day:           "18",
			Month:         "AGT",
			DateFormatted: "18 Agustus 2026",
			Time:          "13.30",
			Image:         "/images/berita/berita-lomba-spectra.png",
			Summary:       "17-an di SKOMDA auto seru! Bukan cuma siswa, guru, karyawan, sampai seluruh warga sekolah ikut turun langsung meramaikan lomba 17 Agustus SPECTRA.",
			Content:       "17-an di SKOMDA auto seru!\n\nBukan cuma siswa, kali ini guru, karyawan, sampai seluruh warga sekolah ikut turun langsung meramaikan lomba 17 Agustus dalam rangkaian SPECTRA!\n\nMulai dari ketawa bareng, adu strategi, sampai momen-momen receh yang bikin susah move on. Karena di SKOMDA, kemerdekaan paling seru kalau dirayakan bareng-bareng!",
			Author:        "OSIS SKOMDA",
		},
		{
			Title:         "Sabet Medali Emas LKS Nasional 2026, Siswa SMK Telkom Sidoarjo Raih Bantuan Pendidikan dari Gubernur Khofifah",
			Slug:          "sabet-medali-emas-lks-nasional-2026-siswa-smk-telkom-sidoarjo-raih-bantuan-pendidikan-dari-gubernur-khofifah",
			Category:      "Prestasi",
			Day:           "12",
			Month:         "AGT",
			DateFormatted: "12 Agustus 2026",
			Time:          "10.00",
			Image:         "/images/berita/berita-lks-emas-revano.png",
			Summary:       "Setelah meraih Medali Emas Artificial Intelligence di LKS Dikmen Nasional 2026, Revano Satya Pandega menerima bantuan pendidikan dari Gubernur Jawa Timur.",
			Content:       "Setelah meraih Medali Emas Artificial Intelligence di LKS Dikmen Nasional 2026, Revano Satya Pandega kembali menerima bantuan pendidikan dari Gubernur Jawa Timur, Ibu Khofifah Indar Parawansa sebagai bentuk apresiasi atas prestasinya.\n\nMelalui Kepala Dinas Pendidikan Provinsi Jawa Timur, Dr. Aries Agung Paewai, S.STP., M.M., penghargaan ini diharapkan menjadi penyemangat agar Revano terus belajar, berkembang, dan meraih mimpi yang lebih tinggi.\n\nHari ini Revano. Besok, bisa jadi giliran kamu!",
			Author:        "Tim Redaksi SKOMDA",
		},
		{
			Title:         "Bentuk Talenta Siap Kerja, SMK Telkom Sidoarjo Bekali Siswa Pemahaman Industri Lewat Seminar Kebekerjaan",
			Slug:          "bentuk-talenta-siap-kerja-smk-telkom-sidoarjo-bekali-siswa-pemahaman-industri-lewat-seminar-kebekerjaan",
			Category:      "Karya & Inovasi Siswa",
			Day:           "08",
			Month:         "AGT",
			DateFormatted: "8 Agustus 2026",
			Time:          "09.15",
			Image:         "/images/berita/berita-seminar-kebekerjaan.png",
			Summary:       "From Student to Professional: Menjadi profesional bukan dimulai saat lulus, tetapi sejak masih di bangku sekolah melalui Seminar Kebekerjaan SKOMDA.",
			Content:       "From Student to Professional: Menjadi profesional bukan dimulai saat lulus, tetapi sejak masih di bangku sekolah.\n\nMelalui Seminar Kebekerjaan, siswa belajar memahami dunia industri secara langsung, membangun keterampilan yang dibutuhkan, serta mempersiapkan diri menghadapi karier masa depan.\n\nDi SKOMDA, kami percaya bahwa pendidikan bukan sekadar menghasilkan lulusan, tetapi membentuk talenta terbaik yang siap berkarier di dunia industri.",
			Author:        "BKK SKOMDA",
		},
		{
			Title:         "Sesuaikan Kebutuhan Industri Masa Kini, SKOMDA Sediakan 9 Pilihan Keahlian Digital Talent Program",
			Slug:          "sesuaikan-kebutuhan-industri-masa-kini-skomda-sediakan-9-pilihan-keahlian-digital-talent-program",
			Category:      "Artikel & Edukasi",
			Day:           "04",
			Month:         "AGT",
			DateFormatted: "4 Agustus 2026",
			Time:          "11.00",
			Image:         "/images/berita/berita-dtp-9-keahlian.png",
			Summary:       "SKOMDA sediakan 9 pilihan keahlian DTP mulai dari Software Developer, Network, IoT, Cloud, AI Specialist hingga Cyber Security.",
			Content:       "Kalau masa depanmu ada di dunia digital, kamu mau jadi apa?\n\nDi SKOMDA, kamu bisa mulai langkahmu lewat Digital Talent Program (DTP) yang dirancang sesuai kebutuhan industri masa kini. Sembilan pilihan peminatan DTP meliputi Software Developer, Network System Administrator, Network Infrastructure Engineer, Visual Communication Designer, IoT Engineer, Cloud Engineer, AI Specialist, Digital Marketing Specialist, dan Cyber Security Specialist.\n\nDi sini, kamu nggak cuma belajar teori. Kamu juga akan praktik langsung, mengerjakan project, dan mengasah skill yang siap dipakai di dunia kerja maupun dunia industri.",
			Author:        "Tim Kurikulum SKOMDA",
		},
		{
			Title:         "Sambut Siswa Baru, SMK Telkom Sidoarjo Tuntaskan Rangkaian Pra MPLS dan Leadership 2026",
			Slug:          "sambut-siswa-baru-smk-telkom-sidoarjo-tuntaskan-rangkaian-pra-mpls-dan-leadership-2026",
			Category:      "Kegiatan Sekolah",
			Day:           "28",
			Month:         "JUL",
			DateFormatted: "28 Juli 2026",
			Time:          "14.00",
			Image:         "/images/berita/berita-pra-mpls-leadership.png",
			Summary:       "Rangkaian Pra MPLS dan Leadership 2026 tuntas dilaksanakan, menyulut antusiasme tinggi calon peserta didik baru untuk berkarakter unggul.",
			Content:       "Seluruh rangkaian kegiatan Pra MPLS dan Leadership telah berjalan dengan lancar. Semangat, antusias, dan energi positif dari seluruh peserta menjadi awal yang luar biasa untuk perjalanan baru di SMK Telkom Sidoarjo!\n\nBesok adalah saatnya memasuki pembukaan resmi MPLS dan Leadership 2026. Mari siapkan diri, jaga kesehatan, dan datang dengan semangat terbaik untuk memulai petualangan sebagai bagian dari keluarga besar SKOMDA.",
			Author:        "Kesiswaan SKOMDA",
		},
		{
			Title:         "SPMB INDEN 2027/2028 Resmi Dibuka: Bebas Biaya Pendaftaran Khusus Batch Inden",
			Slug:          "spmb-inden-2027-2028-resmi-dibuka-bebas-biaya-pendaftaran-khusus-batch-inden",
			Category:      "Pengumuman",
			Day:           "20",
			Month:         "JUL",
			DateFormatted: "20 Juli 2026",
			Time:          "09.00",
			Image:         "/images/berita/berita-spmb-inden-2027.png",
			Summary:       "Pendaftaran SPMB Batch Inden 2027/2028 SMK Telkom Sidoarjo telah resmi dibuka dengan fasilitas bebas biaya formulir registrasi.",
			Content:       "SPMB INDEN 2027/2028 RESMI DIBUKA!\n\nSaatnya mengambil langkah pertama menuju masa depan bersama SMK Telkom Sidoarjo! Nikmati Benefit Spesial Batch Inden: FREE Biaya Pendaftaran (khusus peserta Batch Inden) hingga batas pendaftaran Jumat, 21 Agustus 2026.\n\nAmankan kesempatanmu lebih awal dan nikmati benefit spesial Batch Inden sebelum periodenya berakhir melalui link pendaftaran resmi: https://s.id/SPMBSKOMDA atau hubungi Contact Person 08113021919.",
			Author:        "Panitia SPMB SKOMDA",
		},
		{
			Title:         "61 Tahun Mengabdi, Telkom Indonesia Terus Dorong Kemajuan Ekosistem Digital di Indonesia",
			Slug:          "61-tahun-mengabdi-telkom-indonesia-terus-dorong-kemajuan-ekosistem-digital-di-indonesia",
			Category:      "Kemitraan & Kerja Sama",
			Day:           "06",
			Month:         "JUL",
			DateFormatted: "6 Juli 2026",
			Time:          "10.30",
			Image:         "/images/berita/berita-hut-61-telkom.png",
			Summary:       "Mengusung semangat Sinergi Transformasi, PT Telkom Indonesia genap 61 tahun memperkuat konektivitas dan talenta digital bangsa.",
			Content:       "Selamat Ulang Tahun ke-61 Telkom Indonesia! Selama 61 tahun, Telkom Indonesia terus menjadi bagian dari perjalanan transformasi digital Indonesia.\n\nMengusung semangat 'Sinergi Transformasi', semoga kolaborasi dan inovasi terus tumbuh, menghadirkan solusi terbaik, serta membawa Indonesia semakin maju di era digital.\n\nDirgahayu Telkom Indonesia! Terus menginspirasi, terus berinovasi, dan terus menghubungkan Indonesia.",
			Author:        "Yayasan Pendidikan Telkom",
		},
		{
			Title:         "Upaya #LevelUp Kualitas Pengajar, Guru-Guru SMK Telkom Sidoarjo Dalami Implementasi AI di Dunia Pendidikan",
			Slug:          "upaya-levelup-kualitas-pengajar-guru-guru-smk-telkom-sidoarjo-dalami-implementasi-ai-di-dunia-pendidikan",
			Category:      "Artikel & Edukasi",
			Day:           "24",
			Month:         "JUN",
			DateFormatted: "24 Juni 2026",
			Time:          "13.00",
			Image:         "/images/berita/berita-levelup-guru-ai.png",
			Summary:       "Kolaborasi bersama Fakultas Ilmu Terapan Telkom University, para pendidik SKOMDA ikuti lokakarya intensif pemanfaatan AI untuk pedagogi cerdas.",
			Content:       "Level Up Guru SMK Telkom Sidoarjo! Dalam semangat terus berkembang, Bapak/Ibu Guru SMK Telkom Sidoarjo mengikuti pelatihan 'AI for Education' sebagai bagian dari kolaborasi antara Telkom University - Fakultas Ilmu Terapan dan SMK Telkom Sidoarjo.\n\nMateri yang dipelajari antara lain: AI untuk dunia pendidikan, Peran AI di dunia industri, Peluang & tantangan AI, serta Implementasi AI dalam pembelajaran di kelas.\n\nKarena di balik siswa yang siap menghadapi masa depan, ada guru yang terus belajar, beradaptasi, dan bertumbuh.",
			Author:        "Litbang SKOMDA",
		},
		{
			Title:         "Julukan 'Spider-Man Darjo'! Billal Habibulloh Siswa SKOMDA Sabet Juara 3 Kejurprov Jatim U17 Speed",
			Slug:          "julukan-spider-man-darjo-billal-habibulloh-siswa-skomda-sabet-juara-3-kejurprov-jatim-u17-speed",
			Category:      "Prestasi",
			Day:           "15",
			Month:         "JUN",
			DateFormatted: "15 Juni 2026",
			Time:          "15.45",
			Image:         "/images/berita/berita-spiderman-darjo-billal.png",
			Summary:       "Billal Habibulloh Arrasyid (XI TJAT 3) harumkan nama sekolah dengan meraih Juara 3 Kejurprov Panjat Tebing Speed U17 KONI Jatim.",
			Content:       "Prestasi kembali ditorehkan oleh siswa SMK Telkom Sidoarjo! Billal Habibulloh Arrasyid, siswa kelas XI TJAT 3 | Angkatan 8 (Alumni SMPN 2 Sidoarjo), berhasil meraih Juara 3 pada Kejurprov Jawa Timur kategori U17 Speed yang diselenggarakan oleh KONI Jawa Timur.\n\nSemoga prestasi ini menjadi inspirasi untuk terus berlatih, berkembang, dan berani meraih mimpi yang lebih tinggi. Terus ukir prestasi, terus menginspirasi!",
			Author:        "Kesiswaan SKOMDA",
		},
		{
			Title:         "Gak Mau Kalah Canggih! Guru SKOMDA Sambangi PT Hummatech Hingga Nortis AI demi Perkembangan Teknologi Terbaru",
			Slug:          "gak-mau-kalah-canggih-guru-skomda-sambangi-pt-hummatech-hingga-nortis-ai-demi-perkembangan-teknologi-terbaru",
			Category:      "Kemitraan & Kerja Sama",
			Day:           "02",
			Month:         "JUN",
			DateFormatted: "2 Juni 2026",
			Time:          "11.15",
			Image:         "/images/berita/berita-guru-kunjungan-hummatech.png",
			Summary:       "Sinkronisasi kurikulum industri, guru kejuruan kunjungi PT Hummatech, Nortis AI, dan PT Radnet Digital Indonesia.",
			Content:       "Di balik siswa hebat, ada guru yang tak pernah berhenti belajar. Untuk menghadirkan pembelajaran yang selaras dengan perkembangan teknologi, para guru SMK Telkom Sidoarjo melaksanakan Kunjungan Industri ke PT Hummatech, Nortis AI, dan PT Radnet Digital Indonesia.\n\nBukan sekadar berkunjung, tetapi belajar langsung dari industri, memperluas wawasan, dan membangun kolaborasi agar setiap ilmu yang diajarkan di kelas benar-benar relevan dengan dunia kerja.",
			Author:        "Hubin SKOMDA",
		},
		{
			Title:         "Siap Go International! SMK di Sidoarjo Ini Kedatangan BP3MI Jatim Kenalkan Peluang Kerja ke Korea Selatan",
			Slug:          "siap-go-international-smk-di-sidoarjo-ini-kedatangan-bp3mi-jatim-kenalkan-peluang-kerja-ke-korea-selatan",
			Category:      "Alumni",
			Day:           "20",
			Month:         "MEI",
			DateFormatted: "20 Mei 2026",
			Time:          "10.00",
			Image:         "/images/berita/berita-bp3mi-kerja-korea.png",
			Summary:       "Program G to G BP3MI Jatim buka wawasan karier global ke Korea Selatan bagi siswa dan calon alumni SMK Telkom Sidoarjo.",
			Content:       "Siapa bilang lulusan SMK cuma punya peluang di dalam negeri? SMK Telkom Sidoarjo kedatangan BP3MI Jawa Timur untuk mengenalkan peluang kerja ke Korea Selatan melalui program Government to Government (GtoG).\n\nSiswa dikenalkan dengan berbagai persiapan menuju dunia kerja internasional, mulai dari sertifikasi kompetensi, bahasa Korea, proses seleksi, hingga kesiapan kerja.\n\nKarena masa depan global tidak dimulai nanti, persiapannya dimulai dari sekarang bersama SKOMDA!",
			Author:        "BKK SKOMDA",
		},
	}

	for _, n := range initialNews {
		if err := db.Create(&n).Error; err != nil {
			log.Printf("peringatan: gagal seed berita '%s': %v", n.Title, err)
		}
	}
	log.Println("berhasil seed 12 data awal berita resmi ke database.")
}

// SeedDefaultAdminIfEmpty membuat akun Super Admin default jika tabel users masih kosong.
func SeedDefaultAdminIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		return
	}
	env := os.Getenv("ENV")
	if env == "" {
		env = os.Getenv("APP_ENV")
	}
	isProduction := strings.EqualFold(strings.TrimSpace(env), "production")

	admin := models.User{
		Name:   "Super Admin SKOMDA",
		Email:  "admin@smktelkom-sda.sch.id",
		Role:   "super_admin",
		Avatar: "/images/common/telkom-schools-icon.png",
	}

	adminPassword := os.Getenv("ADMIN_DEFAULT_PASSWORD")
	if adminPassword == "" {
		if isProduction {
			log.Fatal("[FATAL SECURITY] ADMIN_DEFAULT_PASSWORD wajib diatur (minimal 16 karakter) saat membuat akun admin awal di production")
		}
		adminPassword = "SkomdaAdmin2026!"
	}
	if isProduction && len(strings.TrimSpace(adminPassword)) < 16 {
		log.Fatal("[FATAL SECURITY] ADMIN_DEFAULT_PASSWORD harus minimal 16 karakter saat membuat akun admin awal di production")
	}

	// Password default pengembang aman di-hash dengan bcrypt
	if err := admin.SetPassword(adminPassword); err != nil {
		log.Printf("peringatan: gagal mengenkripsi password admin seeder: %v", err)
		return
	}

	if err := db.Create(&admin).Error; err != nil {
		log.Printf("peringatan: gagal seed akun admin default: %v", err)
		return
	}

	log.Println("berhasil seed akun default Super Admin (admin@smktelkom-sda.sch.id) ke database.")
}

// SeedAlumniIfEmpty mengimpor 255 data alumni awal dari alumni-angkatan-6.json jika tabel alumnis kosong.
func SeedAlumniIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&models.Alumni{}).Count(&count)
	if count > 0 {
		return
	}

	paths := []string{
		"../frontend/src/data/alumni-angkatan-6.json",
		"frontend/src/data/alumni-angkatan-6.json",
		"src/data/alumni-angkatan-6.json",
		"./alumni-angkatan-6.json",
	}

	var data []byte
	var err error
	for _, p := range paths {
		data, err = os.ReadFile(p)
		if err == nil && len(data) > 0 {
			break
		}
	}

	if err != nil || len(data) == 0 {
		log.Printf("info seeder: file alumni-angkatan-6.json belum ditemukan di path standar, seeding alumni dilewati.")
		return
	}

	type jsonAlumni struct {
		ID              uint   `json:"id"`
		NISN            string `json:"nisn"`
		Name            string `json:"name"`
		Angkatan        string `json:"angkatan"`
		TahunLulus      string `json:"tahunLulus"`
		TahunAjaran     string `json:"tahunAjaran"`
		StatusKelulusan string `json:"statusKelulusan"`
		Kategori        string `json:"kategori"`
		StatusAktivitas string `json:"statusAktivitas"`
		Keterangan      string `json:"keterangan"`
		Institusi       string `json:"institusi"`
		Jurusan         string `json:"jurusan"`
	}

	var items []jsonAlumni
	if err := json.Unmarshal(data, &items); err != nil {
		log.Printf("peringatan: gagal parse alumni-angkatan-6.json: %v", err)
		return
	}

	var records []models.Alumni
	for _, item := range items {
		records = append(records, models.Alumni{
			NISN:            item.NISN,
			Name:            item.Name,
			Angkatan:        item.Angkatan,
			TahunLulus:      item.TahunLulus,
			TahunAjaran:     item.TahunAjaran,
			StatusKelulusan: item.StatusKelulusan,
			Kategori:        item.Kategori,
			StatusAktivitas: item.StatusAktivitas,
			Keterangan:      item.Keterangan,
			Institusi:       item.Institusi,
			Jurusan:         item.Jurusan,
		})
	}

	if len(records) > 0 {
		if err := db.CreateInBatches(records, 100).Error; err != nil {
			log.Printf("peringatan: gagal batch insert alumni: %v", err)
			return
		}
		log.Printf("berhasil seed %d data alumni ke database.", len(records))
	}
}

// SeedTrialClassEventIfEmpty menginisialisasi jadwal sesi default Trial Class jika tabel kosong.
func SeedTrialClassEventIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&models.TrialClassEvent{}).Count(&count)
	if count > 0 {
		return
	}

	initialEvent := models.TrialClassEvent{
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
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := db.Create(&initialEvent).Error; err != nil {
		log.Printf("peringatan: gagal seed event trial class default: %v", err)
	} else {
		log.Println("berhasil menginisialisasi jadwal default Event Terdekat Trial Class.")
	}
}
