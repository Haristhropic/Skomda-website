package config

import (
	"log"

	"gorm.io/gorm"

	"github.com/nademmm/smktelkom-web/backend/src/models"
)

// SeedAllEntities telah dinonaktifkan permanen sesuai instruksi.
// Seluruh data kini 100% dikelola mandiri via panel admin tanpa ada overwrite otomatis.
func SeedAllEntities(db *gorm.DB) {
	// No-op: Data dikelola via admin panel
}

// SeedTeachersIfEmpty memasukkan 52 profil pimpinan, waka, guru, dan staf resmi dari frontend/src/data/teachers.ts
func SeedTeachersIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&models.Teacher{}).Count(&count)
	if count >= 52 {
		return
	}
	if count > 0 {
		log.Println("sinkronisasi ulang: memperbarui profil guru dan staf ke 52 data riil lengkap...")
		db.Exec("DELETE FROM teachers")
	}

	initialTeachers := []models.Teacher{
		// 1. Kepala Sekolah
		{
			Name:               "Abror, S.Hum., M.Pd.",
			Role:               "Kepala Sekolah",
			Category:           "Kepala Sekolah",
			Image:              "/images/tentang-kami/profil-guru/abror.png",
			Bio:                "Berkomitmen memimpin SMK Telkom Sidoarjo dalam mencetak generasi unggul yang berkarakter, berdaya saing global, dan siap menjadi pionir industri teknologi digital masa depan.",
			PendidikanTerakhir: "S2 Magister Pendidikan",
			BidangKeahlian:     "Manajemen Pendidikan & Kepemimpinan Sekolah",
			Motto:              "Belajar bukan sekadar mencari nilai, tapi membangun masa depan.",
			Kontak:             "abror@smktelkom-sda.sch.id",
			OrderIndex:         1,
		},
		// 2. Manajemen & Wakil Kepala Sekolah (13 orang)
		{
			Name:       "Siti Sifaun Nadhiroh, S.Pd.",
			Role:       "Waka Bid. Kurikulum",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/faun.png",
			OrderIndex: 2,
		},
		{
			Name:       "Achmad Rifai, S.Pd., M.H.",
			Role:       "Waka Bid. Sarana dan Prasarana",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/rifai.png",
			OrderIndex: 3,
		},
		{
			Name:       "Rachel Apriliani, S.Pd.",
			Role:       "Waka Bid. Kesiswaan",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/rachel.png",
			OrderIndex: 4,
		},
		{
			Name:       "Maulana Alghofiqi, M.Pd.",
			Role:       "Kepala Administrasi",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/maulana.png",
			OrderIndex: 5,
		},
		{
			Name:       "Ike Yuliastuti, S.ST.",
			Role:       "Kepala Program Studi",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/ike.png",
			OrderIndex: 6,
		},
		{
			Name:       "Muhammad Adi Riswanto, S.ST.",
			Role:       "Kepala Program Studi",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/adi.png",
			OrderIndex: 7,
		},
		{
			Name:       "Mokhammad Misbakhul Abid, S.Pd.",
			Role:       "Kepala Urusan",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/abid.png",
			OrderIndex: 8,
		},
		{
			Name:       "Yunia Vita, S.Pd.",
			Role:       "Kepala Urusan",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/yunia.png",
			OrderIndex: 9,
		},
		{
			Name:       "Novra Edi Pratama, S.ST.",
			Role:       "Kepala Urusan",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/novra.png",
			OrderIndex: 10,
		},
		{
			Name:       "Galuh Rahmawati, S.Pd.",
			Role:       "Kepala Urusan",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/galuh.png",
			OrderIndex: 11,
		},
		{
			Name:       "Eka Prasetia Purnawati Iswardiani, M.T.",
			Role:       "Kepala Urusan",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/eka.png",
			OrderIndex: 12,
		},
		{
			Name:       "Muhammad Adam Nuh Ibrahim, M.Pd.",
			Role:       "Kepala Urusan",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/adam.png",
			OrderIndex: 13,
		},
		{
			Name:       "Guruh Mayonk Firmansyah, S.Sos.",
			Role:       "Kepala Urusan",
			Category:   "Manajemen",
			Image:      "/images/tentang-kami/profil-guru/mayonk.png",
			OrderIndex: 14,
		},
		// 3. Guru Mata Pelajaran (28 orang)
		{
			Name:       "Lia Indriawati, S.Pd.I.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/lia.png",
			OrderIndex: 15,
		},
		{
			Name:       "Rina Novia Wahyuningtyas, M.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/rina.png",
			OrderIndex: 16,
		},
		{
			Name:       "Muhammad Syaiful Ulum, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/ulum.png",
			OrderIndex: 17,
		},
		{
			Name:       "Fajar Trihadmoko, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/fajar.png",
			OrderIndex: 18,
		},
		{
			Name:       "Amir Hamka, S.Pd.I., M.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/hamka.png",
			OrderIndex: 19,
		},
		{
			Name:       "Chintia Trinanda Wijaya, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/chintia.png",
			OrderIndex: 20,
		},
		{
			Name:       "Eliza Tyas Damayanti, S.Kom.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/eliza.png",
			OrderIndex: 21,
		},
		{
			Name:       "Arganata Dian Amarullah, S.T.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/arga.png",
			OrderIndex: 22,
		},
		{
			Name:       "Ferina Kumala Dewi, S.Hum., M.Li.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/ferina.png",
			OrderIndex: 23,
		},
		{
			Name:       "Shandi Pratama, M.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/shandi.png",
			OrderIndex: 24,
		},
		{
			Name:       "Rizka Rahayu Sasmita, M.Tr.Kom.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/rizka.png",
			OrderIndex: 25,
		},
		{
			Name:       "David Wahyu Pratomo, S.T.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/david.png",
			OrderIndex: 26,
		},
		{
			Name:       "Indra Hadi Pranata, S.Pd., M.M.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/indra-hadi.png",
			OrderIndex: 27,
		},
		{
			Name:       "Hadi Triyono, M.Th.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/hadi.png",
			OrderIndex: 28,
		},
		{
			Name:       "Nafita Rahma, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/nafita.png",
			OrderIndex: 29,
		},
		{
			Name:       "Sarah Aslamiyah, M.Li.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/sarah.png",
			OrderIndex: 30,
		},
		{
			Name:       "Deyan Suprayogi, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/dean.png",
			OrderIndex: 31,
		},
		{
			Name:       "Muhammad Habibi, S.Pd.I.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/habibi.png",
			OrderIndex: 32,
		},
		{
			Name:       "Sinta Aura Rokhmatillah, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/sinta.png",
			OrderIndex: 33,
		},
		{
			Name:       "Ilham Okta Alpriansyah, S.Tr.T.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/ilham.png",
			OrderIndex: 34,
		},
		{
			Name:       "Lailatun Nikmah, S.Pd.I.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/laila.png",
			OrderIndex: 35,
		},
		{
			Name:       "Ika Zuliana, S.Tr.T.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/kazu.png",
			OrderIndex: 36,
		},
		{
			Name:       "M. Suhud Abdillah Akbar, S.ST.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/suhud.png",
			OrderIndex: 37,
		},
		{
			Name:       "Putri Ayu Zartika, M.T.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/putri.png",
			OrderIndex: 38,
		},
		{
			Name:       "Ellsa Christy Maharani, S.Tr.T.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/ellsa.png",
			OrderIndex: 39,
		},
		{
			Name:       "Sheril Ghalih Servianto, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/galih.png",
			OrderIndex: 40,
		},
		{
			Name:       "Grisa Fima Nurandika, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/grisa.png",
			OrderIndex: 41,
		},
		{
			Name:       "Muhammad Maulana Baihaqi, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/haqi.png",
			OrderIndex: 42,
		},
		{
			Name:       "Okky Arita Wahyu Nur Maharani, S.Pd.",
			Role:       "Guru Mata Pelajaran",
			Category:   "Guru",
			Image:      "/images/tentang-kami/profil-guru/okky.png",
			OrderIndex: 43,
		},
		// 4. Staff & Tenaga Kependidikan (10 orang)
		{
			Name:       "Pratama Rangsia Alamanda, S.E.",
			Role:       "Staff HC, Logistik, dan Kesekretariatan",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/manda.png",
			OrderIndex: 44,
		},
		{
			Name:       "Vina Rachmaya, S.Sos.",
			Role:       "Staff Administrasi",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/vina.png",
			OrderIndex: 45,
		},
		{
			Name:       "Hana Rachma Citra, S.T.",
			Role:       "Staff Administrasi Bidang Hubin",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/hana.png",
			OrderIndex: 46,
		},
		{
			Name:       "Risma Ayu Lukiswara, S.H.",
			Role:       "Staff Keuangan",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/risma.png",
			OrderIndex: 47,
		},
		{
			Name:       "Fany Aditya Febriansyah",
			Role:       "Tenaga Kebersihan",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/fanny.png",
			OrderIndex: 48,
		},
		{
			Name:       "Firman Armansyah Maulana",
			Role:       "Tenaga Kebersihan",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/firman.png",
			OrderIndex: 49,
		},
		{
			Name:       "Mukhammad Efendi",
			Role:       "Tenaga Kebersihan",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/efendi.png",
			OrderIndex: 50,
		},
		{
			Name:       "Misbakhul Arifin",
			Role:       "Tenaga Keamanan",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/arifin.png",
			OrderIndex: 51,
		},
		{
			Name:       "Rio Dany Wijaya",
			Role:       "Tenaga Keamanan",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/rio.png",
			OrderIndex: 52,
		},
		{
			Name:       "Indra Kurniawan",
			Role:       "Tenaga Keamanan",
			Category:   "Staf",
			Image:      "/images/tentang-kami/profil-guru/indra-kurniawan.png",
			OrderIndex: 53,
		},
	}

	for _, t := range initialTeachers {
		db.Create(&t)
	}
	log.Println("berhasil seed 52 data profil guru, kepala sekolah, dan staf resmi ke database.")
}

// SeedPrestasiIfEmpty memasukkan 11 data prestasi resmi dari frontend/src/data/prestasiData.ts
func SeedPrestasiIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&models.Prestasi{}).Count(&count)
	if count >= 11 {
		return
	}
	if count > 0 {
		log.Println("sinkronisasi ulang: memperbarui prestasi ke 11 data riil lengkap...")
		db.Exec("DELETE FROM prestasis")
	}

	initialPrestasi := []models.Prestasi{
		{
			Slug:         "iitc-web-design-2026",
			Title:        "Kreativitas Digital Berbuah Prestasi, SKOMDA Raih Juara 2 Web Design",
			Category:     "IT & AI",
			Award:        "Juara 2",
			BadgeLevel:   "Juara 2",
			Competition:  "Intermedia Information Technology Competition (IITC) 2026",
			Organizer:    "Universitas Amikom Purwokerto",
			Year:         "2026",
			StudentName:  "Zaina Fildza Ghaisani",
			StudentClass: "XII TJAT 5",
			Image:        "/images/tentang-kami/prestasi/prestasi-iitc-web-design-zaina.png",
			Description:  "Zaina Fildza Ghaisani berhasil meraih Juara 2 Web Design dalam Intermedia Information Technology Competition (IITC) 2026 yang diselenggarakan Universitas Amikom Purwokerto. Pencapaian ini menunjukkan kemampuan dalam mengembangkan ide kreatif menjadi sebuah karya digital yang menarik dan inovatif.",
		},
		{
			Slug:         "iitc-generative-ai-2026",
			Title:        "Berkarya dengan Generative AI, Siswa SKOMDA Raih Juara 3 IITC 2026",
			Category:     "IT & AI",
			Award:        "Juara 3",
			BadgeLevel:   "Juara 3",
			Competition:  "Intermedia Information Technology Competition (IITC) 2026",
			Organizer:    "Universitas Amikom Purwokerto",
			Year:         "2026",
			StudentName:  "Agung Dwi Saputra & Masnuril Rayya Tsabita",
			StudentClass: "XII TJAT 5 & XII TJAT 1",
			Image:        "/images/tentang-kami/prestasi/prestasi-iitc-gen-ai-agung-rayya.png",
			Description:  "Agung Dwi Saputra dan Masnuril Rayya Tsabita berhasil meraih Juara 3 Generative AI pada Intermedia Information Technology Competition (IITC) 2026. Melalui perpaduan kreativitas dan teknologi, keduanya berhasil menghadirkan karya yang mampu bersaing dalam kompetisi.",
		},
		{
			Slug:         "beefest-sdlc-binus-2026",
			Title:        "Skill Coding Berbuah Gold Medal, Siswa SKOMDA Juara 1 SDLC BINUS",
			Category:     "IT & AI",
			Award:        "Gold Medal (Juara 1)",
			BadgeLevel:   "Gold Medal",
			Competition:  "Beefest: Software Development Logical Competition (SDLC)",
			Organizer:    "School of Computer Science BINUS University",
			Year:         "2026",
			StudentName:  "Revano Satya Pandega",
			StudentClass: "XIII SIJA",
			Image:        "/images/tentang-kami/prestasi/prestasi-beefest-sdlc-revano.png",
			Description:  "Revano Satya Pandega berhasil meraih Gold Medal (Juara 1) dalam Beefest: Software Development Logical Competition (SDLC) yang diselenggarakan oleh School of Computer Science BINUS University. Prestasi ini menjadi bukti kemampuan dalam mengembangkan solusi dengan memanfaatkan logika dan teknologi.",
		},
		{
			Slug:         "lks-dikmen-nasional-ai-2026",
			Title:        "Tampil di Tingkat Nasional, Tim SKOMDA Raih Juara 1 LKS DIKMEN 2026",
			Category:     "IT & AI",
			Award:        "Juara 1",
			BadgeLevel:   "Juara 1",
			Competition:  "LKS DIKMEN Tingkat Nasional 2026 bidang Artificial Intelligence (Kecerdasan Artifisial)",
			Organizer:    "LKS DIKMEN Tingkat Nasional",
			Year:         "2026",
			StudentName:  "Ilham Yudistira S. A., Nabil Fauzan A., & Revano Satya Pandega",
			StudentClass: "SMK Telkom Sidoarjo",
			Image:        "/images/tentang-kami/prestasi/prestasi-lks-nasional-ai-revano.png",
			Description:  "Persaingan semakin luas ketika langkah membawa kita ke tingkat nasional. Ilham Yudistira S. A., Nabil Fauzan A., dan Revano Satya Pandega berhasil meraih Juara 1 LKS DIKMEN Tingkat Nasional 2026 bidang Artificial Intelligence. Sebuah pencapaian yang menjadi bagian dari perjalanan mereka dalam mengembangkan kemampuan dan membawa nama sekolah di tingkat nasional.",
		},
		{
			Slug:         "kejurprov-u17-speed-2026",
			Title:        "Kecepatan yang Dibangun dari Ketekunan",
			Category:     "Olahraga",
			Award:        "Juara 3",
			BadgeLevel:   "Juara 3",
			Competition:  "Kejurprov Jawa Timur kategori U17 Speed",
			Organizer:    "KONI Jawa Timur",
			Year:         "2026",
			StudentName:  "Billal Habibulloh Arrasyid",
			StudentClass: "XI TJAT 3",
			Image:        "/images/tentang-kami/prestasi/prestasi-kejurprov-speed-billal.png",
			Description:  "Tidak ada hasil yang datang dalam satu malam. Billal Habibulloh Arrasyid berhasil meraih Juara 3 Kejurprov Jawa Timur kategori U17 Speed yang diselenggarakan oleh KONI Jawa Timur. Di balik pencapaian tersebut ada latihan, konsistensi, dan keberanian untuk terus berkembang di setiap perlombaan.",
		},
		{
			Slug:         "pelajar-pelopor-llaj-2026",
			Title:        "Ketika Pelajar Turut Membawa Perubahan",
			Category:     "Kepemimpinan",
			Award:        "Juara 2",
			BadgeLevel:   "Juara 2",
			Competition:  "Pemilihan Pelajar Pelopor Keselamatan Lalu Lintas dan Angkutan Jalan (LLAJ) Kabupaten Sidoarjo 2026",
			Organizer:    "Kabupaten Sidoarjo",
			Year:         "2026",
			StudentName:  "Charen Jullieta Kertiyasa",
			StudentClass: "XII TJAT 3",
			Image:        "/images/tentang-kami/prestasi/prestasi-pelajar-pelopor-llaj-charen.png",
			Description:  "Menjadi pelajar bukan hanya tentang belajar di dalam kelas. Charen Jullieta Kertiyasa berhasil meraih Juara 2 Pemilihan Pelajar Pelopor Keselamatan Lalu Lintas dan Angkutan Jalan (LLAJ) Kabupaten Sidoarjo 2026. Prestasi ini menunjukkan bahwa kepedulian dan keberanian untuk berkontribusi juga dapat menjadi bagian dari perjalanan berprestasi.",
		},
		{
			Slug:         "porkab-renang-kupu-kupu-2026",
			Title:        "50 Meter yang Membawa Pulang Prestasi",
			Category:     "Olahraga",
			Award:        "Juara 3",
			BadgeLevel:   "Juara 3",
			Competition:  "Gaya Kupu-Kupu 50 M KU Open - PORKAB Sidoarjo 2026",
			Organizer:    "PORKAB Sidoarjo",
			Year:         "2026",
			StudentName:  "Muhammad Nabil Putra R",
			StudentClass: "XIII SIJA",
			Image:        "/images/tentang-kami/prestasi/prestasi-porkab-renang-nabil.png",
			Description:  "Dalam perlombaan, setiap detik memiliki arti. Muhammad Nabil Putra R berhasil meraih Juara 3 Gaya Kupu-Kupu 50 M KU Open pada PORKAB Sidoarjo 2026. Pencapaian ini menjadi hasil dari proses latihan dan ketekunan untuk terus memberikan performa terbaik di lintasan.",
		},
		{
			Slug:         "content-creator-competition-2026",
			Title:        "Dari Sebuah Ide, Menjadi Sebuah Cerita",
			Category:     "Seni & Kreatif",
			Award:        "Juara 3",
			BadgeLevel:   "Juara 3",
			Competition:  "Content Creator Competition Sidoarjo School Fest 2026",
			Organizer:    "Sidoarjo School Fest 2026",
			Year:         "2026",
			StudentName:  "Ahmad Rico Raharjo, Rahardian Surya Darmawan, Aura Luthfia Annisa, & Daffa Zayyan Aryabima",
			StudentClass: "SMK Telkom Sidoarjo",
			Image:        "/images/tentang-kami/prestasi/prestasi-content-creator-sidoarjo.png",
			Description:  "Sebuah karya selalu dimulai dari sebuah ide. Ahmad Rico Raharjo, Rahardian Surya Darmawan, Aura Luthfia Annisa, dan Daffa Zayyan Aryabima berhasil meraih Juara 3 Content Creator Competition Sidoarjo School Fest 2026. Lewat kreativitas dan kolaborasi, mereka mengolah ide menjadi karya yang berhasil mendapatkan apresiasi dalam kompetisi.",
		},
		{
			Slug:         "lafest-telkom-university-2026",
			Title:        "Membawa Karya Lebih Jauh",
			Category:     "Seni & Kreatif",
			Award:        "Juara 2",
			BadgeLevel:   "Juara 2",
			Competition:  "LAFEST 2026 Tingkat Nasional",
			Organizer:    "Telkom University Bandung",
			Year:         "2026",
			StudentName:  "Muhammad Afgan Gahzy",
			StudentClass: "SMK Telkom Sidoarjo",
			Image:        "/images/tentang-kami/prestasi/prestasi-lafest-afgan.png",
			Description:  "Sebuah karya tidak berhenti ketika selesai dibuat. Muhammad Afgan Gahzy berhasil meraih Juara 2 LAFEST 2026 Tingkat Nasional yang diselenggarakan oleh Telkom University Bandung. Pencapaian ini menjadi kesempatan untuk membawa karya lebih jauh sekaligus menunjukkan potensi dalam kompetisi tingkat nasional.",
		},
		{
			Slug:         "fls2n-film-pendek-2026",
			Title:        "Ketika Sebuah Cerita Menjadi Prestasi",
			Category:     "Seni & Kreatif",
			Award:        "Juara 1",
			BadgeLevel:   "Juara 1",
			Competition:  "Film Pendek FLS3N 2026 Kab Sidoarjo",
			Organizer:    "FLS3N Kab Sidoarjo",
			Year:         "2026",
			StudentName:  "Ghulam Nawwaf, Rahardian Surya Darmawan, & Ahmad Rico Raharjo",
			StudentClass: "SMK Telkom Sidoarjo",
			Image:        "/images/tentang-kami/prestasi/prestasi-fls2n-film-pendek.png",
			Description:  "Setiap film berawal dari sebuah cerita, tetapi tidak semua cerita berakhir di podium. Ghulam Nawwaf, Rahardian Surya Darmawan, dan Ahmad Rico Raharjo berhasil meraih Juara 1 Film Pendek FLS3N 2026 Kabupaten Sidoarjo. Melalui kreativitas dan kerja sama, mereka mengubah sebuah gagasan menjadi karya yang berhasil meraih prestasi.",
		},
		{
			Slug:         "ficpact-cup-ai-storytelling-2026",
			Title:        "Ketika Teknologi Punya Cerita",
			Category:     "IT & AI",
			Award:        "Juara 1",
			BadgeLevel:   "Juara 1",
			Competition:  "AI Video Story Telling pada FICPACT CUP 2026",
			Organizer:    "BEM FIKOM Universitas Katolik Soegijapranata (SCU)",
			Year:         "2026",
			StudentName:  "Agung Dwi Saputra & Gregorius Olvans A.W",
			StudentClass: "SMK Telkom Sidoarjo",
			Image:        "/images/tentang-kami/prestasi/prestasi-ficpact-ai-storytelling.png",
			Description:  "Bagaimana jika kecanggihan teknologi bertemu dengan kekuatan sebuah cerita? Agung Dwi Saputra dan Gregorius Olvans A.W menjawabnya melalui karya yang berhasil meraih Juara 1 AI Video Storytelling pada FICPACT CUP 2026 yang diselenggarakan oleh BEM FIKOM Universitas Katolik Soegijapranata (SCU). Sebuah karya yang memadukan storytelling dan teknologi AI dalam satu gagasan kreatif.",
		},
	}

	for _, p := range initialPrestasi {
		db.Create(&p)
	}
	log.Println("berhasil seed 11 data prestasi resmi siswa ke database.")
}

// SeedEkskulIfEmpty memasukkan 12 cabang ekstrakurikuler resmi dari frontend/src/data/ekstrakurikulerData.ts
func SeedEkskulIfEmpty(db *gorm.DB) {
	var countWithImage int64
	db.Model(&models.Ekstrakurikuler{}).Where("image != ''").Count(&countWithImage)
	if countWithImage >= 12 {
		return
	}
	db.Exec("DELETE FROM ekstrakurikulers")

	ekskulList := []models.Ekstrakurikuler{
		{
			Name:        "Pramuka",
			Slug:        "pramuka",
			Category:    "Bela Negara & Kepemimpinan",
			Description: "Kegiatan untuk melatih kedisiplinan, kemandirian, kerja sama, dan tanggung jawab siswa melalui kegiatan kepramukaan dan aktivitas kelompok.",
			Image:       "/images/students/student-blazer-standing.png",
			OrderIndex:  1,
		},
		{
			Name:        "Paskibra",
			Slug:        "paskibra",
			Category:    "Bela Negara & Kepemimpinan",
			Description: "Kegiatan yang berfokus pada latihan baris-berbaris, tata upacara, kedisiplinan, kekompakan, dan pembentukan sikap tanggung jawab.",
			Image:       "/images/students/student-blazer-smile.png",
			OrderIndex:  2,
		},
		{
			Name:        "KIR (Karya Ilmiah Remaja)",
			Slug:        "kir",
			Category:    "Akademik & Bahasa",
			Description: "Kegiatan bagi siswa yang tertarik dengan penelitian dan pengembangan ide. Siswa dapat belajar mencari informasi, menyusun karya ilmiah, melakukan percobaan, dan mempresentasikan hasilnya.",
			Image:       "/images/students/student-batik-confident.png",
			OrderIndex:  3,
		},
		{
			Name:        "PMR (Palang Merah Remaja)",
			Slug:        "pmr",
			Category:    "Bela Negara & Kepemimpinan",
			Description: "Kegiatan yang mengenalkan siswa pada dasar-dasar pertolongan pertama, kesehatan, serta kepedulian terhadap lingkungan dan sesama.",
			Image:       "/images/students/student-batik-greeting.png",
			OrderIndex:  4,
		},
		{
			Name:        "Voli",
			Slug:        "voli",
			Category:    "Olahraga & Bela Diri",
			Description: "Kegiatan olahraga yang melatih kemampuan dasar permainan voli, kebugaran, kerja sama tim, dan sportivitas melalui latihan bersama.",
			Image:       "/images/home/hero/image5.png",
			OrderIndex:  5,
		},
		{
			Name:        "Futsal",
			Slug:        "futsal",
			Category:    "Olahraga & Bela Diri",
			Description: "Kegiatan olahraga yang menjadi wadah bagi siswa untuk bermain dan mengembangkan kemampuan futsal. Latihan meliputi teknik dasar, permainan tim, serta menjaga kebugaran.",
			Image:       "/images/home/hero/image1.png",
			OrderIndex:  6,
		},
		{
			Name:        "BDI (Badan Dakwah Islam)",
			Slug:        "bdi",
			Category:    "Bela Negara & Kepemimpinan",
			Description: "Kegiatan yang menjadi wadah siswa untuk mengikuti aktivitas keislaman di sekolah, seperti kajian, kegiatan keagamaan, dan peringatan hari besar Islam.",
			Image:       "/images/students/student-batik-presenting.png",
			OrderIndex:  7,
		},
		{
			Name:        "Basket",
			Slug:        "basket",
			Category:    "Olahraga & Bela Diri",
			Description: "Kegiatan olahraga untuk siswa yang memiliki minat pada permainan basket. Latihan mencakup teknik dasar, permainan tim, kebugaran, dan sportivitas.",
			Image:       "/images/home/hero/image4.png",
			OrderIndex:  8,
		},
		{
			Name:        "Musik",
			Slug:        "musik",
			Category:    "Seni & Kreativitas",
			Description: "Wadah bagi siswa yang memiliki minat di bidang musik untuk berlatih vokal maupun alat musik, mengembangkan kreativitas, dan berpartisipasi dalam kegiatan atau acara sekolah.",
			Image:       "/images/program/ekstrakurikuler/hero-student-guitar.png",
			OrderIndex:  9,
		},
		{
			Name:        "English Club",
			Slug:        "english-club",
			Category:    "Akademik & Bahasa",
			Description: "Kegiatan untuk meningkatkan kemampuan berbahasa Inggris melalui latihan percakapan, vocabulary, speaking, dan aktivitas lainnya yang menggunakan bahasa Inggris.",
			Image:       "/images/students/student-batik-point-side.png",
			OrderIndex:  10,
		},
		{
			Name:        "E-Sport",
			Slug:        "e-sport",
			Category:    "Teknologi & Gaming",
			Description: "Kegiatan bagi siswa yang memiliki minat pada permainan elektronik kompetitif. Selain kemampuan bermain, kegiatan juga melatih komunikasi, kerja sama tim, strategi, dan sportivitas.",
			Image:       "/images/program/ekstrakurikuler/ekskul-esport.png",
			OrderIndex:  11,
		},
		{
			Name:        "Silat",
			Slug:        "silat",
			Category:    "Olahraga & Bela Diri",
			Description: "Kegiatan bela diri yang melatih teknik dasar pencak silat, kebugaran, kedisiplinan, dan pengendalian diri melalui latihan rutin.",
			Image:       "/images/home/hero/image6.png",
			OrderIndex:  12,
		},
	}

	for _, e := range ekskulList {
		db.Create(&e)
	}
	log.Println("berhasil seed 12 data ekstrakurikuler resmi ke database.")
}

// SeedFasilitasIfEmpty memasukkan 16 data fasilitas & sarana prasarana resmi dari frontend/src/data/fasilitasData.ts
func SeedFasilitasIfEmpty(db *gorm.DB) {
	fasilitasList := []models.Fasilitas{
		{
			Name:        "Ruang Kelas Modern",
			Category:    "Ruang Belajar & RPS",
			Description: "Ruang kelas berstandar internasional yang dirancang ergonomis untuk mendukung interaksi pembelajaran aktif dan kolaboratif antar siswa dan guru.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-ruang-kelas.png",
			Features:    "Air Conditioner (AC) Full, Smart TV 55 Inch Interaktif, Meja & Kursi Single Seat Ergonomis, Dedicated High-Speed Wi-Fi",
			Capacity:    "Smart Class",
			OrderIndex:  1,
		},
		{
			Name:        "Gedung RPS (Ruang Praktik Siswa)",
			Category:    "Ruang Belajar & RPS",
			Description: "Gedung Ruang Praktik Siswa (RPS) 2 lantai yang menjadi pusat inkubasi skill teknis dan simulasi langsung lingkungan kerja industri digital.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-rps.jpg",
			Features:    "Bangunan 2 Lantai Modern, Zona Proyek Industri & TeFa, Ruang Diskusi Tim & Presentasi, Standar Industri K3",
			Capacity:    "2 Lantai",
			OrderIndex:  2,
		},
		{
			Name:        "Aula / Graha Hall Videotron",
			Category:    "Sarana Umum & Olahraga",
			Description: "Aula serbaguna megah dengan kapasitas besar, sound system auditorium, dan layar videotron besar untuk seminar kebekerjaan, wisuda, dan acara nasional.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-aula.png",
			Features:    "Layar Videotron Panggung LED Luas, Kapasitas Ratusan Audiens, Audio Visual & Tata Suara Studio, Panggung Teatrikal & Presentasi",
			Capacity:    "Layar Videotron",
			OrderIndex:  3,
		},
		{
			Name:        "Laboratorium Telekomunikasi & Fiber Optic (FO)",
			Category:    "Laboratorium Kejuruan",
			Description: "Laboratorium spesialisasi TJAT dengan perangkat industri fiber optic mutakhir untuk pelatihan penyambungan fiber, pengukuran optical power, dan desain FTTH.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-lab-fiber-optic.jpg",
			Features:    "Optical Fusion Splicer, Optical Time Domain Reflectometer (OTDR), Optical Power Meter (OPM), Miniature Tiang & ODP Distribusi",
			Capacity:    "FTTH & Fusion Splicer",
			OrderIndex:  4,
		},
		{
			Name:        "Laboratorium Artificial Intelligence (AI)",
			Category:    "Laboratorium Kejuruan",
			Description: "Fasilitas riset komputasi AI bagi siswa dan guru untuk eksplorasi machine learning, computer vision, generative AI, dan video storytelling.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-lab-ai.jpg",
			Features:    "High Performance GPU Workstations, AI Model Training Frameworks, Interactive Display Monitor, Server Akses AI Terpusat",
			Capacity:    "High-End AI Workstation",
			OrderIndex:  5,
		},
		{
			Name:        "Laboratorium Internet of Things (IoT)",
			Category:    "Laboratorium Kejuruan",
			Description: "Dua ruang laboratorium IoT terintegrasi untuk prototipe mikrokontroler, sensor cerdas, otomatisasi smart home/smart school, dan sistem telemetri.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-lab-iot.jpg",
			Features:    "2 Ruang Praktik IoT Khusus, Sensor & Actuator Industrial Kits, Development Boards (ESP32, Arduino, STM32), Platform IoT Cloud & Dashboard",
			Capacity:    "2 Ruang Khusus IoT",
			OrderIndex:  6,
		},
		{
			Name:        "Laboratorium Jaringan Komputer & Cyber Security",
			Category:    "Laboratorium Kejuruan",
			Description: "Laboratorium simulasi enterprise network dengan rackmount server, routerboard MikroTik, switch Cisco, serta infrastruktur network defense.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-lab-jaringan.jpg",
			Features:    "Server Rackmount & Patch Panel, Perangkat Cisco & Router MikroTik, Simulasi Topologi Enterprise, Tools Analisis Keamanan Jaringan",
			Capacity:    "Enterprise Network Rack",
			OrderIndex:  7,
		},
		{
			Name:        "Laboratorium Komputer & Rekayasa Perangkat Lunak",
			Category:    "Laboratorium Kejuruan",
			Description: "Laboratorium komputasi berkapasitas besar untuk pengembangan software web, aplikasi mobile, database management system, dan cloud computing.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-lab-komputer.png",
			Features:    "PC Spesifikasi Tinggi Core i5/i7, Koneksi LAN Gigabit Berkecepatan Tinggi, IDE & Compiler Software Development Lengkap, Ruang Sejuk Ber-AC",
			Capacity:    "Dedicated Coding Studio",
			OrderIndex:  8,
		},
		{
			Name:        "Outdoor Class & Eco Learning Zone",
			Category:    "Ruang Belajar & RPS",
			Description: "Area pembelajaran luar ruang bernuansa asri dan hijau untuk diskusi santai, brainstorming kelompok, dan pengenalan konsep belajar terbuka.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-outdoor-class.png",
			Features:    "Suasana Terbuka & Hijau, Meja Diskusi Kolaboratif, Akses Wi-Fi Outdoor, Zona Diskusi Santai",
			Capacity:    "Area Belajar Hijau",
			OrderIndex:  9,
		},
		{
			Name:        "Kantin Cashless SKOMDA",
			Category:    "Sarana Umum & Olahraga",
			Description: "Area pujasera sekolah yang higienis dengan sistem pembayaran 100% non-tunai (QRIS & tap card) untuk kenyamanan dan literasi keuangan digital.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-kantin.png",
			Features:    "Transaksi Digital Cashless / QRIS, Menu Sehat, Higienis, & Terkurasi, Area Makan Luas dan Bersih, Tempat Duduk Komunal",
			Capacity:    "100% Non-Tunai",
			OrderIndex:  10,
		},
		{
			Name:        "Lapangan Olahraga Utama",
			Category:    "Sarana Umum & Olahraga",
			Description: "Lapangan multifungsi berstandar untuk upacara bendera, apel kedisiplinan, parade kegiatan siswa, serta olahraga futsal dan voli.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-lapangan-utama.jpg",
			Features:    "Lapangan Luas Beraspal Halus & Marka Jelas, Tiang Bendera Upacara Resmi, Gawang Futsal & Net Voli, Penerangan Lapangan",
			Capacity:    "Multifungsi",
			OrderIndex:  11,
		},
		{
			Name:        "Lapangan Basket Standar",
			Category:    "Sarana Umum & Olahraga",
			Description: "Fasilitas olahraga basket dengan lantai lapangan yang terawat baik dan ring kokoh untuk latihan rutin ekstrakurikuler serta turnamen internal.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-lapangan-basket.png",
			Features:    "Ring Basket Standar Nasional, Area Pembatas Lapangan Nyaman, Pencahayaan Olahraga Sore/Malam, Tribun Penonton Ringan",
			Capacity:    "Standar Pertandingan",
			OrderIndex:  12,
		},
		{
			Name:        "Perpustakaan & Digital Resource Center",
			Category:    "Sarana Umum & Olahraga",
			Description: "Pusat literasi dengan ribuan koleksi buku teks teknologi, fiksi, jurnal ilmiah, serta workstation akses e-library bagi seluruh civitas akademika.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-perpustakaan.png",
			Features:    "Koleksi Buku TI & Telekomunikasi Lengkap, Katalog & Peminjaman E-Library, Area Membaca Tenang & Ber-AC, Terminal Akses Internet Siswa",
			Capacity:    "E-Library & Literasi",
			OrderIndex:  13,
		},
		{
			Name:        "Ruang Usaha Kesehatan Sekolah (UKS)",
			Category:    "Sarana Umum & Olahraga",
			Description: "Fasilitas pertolongan pertama pada kesehatan siswa dan warga sekolah yang dilengkapi tempat tidur medis dan obat-obatan standar P3K.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-uks.png",
			Features:    "Tempat Tidur Pasien Nyaman, Peralatan & Kotak Obat P3K Standar Medis, Petugas PMR & Pembina UKS, Lingkungan Bersih dan Steril",
			Capacity:    "Pertolongan Pertama",
			OrderIndex:  14,
		},
		{
			Name:        "SMC (Student Media Center)",
			Category:    "Ruang Belajar & RPS",
			Description: "Pusat koordinasi media, podcast sekolah, dokumentasi visual, dan kreasi konten publikasi kegiatan SMK Telkom Sidoarjo.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-smc.png",
			Features:    "Perangkat Studio Audio & Podcast, Kamera & Perlengkapan Sinematografi, Lighting & Backdrop Green Screen, Editing Station",
			Capacity:    "Media Studio",
			OrderIndex:  15,
		},
		{
			Name:        "Gedung Kampus SMK Telkom Sidoarjo",
			Category:    "Sarana Umum & Olahraga",
			Description: "Kompleks bangunan representatif berarsitektur modern di bawah naungan Yayasan Pendidikan Telkom yang asri, aman, dan berlokasi strategis di Sidoarjo.",
			Image:       "/images/tentang-kami/fasilitas/fasilitas-gedung-smk.png",
			Features:    "Keamanan 24 Jam & CCTV Terpadu, Area Parkir Luas & Tertata, Akses Jalan Utama Strategis, Standar K3 & Jalur Evakuasi Kebakaran",
			Capacity:    "Kampus Modern",
			OrderIndex:  16,
		},
	}

	for _, f := range fasilitasList {
		var existing models.Fasilitas
		if err := db.Where("name = ?", f.Name).First(&existing).Error; err == nil {
			db.Model(&existing).Updates(map[string]interface{}{
				"image":       f.Image,
				"category":    f.Category,
				"description": f.Description,
				"features":    f.Features,
				"capacity":    f.Capacity,
				"order_index": f.OrderIndex,
			})
		} else {
			db.Create(&f)
		}
	}
	log.Println("berhasil sinkronisasi 16 sarana fasilitas resmi ke database.")
}

// SeedBKKIfEmpty memasukkan 5 lowongan kerja riil, 9 mitra industri resmi, dan 2 testimoni alumni dari frontend/src/data/bkkData.ts
func SeedBKKIfEmpty(db *gorm.DB) {
	var countPartners int64
	db.Model(&models.BKKPartner{}).Count(&countPartners)
	if countPartners < 35 {
		if countPartners > 0 {
			db.Exec("DELETE FROM bkk_partners")
		}
		partners := []models.BKKPartner{
			// Mitra Utama Hub Industri SMK Telkom Sidoarjo
			{
				Name:        "Politeknik Elektronika Negeri Surabaya (PENS)",
				Category:    "Pendidikan Vokasi & Rekayasa Teknologi",
				Logo:        "/images/partners/pens.webp",
				Description: "Kerjasama strategis program lanjutan studi terapan, sinkronisasi kurikulum rekayasa informatika, dan riset terapan bersama.",
				Website:     "https://www.pens.ac.id",
				OrderIndex:  1,
			},
			{
				Name:        "Axelbit (Accelerate You BIT-by-BIT)",
				Category:    "Networking & Sertifikasi MikroTik",
				Logo:        "/images/partners/partner-axelbit.png",
				Description: "Program pelatihan dan sertifikasi profesional MikroTik, Ubiquiti, serta transfer teknologi jaringan nirkabel enterprise.",
				Website:     "https://axelbit.com",
				OrderIndex:  2,
			},
			{
				Name:        "PT. RADNET DIGITAL INDONESIA (Radnext)",
				Category:    "Internet Service & Data Center",
				Logo:        "/images/partners/partner-radnet.png",
				Description: "Kemitraan penyelenggaraan kelas industri ISP, pembekalan manajemen bandwidth & server, serta sertifikasi komunikasi data.",
				Website:     "https://rad.net.id",
				OrderIndex:  3,
			},
			{
				Name:        "Wowrack Indonesia",
				Category:    "Cloud Computing & Data Center",
				Logo:        "/images/partners/wowrack.png",
				Description: "Pendampingan pembelajaran teknologi cloud computing, virtualisasi server, dan pengelolaan infrastruktur data center modern.",
				Website:     "https://www.wowrack.co.id",
				OrderIndex:  4,
			},
			{
				Name:        "Markaz Design",
				Category:    "UI/UX Design & Kreativitas Digital",
				Logo:        "/images/partners/partner-markazdesign.png",
				Description: "Peningkatan kompetensi perancangan antarmuka pengguna (UI/UX), riset produk digital, dan branding kreatif inovasi siswa.",
				Website:     "https://markazdesign.com",
				OrderIndex:  5,
			},
			{
				Name:        "DigiPrener",
				Category:    "Sistem Informasi & Solusi Digital",
				Logo:        "/images/partners/partner-digiprener.png",
				Description: "Fasilitasi mentoring teknis pengembangan sistem informasi, rancang bangun database enterprise, dan adaptasi alur kerja software industri.",
				Website:     "https://digiprener.com",
				OrderIndex:  6,
			},
			{
				Name:        "PT. Garuda Telekomunikasi Indonesia",
				Category:    "Telekomunikasi & Fiber Optic",
				Logo:        "/images/partners/partner-garuda.png",
				Description: "Kolaborasi strategis dalam pengembangan kompetensi jaringan fiber optik, transmisi broadband, dan penempatan program PKL siswa TJAT.",
				Website:     "https://garudatelekomunikasi.co.id",
				OrderIndex:  7,
			},
			{
				Name:        "Slash (/. SLASH)",
				Category:    "Digital Product Agency & Software Engineering",
				Logo:        "/images/partners/partner-slash-v2.png",
				Description: "Inkubasi proyek web application, mentoring agile development, dan implementasi teknologi front-end/back-end modern industri.",
				Website:     "https://slash.id",
				OrderIndex:  8,
			},
			{
				Name:        "PT. TelkoMedika Indonesia",
				Category:    "Healthcare IT & Telemedicine Services",
				Logo:        "/images/partners/TelkoMedika-v2.png",
				Description: "Integrasi sistem informasi manajemen layanan kesehatan digital, pengelolaan database medis secure, dan implementasi IoT kesehatan.",
				Website:     "https://telkomedika.co.id",
				OrderIndex:  9,
			},
			{
				Name:        "Jagoan Hosting",
				Category:    "Web Cloud & DevOps Architecture",
				Logo:        "/images/partners/partner-jagoanhosting.png",
				Description: "Pembekalan keterampilan deployment web, manajemen server cloud, dan konsep modern DevOps melalui kelas tamu praktisi serta magang intensif.",
				Website:     "https://www.jagoanhosting.com",
				OrderIndex:  10,
			},
			{
				Name:        "Sans Souci Creative Studio",
				Category:    "Creative Media Production & Multimedia",
				Logo:        "/images/partners/partner-sanssouci-v2.png",
				Description: "Pelatihan produksi multimedia digital, motion graphics, video komersial kreatif, dan perancangan strategi visual marketing modern.",
				Website:     "https://instagram.com/sanssouci.creative",
				OrderIndex:  11,
			},
			{
				Name:        "PT Digdaya Olah Teknologi (DOT Indonesia)",
				Category:    "Custom Software & Mobile App Solutions",
				Logo:        "/images/common/icons/DOT.svg",
				Description: "Kolaborasi rekayasa perangkat lunak skala enterprise, pembangunan aplikasi mobile multiplatform, dan program magang intensif siswa SIJA.",
				Website:     "https://dot.co.id",
				OrderIndex:  12,
			},
			{
				Name:        "LSP P1 / Jejaring Vokasi Sidoarjo",
				Category:    "Sertifikasi Profesi & Standarisasi Vokasi",
				Logo:        "/images/partners/bnsp.png",
				Description: "Kemitraan pengujian kompetensi keahlian terstandar BNSP, sinkronisasi skema sertifikasi industri, dan uji kelayakan sertifikasi profesi.",
				Website:     "https://bnsp.go.id",
				OrderIndex:  13,
			},
			{
				Name:        "PT. Saha Global Perkasa (SGP)",
				Category:    "Engineering & IT Infrastructure",
				Logo:        "/images/partners/partner-sgp-v2.png",
				Description: "Dukungan pengadaan perangkat pendukung laboratorium kejuruan, instalasi jaringan pabrik, dan pengenalan rantai pasok industri modern.",
				Website:     "https://sahaglobalperkasa.com",
				OrderIndex:  14,
			},
			{
				Name:        "Jobnation IT Outsource",
				Category:    "IT Talent Sourcing & Outsource",
				Logo:        "/images/partners/jobnation.png",
				Description: "Penyaluran lulusan ke dunia kerja teknologi (BMW - Bekerja), pembekalan rekrutmen profesional, serta talent mapping lulusan terbaik.",
				Website:     "https://jobnation.id",
				OrderIndex:  15,
			},
			{
				Name:        "PT. Indev Solusi Digital (indev)",
				Category:    "Web System & Enterprise Solutions",
				Logo:        "/images/partners/indev.png",
				Description: "Pengembangan sistem informasi Enterprise Resource Planning (ERP), integrasi gateway pembayaran, dan arsitektur database skala besar.",
				Website:     "https://indev.co.id",
				OrderIndex:  16,
			},
			{
				Name:        "PT. Global Infra Teknologi (GIT)",
				Category:    "Infrastruktur IT & Enterprise Network",
				Logo:        "/images/partners/partner-globalinfra.png",
				Description: "Penyediaan akses ke proyek nyata pembangunan infrastruktur jaringan berskala enterprise, mentoring teknisi muda, dan sertifikasi keahlian.",
				Website:     "https://globalinfrateknologi.com",
				OrderIndex:  17,
			},
			{
				Name:        "Weza Group",
				Category:    "Software House & B2B Solutions",
				Logo:        "/images/partners/weza-group.png",
				Description: "Kerjasama pengembangan aplikasi digital dan sistem B2B berbasis proyek nyata (Teaching Factory), serta inkubasi talenta software engineer siswa SIJA.",
				Website:     "https://weza.co.id",
				OrderIndex:  18,
			},
			{
				Name:        "PT. Infratra Telekomunikasi (INFRATRA)",
				Category:    "Infrastruktur Jaringan & Pemeliharaan Fiber",
				Logo:        "/images/partners/partner-infratra-v2.png",
				Description: "Pemeliharaan jaringan kabel fiber optik udara dan tanah, pengukuran redaman sinyal optik, serta pengawasan keselamatan kerja K3 telekomunikasi.",
				Website:     "https://infratra.co.id",
				OrderIndex:  19,
			},
			{
				Name:        "PT. Woodone Integra Tbk",
				Category:    "Smart Manufacturing & Automated Production",
				Logo:        "/images/partners/woodneintegra.png",
				Description: "Penerapan digitalisasi pabrik manufaktur ekspor, otomatisasi sistem industri, dan program pemagangan operasional sistem cerdas.",
				Website:     "https://woodoneintegra.com",
				OrderIndex:  20,
			},
			{
				Name:        "PT. Trijaya Grafika Solutindo (TGS)",
				Category:    "Digital Printing & Creative Packaging",
				Logo:        "/images/partners/trijaya.png",
				Description: "Penerapan teknologi grafika digital presisi tinggi, reproduksi warna komersial, dan perancangan desain packaging produk kreatif inovasi siswa.",
				Website:     "https://trijayagrafika.co.id",
				OrderIndex:  21,
			},
			{
				Name:        "Lasambara Karya Cipta",
				Category:    "Creative Craft & Digital Merchandising",
				Logo:        "/images/partners/lasambora.png",
				Description: "Pengembangan kewirausahaan produk kreatif (Teaching Factory), branding merchandise sekolah, dan inkubasi bisnis rintisan siswa.",
				Website:     "https://lasambara.com",
				OrderIndex:  22,
			},
			{
				Name:        "Purnama Hotel Batu",
				Category:    "Hospitality IT & Smart Hotel Systems",
				Logo:        "/images/partners/partner-purnamahotel-v2.png",
				Description: "Pengelolaan infrastruktur jaringan Wi-Fi perhotelan skala luas, implementasi sistem reservasi digital, dan integrasi IoT fasilitas kamar.",
				Website:     "https://hotelpurnama.com",
				OrderIndex:  23,
			},
			{
				Name:        "RS Islam Surabaya Jemursari (KODI)",
				Category:    "SIMRS & Healthcare Technology",
				Logo:        "/images/partners/rsi.jpg",
				Description: "Pengelolaan server infrastruktur rumah sakit, keamanan data rekam medis digital (cyber security), dan pemeliharaan intranet kesehatan.",
				Website:     "https://rsisurabaya.com",
				OrderIndex:  24,
			},
			{
				Name:        "PT. Efortech (Technology for Solver)",
				Category:    "Industrial IoT & Embedded Systems",
				Logo:        "/images/partners/partner-efortech-v2.png",
				Description: "Riset terapan Internet of Things (IoT), integrasi mikrokontroler sensor industri, dan sistem kendali otomatisasi telemetri cerdas.",
				Website:     "https://efortech.com",
				OrderIndex:  25,
			},
			{
				Name:        "Alfath Corp",
				Category:    "Corporate Business & Digital Services",
				Logo:        "/images/partners/partner-alfath-v2.png",
				Description: "Penyelenggaraan event teknologi korporasi, manajemen kemitraan strategis, dan pembekalan kewirausahaan digital modern bagi siswa.",
				Website:     "https://alfathcorp.com",
				OrderIndex:  26,
			},
			{
				Name:        "UBIG.CO.ID",
				Category:    "Software Development & SaaS Platform",
				Logo:        "/images/partners/ubig.png",
				Description: "Inkubasi produk Software as a Service (SaaS), arsitektur cloud microservices, dan pembinaan startup digital siswa berprestasi.",
				Website:     "https://ubig.co.id",
				OrderIndex:  27,
			},
			{
				Name:        "PT Javacreatiox Network Intermedia",
				Category:    "Software Development & Teaching Factory",
				Logo:        "/images/partners/partner-javacreatiox.png",
				Description: "Kolaborasi pengembangan produk perangkat lunak komersial, mentoring code review standar industri, dan penyaluran kerja lulusan berprestasi.",
				Website:     "https://javacreatiox.com",
				OrderIndex:  28,
			},
			{
				Name:        "Moksha Indonesia (Event Producer)",
				Category:    "Creative Production & Event Technology",
				Logo:        "/images/partners/moksha.png",
				Description: "Pengoperasian teknologi audio-visual digital skala konser/event nasional, live streaming broadcast multi-kamera, dan stage lighting digital.",
				Website:     "https://mokshaindonesia.com",
				OrderIndex:  29,
			},
			{
				Name:        "HAI (Himpunan Ahli Informatika)",
				Category:    "Asosiasi Profesi & Standardisasi IT",
				Logo:        "/images/partners/partner-hai-v2.png",
				Description: "Standardisasi kurikulum kompetensi lulusan IT nasional, seminar keilmuan teknologi terkini, dan pengakuan sertifikasi keahlian profesional.",
				Website:     "https://hai.or.id",
				OrderIndex:  30,
			},
			// Raksasa Telekomunikasi & Infrastruktur Digital Nasional
			{
				Name:        "Telkom Indonesia",
				Category:    "BUMN Telekomunikasi",
				Logo:        "/images/partners/logo-telkom-indonesia.jpg",
				Description: "Mitra strategis utama jaringan telekomunikasi dan infrastruktur digital nasional.",
				Website:     "https://telkom.co.id",
				OrderIndex:  31,
			},
			{
				Name:        "Indosat Ooredoo Hutchison",
				Category:    "Operator Seluler & Jaringan",
				Logo:        "/images/partners/Indosat_Ooredoo_logo.svg",
				Description: "Penyedia layanan telekomunikasi seluler dan jaringan data nirkabel terkemuka.",
				Website:     "https://ioh.co.id",
				OrderIndex:  32,
			},
			{
				Name:        "PT Aplikanusa Lintasarta",
				Category:    "Data Communication & Cloud",
				Logo:        "/images/partners/Logo-Lintasarta.png",
				Description: "Penyedia solusi komunikasi data, internet, dan layanan nilai tambah untuk korporasi.",
				Website:     "https://lintasarta.co.id",
				OrderIndex:  33,
			},
			{
				Name:        "BDX Data Centers",
				Category:    "Data Center & Cloud Infrastructure",
				Logo:        "/images/partners/bdx_data_center.jpg",
				Description: "Penyedia fasilitas pusat data colocation dan cloud hyperscale pan-Asia.",
				Website:     "https://bdxworld.com",
				OrderIndex:  34,
			},
			{
				Name:        "Cisco Systems",
				Category:    "Networking Hardware & Software",
				Logo:        "/images/partners/logo_cisco.png",
				Description: "Pemimpin global dalam teknologi jaringan internet dan sertifikasi Cisco Academy.",
				Website:     "https://cisco.com",
				OrderIndex:  35,
			},
			{
				Name:        "Huawei Technologies",
				Category:    "ICT Infrastructure & Smart Devices",
				Logo:        "/images/partners/logo_huawei.webp",
				Description: "Penyedia infrastruktur teknologi informasi dan komunikasi (TIK) global.",
				Website:     "https://huawei.com",
				OrderIndex:  36,
			},
			{
				Name:        "MikroTik",
				Category:    "Routing & Wireless Systems",
				Logo:        "/images/partners/logo_mikrotik.png",
				Description: "Produsen perangkat keras dan perangkat lunak router untuk manajemen jaringan.",
				Website:     "https://mikrotik.com",
				OrderIndex:  37,
			},
			{
				Name:        "ZTE Corporation",
				Category:    "Telecommunications Equipment",
				Logo:        "/images/partners/logo_zte.webp",
				Description: "Penyedia solusi telekomunikasi terintegrasi dan teknologi nirkabel 5G.",
				Website:     "https://zte.com.cn",
				OrderIndex:  38,
			},
			{
				Name:        "Schneider Electric",
				Category:    "Energy Management & Automation",
				Logo:        "/images/partners/logo_schneider.svg",
				Description: "Spesialis global dalam manajemen energi, otomatisasi industri, dan efisiensi kelistrikan data center.",
				Website:     "https://se.com",
				OrderIndex:  39,
			},
		}
		for _, p := range partners {
			db.Create(&p)
		}
	}

	var countJobs int64
	db.Model(&models.BKKJob{}).Count(&countJobs)
	if countJobs < 5 {
		if countJobs > 0 {
			db.Exec("DELETE FROM bkk_jobs")
		}
		jobs := []models.BKKJob{
			{
				Title:        "Frontend Developer",
				Company:      "PT Telkom Indonesia",
				Location:     "Surabaya",
				JobType:      "Full Time",
				Deadline:     "30 September 2026",
				Salary:       "Kompetitif / Standar Industri",
				Requirements: "Lulusan SMK Telkom Sidoarjo jurusan SIJA atau siswa tingkat akhir siap kerja. Menguasai JavaScript / TypeScript, React atau Next.js, dan Tailwind CSS. Memahami konsep version control Git.",
				Description:  "Mengembangkan dan merawat antarmuka aplikasi web modern menggunakan React, Next.js, dan Tailwind CSS dalam ekosistem digital Telkom Group.",
				CompanyLogo:  "/images/partners/logo-telkom-indonesia.jpg",
				ApplyURL:     "mailto:karir@telkom.co.id",
				Status:       "active",
			},
			{
				Title:        "Network Technician",
				Company:      "PT Indosat Ooredoo Hutchison",
				Location:     "Sidoarjo",
				JobType:      "Internship",
				Deadline:     "25 September 2026",
				Salary:       "Uang Saku & Transport",
				Requirements: "Siswa aktif atau lulusan jurusan TJAT SMK Telkom Sidoarjo. Memahami dasar transmisi jaringan nirkabel dan fiber optik. Memiliki ketelitian tinggi dan kemampuan komunikasi kerja lapangan yang baik.",
				Description:  "Mendukung operasional instalasi, monitoring jalur transmisi fiber optic, dan pemeliharaan infrastruktur jaringan BTS area Sidoarjo.",
				CompanyLogo:  "/images/partners/Indosat_Ooredoo_logo.svg",
				ApplyURL:     "mailto:recruitment@ioh.co.id",
				Status:       "active",
			},
			{
				Title:        "IT Support",
				Company:      "PT Aplikanusa Lintasarta",
				Location:     "Surabaya",
				JobType:      "Full Time",
				Deadline:     "28 September 2026",
				Salary:       "Kompetitif / Standar Industri",
				Requirements: "Lulusan SMK Telkom Sidoarjo jurusan SIJA atau TJAT. Memiliki pemahaman troubleshooting hardware, Windows/Linux, dan routing dasar. Sertifikasi Mikrotik (MTCNA) atau Cisco (CCNA) menjadi nilai tambah.",
				Description:  "Memberikan dukungan teknis perangkat keras, sistem operasi, konfigurasi jaringan lokal (LAN/WLAN), dan troubleshooting aplikasi kantor mitra.",
				CompanyLogo:  "/images/partners/Logo-Lintasarta.png",
				ApplyURL:     "mailto:career@lintasarta.co.id",
				Status:       "active",
			},
			{
				Title:        "Data Center Infrastructure Specialist",
				Company:      "BDX Data Centers",
				Location:     "Surabaya",
				JobType:      "Full Time",
				Deadline:     "24 September 2026",
				Salary:       "Kompetitif",
				Requirements: "Lulusan SIJA atau TJAT dengan pemahaman kelistrikan IT, server rack, dan fiber optik. Disiplin, teliti, dan siap bekerja sesuai SOP industri data center global.",
				Description:  "Mengelola fasilitas data center, server virtualisasi, dan pemantauan sistem catu daya serta jaringan berkecepatan tinggi.",
				CompanyLogo:  "/images/partners/bdx_data_center.jpg",
				ApplyURL:     "mailto:careers@bdxworld.com",
				Status:       "active",
			},
			{
				Title:        "Junior Network Engineer",
				Company:      "Cisco Systems",
				Location:     "Surabaya",
				JobType:      "Internship",
				Deadline:     "20 September 2026",
				Salary:       "Uang Saku & Pembinaan",
				Requirements: "Siswa aktif atau lulusan jurusan TJAT SMK Telkom Sidoarjo. Menguasai dasar Cisco Networking Academy (CCNA modules). Memiliki motivasi tinggi untuk bertumbuh di bidang network engineering.",
				Description:  "Mendukung implementasi switching & routing enterprise Cisco, konfigurasi VLAN, dan pengujian throughput jaringan mitra.",
				CompanyLogo:  "/images/partners/logo_cisco.png",
				ApplyURL:     "mailto:recruitment-id@cisco.com",
				Status:       "active",
			},
		}
		for _, j := range jobs {
			db.Create(&j)
		}
	}

	var countAlumni int64
	db.Model(&models.BKKAlumni{}).Count(&countAlumni)
	if countAlumni < 2 {
		if countAlumni > 0 {
			db.Exec("DELETE FROM bkk_alumnis")
		}
		alumni := []models.BKKAlumni{
			{
				Name:      "Olvan",
				GradYear:  "2024",
				Company:   "PT Telkom Indonesia",
				Role:      "IT Support Engineer",
				Quote:     "Ilmu dan pengalaman di SKOMDA membantu saya lebih percaya diri saat memasuki dunia kerja industri teknologi informasi.",
				Photo:     "/images/home/hero/image1.png",
			},
			{
				Name:      "Quinnsachi",
				GradYear:  "2023",
				Company:   "PT Radnet Digital Indonesia",
				Role:      "Cloud DevOps Associate",
				Quote:     "Kurikulum 4 tahun SIJA memberikan kedalaman ilmu coding dan cloud computing yang langsung relevan dengan standar kerja profesional.",
				Photo:     "/images/home/hero/image4.png",
			},
		}
		for _, a := range alumni {
			db.Create(&a)
		}
	}

	log.Println("berhasil seed 5 lowongan kerja riil, 9 mitra industri resmi, dan 2 kisah alumni ke database.")
}

// SeedDocumentsIfEmpty memasukkan 6 dokumen unduhan publik dan 35 dokumen K3 resmi (total 41 dokumen)
func SeedDocumentsIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&models.Document{}).Count(&count)
	if count >= 41 {
		return
	}
	if count > 0 {
		db.Exec("DELETE FROM documents")
	}

	docs := []models.Document{
		// 6 Dokumen Pusat Unduhan Publik (from DOWNLOAD_DOCUMENTS)
		{
			Title:       "Brosur PPDB SMK Telkom Sidoarjo 2026/2027",
			Category:    "Unduh Informasi",
			FileURL:     "/documents/brosur-ppdb-smk-telkom-sidoarjo-2026-2027.pdf",
			FileSize:    "8.0 MB",
			FileType:    "PDF",
			Description: "Informasi lengkap alur Penerimaan Peserta Didik Baru (PPDB), profil keahlian SIJA & TJAT, beasiswa, rincian biaya pendidikan, serta fasilitas unggulan.",
			IsPublic:    true,
			OrderIndex:  1,
		},
		{
			Title:       "Sertifikat Akreditasi 'A' SMK Telkom Sidoarjo",
			Category:    "Unduh Informasi",
			FileURL:     "/documents/sertifikat-akreditasi-a-smk-telkom-sidoarjo.pdf",
			FileSize:    "1.8 MB",
			FileType:    "PDF",
			Description: "Sertifikat resmi Akreditasi 'A' Unggul dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-SM) Nomor: 1336/BAN-SM/SK/2021 dengan nilai memuaskan.",
			IsPublic:    true,
			OrderIndex:  2,
		},
		{
			Title:       "Sertifikat ISO 21001:2018 SMK Telkom Sidoarjo",
			Category:    "Unduh Informasi",
			FileURL:     "/documents/sertifikat-iso-21001-smk-telkom-sidoarjo.pdf",
			FileSize:    "480 KB",
			FileType:    "PDF",
			Description: "Standar Internasional Sistem Manajemen Organisasi Pendidikan (EOMS) untuk penjaminan mutu tata kelola pendidikan dan pembelajaran vokasi modern.",
			IsPublic:    true,
			OrderIndex:  3,
		},
		{
			Title:       "PERSEKJENMENRISTEK RI No. 17 Tahun 2022",
			Category:    "Unduh Informasi",
			FileURL:     "/documents/persekjenmenristek-no-17-tahun-2022.pdf",
			FileSize:    "326 KB",
			FileType:    "PDF",
			Description: "Petunjuk Teknis Pencegahan dan Penanganan Kekerasan Seksual di Satuan Pendidikan sebagai komitmen lingkungan belajar aman dan inklusif.",
			IsPublic:    true,
			OrderIndex:  4,
		},
		{
			Title:       "PERMENDIKBUDRISTEK RI No. 30 Tahun 2021",
			Category:    "Unduh Informasi",
			FileURL:     "/documents/permendikbudristek-no-30-tahun-2021.pdf",
			FileSize:    "171 KB",
			FileType:    "PDF",
			Description: "Salinan Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi tentang Pencegahan dan Penanganan Kekerasan Seksual.",
			IsPublic:    true,
			OrderIndex:  5,
		},
		{
			Title:       "PERMENDIKBUD RI No. 82 Tahun 2015",
			Category:    "Unduh Informasi",
			FileURL:     "/documents/permendikbud-no-82-tahun-2015.pdf",
			FileSize:    "110 KB",
			FileType:    "PDF",
			Description: "Peraturan Menteri Pendidikan dan Kebudayaan RI tentang Pencegahan dan Penanggulangan Tindak Kekerasan di Lingkungan Satuan Pendidikan.",
			IsPublic:    true,
			OrderIndex:  6,
		},

		// 35 Dokumen K3 Resmi (from K3_DOCUMENTS)
		{
			Title:       "Buku Panduan & Materi Penerapan K3 di Lingkungan SMK Telkom Sidoarjo",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1gmIY-kPi5WkybWpxWn8tHeV4wIVIjWok/view?usp=sharing",
			FileSize:    "3.9 MB",
			FileType:    "PDF",
			Description: "Pedoman komprehensif keselamatan kerja seluruh civitas akademika SMK Telkom Sidoarjo.",
			IsPublic:    true,
			OrderIndex:  7,
		},
		{
			Title:       "Daftar Bukti Fisik (Evidence) & Implementasi K3 SMK Telkom Sidoarjo",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1Le3pmlYwjKNKtiUxD61Drz8EnjNsrnXW/view?usp=sharing",
			FileSize:    "381.0 KB",
			FileType:    "PDF",
			Description: "Dokumentasi pemenuhan instrumen audit internal dan sertifikasi K3.",
			IsPublic:    true,
			OrderIndex:  8,
		},
		{
			Title:       "ISO 7010:2019: Simbol Grafis, Warna, dan Rambu Keselamatan Internasional",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1y_ptO4_ItWzg5g7dSLxuxpuzGCTgfYr8/view?usp=sharing",
			FileSize:    "3.0 MB",
			FileType:    "PDF",
			Description: "Standar visual internasional untuk rambu evakuasi, bahaya, dan alat keselamatan.",
			IsPublic:    true,
			OrderIndex:  9,
		},
		{
			Title:       "Denah & Peta Jalur Evakuasi Kampus SMK Telkom Sidoarjo (Lantai 1)",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1pm2IGZU8D9x9QIH4rt_PiMOMistIx_Ko/view?usp=sharing",
			FileSize:    "1.1 MB",
			FileType:    "PDF",
			Description: "Peta rute penyelamatan darurat lantai 1 menuju titik kumpul utama (Assembly Point).",
			IsPublic:    true,
			OrderIndex:  10,
		},
		{
			Title:       "Denah & Peta Jalur Evakuasi Gedung Pembelajaran (Lantai 2)",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1CeysL6pLRTqauHc8R4osu2LUkvhDSG2M/view?usp=sharing",
			FileSize:    "1.1 MB",
			FileType:    "PDF",
			Description: "Peta rute tangga darurat lantai 2 menuju zona evakuasi terbuka.",
			IsPublic:    true,
			OrderIndex:  11,
		},
		{
			Title:       "Permen PUPR No. 14/PRT/M/2017: Persyaratan Kemudahan Bangunan Gedung",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1nFGaT__liG0iMiM-80wyo1hOFJHU98WP/view?usp=sharing",
			FileSize:    "256.8 KB",
			FileType:    "PDF",
			Description: "Regulasi aksesibilitas dan keselamatan fasilitas fisik gedung institusi.",
			IsPublic:    true,
			OrderIndex:  12,
		},
		{
			Title:       "Permenaker No. PER.04/MEN/1980: Syarat Pemasangan & Pemeliharaan APAR",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/12h5hBDuDhvVhzZapRZziJmy4H-z8IyWc/view?usp=sharing",
			FileSize:    "212.4 KB",
			FileType:    "PDF",
			Description: "Ketentuan inspeksi tabung pemadam api ringan di area sekolah.",
			IsPublic:    true,
			OrderIndex:  13,
		},
		{
			Title:       "Daftar Distribusi dan Titik Penempatan Kotak P3K SMK Telkom Sidoarjo",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1bRbnvGailturtIrD2DHweDJptVSB7X3o/view?usp=sharing",
			FileSize:    "188.7 KB",
			FileType:    "PDF",
			Description: "Matriks sebaran kotak pertolongan pertama pada tiap laboratorium dan lorong kelas.",
			IsPublic:    true,
			OrderIndex:  14,
		},
		{
			Title:       "Formulir Tindakan Perbaikan & Pencegahan (CAPA) Audit Internal SMK3",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1FDysRhplNG7w2uC3baIpJID4zr8k1Drg/view?usp=sharing",
			FileSize:    "209.9 KB",
			FileType:    "PDF",
			Description: "Lembar evaluasi perbaikan temuan potensi risiko di ruang praktikum.",
			IsPublic:    true,
			OrderIndex:  15,
		},
		{
			Title:       "SNI 03-1746-2000: Perencanaan Sarana Jalan ke Luar Evakuasi Kebakaran Gedung",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1lRJZS35TZNU2i35luBbIQHGxhEYhL3T6/view?usp=sharing",
			FileSize:    "562.5 KB",
			FileType:    "PDF",
			Description: "Standar teknis pintu darurat, koridor evakuasi, dan penerangan darurat.",
			IsPublic:    true,
			OrderIndex:  16,
		},
		{
			Title:       "PP No. 45 Tahun 2023: Keselamatan Radiasi Pengion & Keamanan Zat Radioaktif",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/14CWuuEAsnbE5ik3HPIz8JWBVi1-uz_Nq/view?usp=sharing",
			FileSize:    "6.5 MB",
			FileType:    "PDF",
			Description: "Regulasi nasional proteksi lingkungan kerja laboratorium.",
			IsPublic:    true,
			OrderIndex:  17,
		},
		{
			Title:       "Permen PU No. 26/PRT/M/2008: Persyaratan Teknis Sistem Proteksi Kebakaran Gedung",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1CiYKSbWvq45Km-tc5y4zkDK0C0EogQ6a/view?usp=sharing",
			FileSize:    "6.8 MB",
			FileType:    "PDF",
			Description: "Pedoman kelayakan sprinkler, hidran, detektor asap, dan sistem tanggap api.",
			IsPublic:    true,
			OrderIndex:  18,
		},
		{
			Title:       "Permenaker No. PER.02/MEN/1983: Instalasi Alarm Kebakaran Otomatik",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1hVe7_xgIJqej0gUE6z2HSJhIBixKeBHw/view?usp=sharing",
			FileSize:    "172.9 KB",
			FileType:    "PDF",
			Description: "Standar instalasi dan pengujian berkala panel sirene kebakaran terpusat.",
			IsPublic:    true,
			OrderIndex:  19,
		},
		{
			Title:       "Permenakertrans No. PER.15/MEN/VIII/2008: P3K di Tempat Kerja",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1wIdUE8g8ySTg8vMSF9oV2Mg1c4BFXSay/view?usp=sharing",
			FileSize:    "131.0 KB",
			FileType:    "PDF",
			Description: "Regulasi jumlah dan kelengkapan obat P3K per rasio penghuni gedung.",
			IsPublic:    true,
			OrderIndex:  20,
		},
		{
			Title:       "Permenkes No. 48 Tahun 2016: Standar Keselamatan & Kesehatan Kerja Perkantoran",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/162XsqxnfgnBFaW6-ZnKY_9-34ZHCXUyq/view?usp=sharing",
			FileSize:    "1.7 MB",
			FileType:    "PDF",
			Description: "Standar ergonomi meja komputer, pencahayaan ruang kelas, dan sirkulasi udara.",
			IsPublic:    true,
			OrderIndex:  21,
		},
		{
			Title:       "SOP Keselamatan Kerja Laboratorium & Pengelolaan Bahan Berbahaya (MSDS)",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1BHVtFjgjmPMbs6gMbMswyXBqW1AeYjp_/view?usp=sharing",
			FileSize:    "174.7 KB",
			FileType:    "PDF",
			Description: "Instruksi kerja penanganan zat kimia pembersih dan limbah serat fiber optik.",
			IsPublic:    true,
			OrderIndex:  22,
		},
		{
			Title:       "SOP Struktur Organisasi & Pelaksanaan Program Kerja P2K3 Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1OMlNRtOZuyQmKKkIIsom5-V6y9VCCcf-/view?usp=sharing",
			FileSize:    "97.4 KB",
			FileType:    "PDF",
			Description: "Bagan kerja tim keselamatan sekolah bersama koordinator K3 tiap lantai.",
			IsPublic:    true,
			OrderIndex:  23,
		},
		{
			Title:       "SOP Pertolongan Pertama Pada Kecelakaan (P3K) Siswa & Warga Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1j3eX8uRCexFDeE41CbF4jA2ACRa5htwu/view?usp=sharing",
			FileSize:    "420.9 KB",
			FileType:    "PDF",
			Description: "Alur respons medis darurat dan rujukan ke fasilitas kesehatan terdekat.",
			IsPublic:    true,
			OrderIndex:  24,
		},
		{
			Title:       "SOP Pelaporan Kondisi Berbahaya (Unsafe Condition) Tiap Unit Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1RpOgwF_HIa48ZWIM7QJfrEesG-k-ZOoC/view?usp=sharing",
			FileSize:    "98.4 KB",
			FileType:    "PDF",
			Description: "Mekanisme pengaduan kerusakan kabel listrik, lantai licin, dan risiko fisik.",
			IsPublic:    true,
			OrderIndex:  25,
		},
		{
			Title:       "SOP Pemantauan dan Pengukuran Faktor Fisik Lingkungan Tempat Kerja",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1v0ZC0A1OtSj-NDvx-M-tWW_13t-9BpJb/view?usp=sharing",
			FileSize:    "101.4 KB",
			FileType:    "PDF",
			Description: "Protokol pengukuran intensitas cahaya (lux meter) dan tingkat kebisingan.",
			IsPublic:    true,
			OrderIndex:  26,
		},
		{
			Title:       "SOP Pemeliharaan, Perbaikan, dan Pengujian Sarana Kerja Berisiko",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1GUeE2cqAcHjbi-dLons3NFsX3AvBwzO2/view?usp=sharing",
			FileSize:    "363.4 KB",
			FileType:    "PDF",
			Description: "Jadwal preventive maintenance genset, gardu listrik, dan AC sentral.",
			IsPublic:    true,
			OrderIndex:  27,
		},
		{
			Title:       "SOP Penerimaan Tamu & Mitra Kerja Terkait Ketentuan K3L Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1cNMMuK9gSTlB6KSRIEPrjxoa5xWz7dqo/view?usp=sharing",
			FileSize:    "102.1 KB",
			FileType:    "PDF",
			Description: "Safety briefing wajib bagi vendor, tamu industri, dan kontraktor bangunan.",
			IsPublic:    true,
			OrderIndex:  28,
		},
		{
			Title:       "SOP Kesiapsiagaan dan Tanggap Darurat Bencana Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1f9ImiJ-75c2t40AOFfB8g1ENP31F6ngn/view?usp=sharing",
			FileSize:    "168.0 KB",
			FileType:    "PDF",
			Description: "Prosedur simulasi darurat gempa bumi, banjir, dan kebakaran berkala.",
			IsPublic:    true,
			OrderIndex:  29,
		},
		{
			Title:       "SOP Rapat Tinjauan Manajemen & Evaluasi Berkala Penerapan SMK3",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1LRMK9zZlRHK5hPXisph_jnEWfKkn7vhV/view?usp=sharing",
			FileSize:    "279.1 KB",
			FileType:    "PDF",
			Description: "Rapat triwulanan manajemen pimpinan untuk peningkatan berkesinambungan.",
			IsPublic:    true,
			OrderIndex:  30,
		},
		{
			Title:       "Formulir Monitoring & Pemeriksaan Kelayakan Alat Pelindung Diri (APD)",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1qBS07fYUk84BcY_vqYNVY-JBYI6WEpNX/view?usp=sharing",
			FileSize:    "180.4 KB",
			FileType:    "PDF",
			Description: "Form cek berkala kacamata las/splicing, helm proyek, dan sarung tangan isolasi.",
			IsPublic:    true,
			OrderIndex:  31,
		},
		{
			Title:       "Checklist Pemeriksaan & Audit Internal Sistem Manajemen K3 (SMK3)",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1Ee2CobaU4403XJnEmmLBqq3AoGvPf3rW/view?usp=sharing",
			FileSize:    "178.3 KB",
			FileType:    "PDF",
			Description: "Daftar uji kesiapan audit eksternal standar PP 50/2012 dan ISO 45001.",
			IsPublic:    true,
			OrderIndex:  32,
		},
		{
			Title:       "Daftar Induk Catatan, Rekaman Mutu, dan Pengendalian Arsip SMK3",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1h-_a8H_TgCgTzXTLQCykRV6IH9xzcWRg/view?usp=sharing",
			FileSize:    "174.7 KB",
			FileType:    "PDF",
			Description: "Registrasi dokumen resmi dan nomor pengesahan standar keselamatan sekolah.",
			IsPublic:    true,
			OrderIndex:  33,
		},
		{
			Title:       "Matriks Evaluasi Kepatuhan Peraturan Perundangan K3L Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1tsFPd-qGCR-WlYxOtGl4IwfnSOUuapDD/view?usp=sharing",
			FileSize:    "175.5 KB",
			FileType:    "PDF",
			Description: "Pemetaan kesesuaian fasilitas dengan undang-undang ketenagakerjaan dan pendidikan.",
			IsPublic:    true,
			OrderIndex:  34,
		},
		{
			Title:       "Formulir Penilaian Tingkat Penerapan K3 Fasilitas & Gedung Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/147X_kupJeNA0c_4n9l8Wn4T9tq9m3qyL/view?usp=sharing",
			FileSize:    "270.1 KB",
			FileType:    "PDF",
			Description: "Skor audit kepatuhan tiap bengkel praktikum dan unit usaha sekolah.",
			IsPublic:    true,
			OrderIndex:  35,
		},
		{
			Title:       "Laporan Ketidaksesuaian & Monitoring Tindakan Korektif K3",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1u7E2ztMPsa3Ph6IOchGQVlxNHyto13KP/view?usp=sharing",
			FileSize:    "245.3 KB",
			FileType:    "PDF",
			Description: "Pencatatan temuan inspeksi beserta tenggat waktu penyelesaian perbaikan.",
			IsPublic:    true,
			OrderIndex:  36,
		},
		{
			Title:       "Formulir Pemusnahan & Perpanjangan Masa Retensi Arsip SMK3",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1SqkRxR790q7Az3rW93N8OZB-hGiAzBsm/view?usp=sharing",
			FileSize:    "19.1 KB",
			FileType:    "PDF",
			Description: "Tata kelola masa simpan logbook keselamatan sesuai hukum yang berlaku.",
			IsPublic:    true,
			OrderIndex:  37,
		},
		{
			Title:       "Formulir Penerimaan Dokumen & Distribusi Rekaman K3L Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1Wz3YrLcpB5DKItp2gXCsHzlZ1Yt5fhMS/view?usp=sharing",
			FileSize:    "160.6 KB",
			FileType:    "PDF",
			Description: "Ekspedisi penyerahan salinan terkendali prosedur operasional baku.",
			IsPublic:    true,
			OrderIndex:  38,
		},
		{
			Title:       "Surat Izin Kerja Berisiko Khusus: Pekerjaan Panas (Hot Work Permit)",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1LwERJthosoZ1OmF1i7Q8pMHGQU8bRRWq/view?usp=sharing",
			FileSize:    "214.0 KB",
			FileType:    "PDF",
			Description: "Izin resmi sebelum pekerjaan pengelasan, pemotongan besi, atau api terbuka.",
			IsPublic:    true,
			OrderIndex:  39,
		},
		{
			Title:       "Instruksi Kerja (IK) Pemanfaatan Fitur Informasi & Safety Guide K3",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1Lczp-jMNny1u8i52MWDo3YaR9gL9WMNe/view?usp=sharing",
			FileSize:    "246.3 KB",
			FileType:    "PDF",
			Description: "Panduan operasional keselamatan bagi siswa baru dan pengguna laboratorium komputer.",
			IsPublic:    true,
			OrderIndex:  40,
		},
		{
			Title:       "Formulir Rekapitulasi & Pelaporan Insiden Layanan K3L Sekolah",
			Category:    "Dokumen K3",
			FileURL:     "https://drive.google.com/file/d/1ERcxQoijTJZNqHpYVR7vSjdbkagWWwh1/view?usp=sharing",
			FileSize:    "224.0 KB",
			FileType:    "PDF",
			Description: "Format rekap insiden near-miss, cedera ringan, atau kerusakan fasilitas bulanan.",
			IsPublic:    true,
			OrderIndex:  41,
		},
	}

	for _, d := range docs {
		db.Create(&d)
	}
	log.Println("berhasil seed 41 dokumen resmi (6 unduh informasi + 35 K3) ke database.")
}

// SeedSiteSettingsIfEmpty memasukkan pengaturan default situs.
func SeedSiteSettingsIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&models.SiteSetting{}).Count(&count)
	if count > 0 {
		return
	}

	settings := []models.SiteSetting{
		{
			Key:         "contact_phone",
			Value:       "0811-3021-919",
			Category:    "contact",
			Description: "Nomor WhatsApp Humas resmi sekolah",
		},
		{
			Key:         "contact_email",
			Value:       "info@smktelkom-sda.sch.id",
			Category:    "contact",
			Description: "Alamat email resmi korespondensi",
		},
		{
			Key:         "school_address",
			Value:       "Jl. Raya Pecantingan, Sekardangan, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61215",
			Category:    "contact",
			Description: "Alamat fisik kampus SMK Telkom Sidoarjo",
		},
		{
			Key:         "ppdb_status",
			Value:       "Buka - Gelombang 1",
			Category:    "ppdb",
			Description: "Status penerimaan peserta didik baru berjalan",
		},
		{
			Key:         "ppdb_active_brochure_id",
			Value:       "1",
			Category:    "ppdb",
			Description: "ID Dokumen brosur PPDB resmi yang aktif tampil di website",
		},
		{
			Key:         "announcement_banner_enabled",
			Value:       "false",
			Category:    "announcement",
			Description: "Tampilkan banner pengumuman darurat di atas navbar (true/false)",
		},
		{
			Key:         "announcement_banner_text",
			Value:       "Pendaftaran PPDB 2026/2027 Gelombang Khusus Telah Dibuka! Dapatkan potongan DPP hingga 50%.",
			Category:    "announcement",
			Description: "Teks banner pengumuman darurat",
		},
	}

	for _, s := range settings {
		db.Create(&s)
	}
	log.Println("berhasil seed data awal pengaturan dinamis situs.")
}

// SeedDtpIfEmpty menginisialisasi 9 spesialisasi Digital Talent Program (DTP) jika tabel masih kosong
func SeedDtpIfEmpty(db *gorm.DB) {
	var count int64
	db.Model(&models.DigitalTalent{}).Count(&count)
	if count > 0 {
		return
	}

	dtpItems := []models.DigitalTalent{
		{
			Slug:             "software-developer",
			Number:           "01",
			Title:            "Software Developer",
			Category:         "Software & AI",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-1.png",
			ShortDesc:        "Pembuatan website dan aplikasi modern mulai dari perancangan basis data, arsitektur REST API, hingga deployment berbasis container.",
			FullDesc:         "Mempelajari cara membuat website dan aplikasi mulai dari merancang database, menulis kode program, menghubungkan data melalui API, hingga mempublikasikan aplikasi agar dapat digunakan oleh pengguna dengan standar industri.",
			CoreSkills:       "Algoritma Pemrograman, HTML, CSS, JavaScript Modern, PHP & Framework Laravel, Perancangan & Optimasi Database, RESTful API Development, Version Control (Git & GitHub), Containerization dengan Docker, Linux Server Environment, Web Application Deployment",
			SupportingSkills: "UI/UX Fundamental & Wireframing, Git Collaboration Workflow, AI Coding Assistant Mastery, Agile & Scrum Development, Software Testing & Quality Assurance",
			CareerProspects:  "Software Developer, Backend Developer, Frontend Developer, Full Stack Developer, Junior Web Engineer",
			Tools:            "VS Code, GitHub, Laravel, MySQL, Postman, Docker, Linux, Figma",
			BadgeText:        "Full Stack Track",
			OrderIndex:       1,
			IsActive:         true,
		},
		{
			Slug:             "network-sysadmin",
			Number:           "02",
			Title:            "Network System Administrator",
			Category:         "Network & Cloud",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-2.png",
			ShortDesc:        "Pengelolaan server fisik maupun virtual agar aman, stabil, serta siap mendukung layanan operasional skala enterprise.",
			FullDesc:         "Mempelajari cara mengelola server agar dapat digunakan bersama, aman, stabil, serta mendukung berbagai layanan di lingkungan sekolah maupun perusahaan dengan keandalan tinggi.",
			CoreSkills:       "Linux Server Administration, Windows Server & Active Directory, Virtualization Technology, DNS & DHCP Core Services, Web & Database Server Hosting, SSH & Remote Management, Server Automation Scripting, Backup & Disaster Recovery, Server Performance Monitoring",
			SupportingSkills: "IT Infrastructure Support, Problem Solving & Troubleshooting, Network Hardware Maintenance, Storage Area Network (SAN), Enterprise Helpdesk Support",
			CareerProspects:  "System Administrator, Server Administrator, Linux Administrator, IT Operations Specialist, Enterprise Support Specialist",
			Tools:            "Ubuntu Server, Rocky Linux, Windows Server, Proxmox, VMware, Zabbix, Bash, PowerShell",
			BadgeText:        "Enterprise Ops",
			OrderIndex:       2,
			IsActive:         true,
		},
		{
			Slug:             "network-infrastructure",
			Number:           "03",
			Title:            "Network Infrastructure Engineer",
			Category:         "Network & Cloud",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-lab-fiber-optik.png",
			ShortDesc:        "Perancangan dan pemeliharaan jalur data, routing jaringan skala besar, switching cerdas, dan infrastruktur kabel fiber optik.",
			FullDesc:         "Mempelajari teknik merancang topologi, mengonfigurasi router dan switch berstandar Cisco dan Mikrotik, hingga instalasi jaringan fiber optik andal.",
			CoreSkills:       "VLAN & Trunking Configuration, Routing Protocols (OSPF & BGP), Fiber Optic Splicing & Testing, Wireless LAN Enterprise, Mikrotik RouterOS Advanced, Cisco IOS CLI Configuration, Network Troubleshooting & Analysis, Bandwidth Management & QoS",
			SupportingSkills: "Cabling Standard TIA/EIA, Network Documentation & Topology Design, Field Work Ethics, OTDR Testing Analysis",
			CareerProspects:  "Network Engineer, Network Administrator, Fiber Optic Technician, ISP Support Specialist, Field Engineer",
			Tools:            "Mikrotik RouterBoard, Cisco Catalyst, Wireshark, Fusion Splicer, OTDR, Packet Tracer, Winbox",
			BadgeText:        "Cisco & Mikrotik",
			OrderIndex:       3,
			IsActive:         true,
		},
		{
			Slug:             "visual-communication-design",
			Number:           "04",
			Title:            "Visual Communication Designer",
			Category:         "Design & Creative",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-studio-multimedia.png",
			ShortDesc:        "Kreasi identitas visual, UI/UX antarmuka digital, ilustrasi profesional, serta konten promosi digital berdaya tarik tinggi.",
			FullDesc:         "Mempelajari cara menciptakan bahasa visual yang komunikatif dan estetis melalui desain grafis vektor, tipografi, user interface mobile/web, dan branding.",
			CoreSkills:       "Desain UI/UX & Wireframing, Tipografi & Teori Warna, Desain Grafis Vektor, Motion Graphics Fundamental, Digital Photo Retouching, Brand Identity Guidelines, Layouting Majalah & Poster, Asset Exporting Berstandar Web/Mobile",
			SupportingSkills: "Creative Storytelling, Creative Pitching & Presentation, Design System Architecture, Micro-Interactions",
			CareerProspects:  "UI/UX Designer, Graphic Designer, Visual Designer, Brand Identity Specialist, Creative Content Creator",
			Tools:            "Figma, Adobe Illustrator, Adobe Photoshop, After Effects, Canva Pro",
			BadgeText:        "Creative Lab",
			OrderIndex:       4,
			IsActive:         true,
		},
		{
			Slug:             "iot-engineer",
			Number:           "05",
			Title:            "IoT & Embedded System Engineer",
			Category:         "Hardware & Security",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-ruang-tefa.png",
			ShortDesc:        "Integrasi mikrokontroler, sensor cerdas, protokol nirkabel, dan otomatisasi perangkat keras berbasis cloud internet of things.",
			FullDesc:         "Mempelajari cara menghubungkan dunia fisik ke dunia digital dengan memprogram sensor, aktuator, modul komunikasi LoRa/WiFi, dan dashboard kontrol.",
			CoreSkills:       "Pemrograman C/C++ Mikrokontroler, Sensor & Actuator Interfacing, Protokol IoT (MQTT, HTTP, WebSockets), Skematik & PCB Design, ESP32 & Arduino Eco-System, Integrasi IoT Cloud Platform, Telemetri Real-Time Dashboard",
			SupportingSkills: "Elektronika Dasar & Pengukuran Multimeter, Soldering Presisi, 3D Printing Prototyping, Low Power Optimization",
			CareerProspects:  "IoT Engineer, Embedded System Developer, Hardware Specialist, Automation Engineer, Smart Device Technician",
			Tools:            "ESP32, Arduino IDE, PlatformIO, MQTT Broker, Node-RED, KiCAD, Fusion 360",
			BadgeText:        "Hardware Track",
			OrderIndex:       5,
			IsActive:         true,
		},
		{
			Slug:             "cloud-engineer",
			Number:           "06",
			Title:            "Cloud Engineer",
			Category:         "Network & Cloud",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-datacenter.png",
			ShortDesc:        "Arsitektur komputasi awan andal, otomatisasi infrastruktur CI/CD, manajemen kontainer Kubernetes, dan layanan cloud AWS / GCP.",
			FullDesc:         "Mempelajari cara membangun dan mengelola infrastruktur modern di cloud publik, orkestrasi kontainer dengan Kubernetes, dan pipeline continuous integration.",
			CoreSkills:       "Cloud Computing Architecture, Container Orchestration (Kubernetes), Infrastructure as Code (Terraform), CI/CD Pipeline Automation, Cloud Networking & VPC, Cloud Storage & Database Services, Auto-scaling & High Availability",
			SupportingSkills: "FinOps & Cloud Cost Optimization, Microservices Architecture, Observability & Monitoring",
			CareerProspects:  "Cloud Engineer, DevOps Engineer, Site Reliability Engineer (SRE), Platform Engineer, Cloud Infrastructure Architect",
			Tools:            "Google Cloud Platform, AWS, Kubernetes, Docker, Terraform, GitHub Actions, Helm",
			BadgeText:        "GCP & AWS",
			OrderIndex:       6,
			IsActive:         true,
		},
		{
			Slug:             "ai-specialist",
			Number:           "07",
			Title:            "AI & Data Specialist",
			Category:         "Software & AI",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-3.png",
			ShortDesc:        "Pengolahan data skala besar, visualisasi analitik, integrasi Machine Learning, serta implementasi agen cerdas berbasis Generative AI.",
			FullDesc:         "Mempelajari cara mengeksplorasi data, melatih model prediktif dasar, memanfaatkan LLM API modern, dan membangun otomasi bertenaga AI.",
			CoreSkills:       "Python for Data & AI, Data Cleaning & Preprocessing, Exploratory Data Analysis (EDA), Machine Learning Algorithms, LLM & Prompt Engineering, Vector Database & RAG, Data Visualization Interactive",
			SupportingSkills: "Statistika Terapan, Model Evaluation Metrics, Data Ethics, AI API Integration",
			CareerProspects:  "AI Engineer, Data Analyst, Machine Learning Junior, Prompt Engineer, BI Analyst",
			Tools:            "Python, Jupyter Notebook, Pandas, NumPy, Scikit-Learn, Gemini API, HuggingFace, Streamlit",
			BadgeText:        "Next-Gen AI",
			OrderIndex:       7,
			IsActive:         true,
		},
		{
			Slug:             "digital-marketing",
			Number:           "08",
			Title:            "Digital Marketer",
			Category:         "Design & Creative",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-gedung-smk.png",
			ShortDesc:        "Strategi akuisisi audiens daring, Search Engine Optimization (SEO), iklan berbayar (Meta & Google Ads), serta analitik konversi.",
			FullDesc:         "Mempelajari cara memasarkan produk teknologi dan jasa secara digital melalui riset audiens, copywriting persuasif, SEO on-page, dan optimasi kampanye berbayar.",
			CoreSkills:       "Search Engine Optimization (SEO), Content Strategy & Copywriting, Social Media Advertising (Meta Ads), Google Ads & Search Campaigns, Google Analytics & Web Traffic, Email Marketing Automation, Conversion Rate Optimization",
			SupportingSkills: "Market Research, Landing Page Optimization, Creative Briefing, Customer Journey Mapping",
			CareerProspects:  "Digital Marketing Specialist, SEO Specialist, Performance Marketer, Social Media Manager, Growth Specialist",
			Tools:            "Google Analytics 4, Meta Ads Manager, Google Search Console, SEMrush, Mailchimp, WordPress",
			BadgeText:        "Growth Track",
			OrderIndex:       8,
			IsActive:         true,
		},
		{
			Slug:             "cyber-security",
			Number:           "09",
			Title:            "Cyber Security Analyst",
			Category:         "Hardware & Security",
			Image:            "/images/tentang-kami/fasilitas/fasilitas-lab-iot.png",
			ShortDesc:        "Pengujian penetrasi keamanan sistem, hardening konfigurasi jaringan, analisis ancaman siber, dan penanganan insiden keamanan digital.",
			FullDesc:         "Mempelajari teknik mendeteksi kerentanan sistem, pengujian keamanan aplikasi web, enkripsi data, firewalling, dan audit kepatuhan keamanan informasi.",
			CoreSkills:       "Vulnerability Assessment, Web Application Security (OWASP Top 10), Network Packet Inspection, Kali Linux Penetration Testing, Firewall & IPS/IDS Configuration, Cryptography Fundamentals, Incident Response & Digital Forensics",
			SupportingSkills: "Security Compliance & ISO 27001, Ethical Hacking Methodology, Log Analysis & SIEM",
			CareerProspects:  "Cyber Security Analyst, Junior Penetration Tester, Security Operations Center (SOC) Tier 1, Information Security Officer",
			Tools:            "Kali Linux, Burp Suite, Nmap, Wireshark, Metasploit, Snort, pfSense, OpenSSL",
			BadgeText:        "Cyber Defense",
			OrderIndex:       9,
			IsActive:         true,
		},
	}

	for _, item := range dtpItems {
		db.Create(&item)
	}
	log.Println("berhasil menginisialisasi 9 spesialisasi Digital Talent Program (DTP) default.")
}
