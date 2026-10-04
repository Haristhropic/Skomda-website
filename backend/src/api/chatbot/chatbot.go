// Package chatbot menyediakan route handler proxy ke NexusRouter AI Gateway
// untuk asisten virtual resmi SMK Telkom Sidoarjo.
package chatbot

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"net"
	"net/http"
	"regexp"
	"strings"

	"time"

	"github.com/gin-gonic/gin"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/observability"
	"github.com/haristhropic/skomda-website/backend/src/shared"
)

// ChatMessage merepresentasikan satu pesan dalam riwayat percakapan.
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatRequest payload dari frontend Next.js.
type ChatRequest struct {
	Message string        `json:"message" binding:"required"`
	History []ChatMessage `json:"history"`
	Stream  bool          `json:"stream"`
	Model   string        `json:"model"`
}

// RegisterRoutes mendaftarkan endpoint chatbot ke Gin router group.
func RegisterRoutes(r *gin.RouterGroup, cfg config.Config) {
	cbGroup := r.Group("/chatbot")
	{
		cbGroup.POST("/message", func(c *gin.Context) {
			handleChatMessage(c, cfg)
		})
		cbGroup.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status": "ready",
			})
		})
	}
}

func handleChatMessage(c *gin.Context, cfg config.Config) {
	clientIP := c.ClientIP()
	if forwarded := net.ParseIP(c.GetHeader("CF-Connecting-IP")); forwarded != nil {
		clientIP = forwarded.String()
	}
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 32*1024)

	// 1. Rate Limiting Check (15 req/menit)
	ctx, cancel := context.WithTimeout(c.Request.Context(), 750*time.Millisecond)
	allowed, _, limitErr := shared.Current.Allow(ctx, "chatbot", clientIP, 60, time.Minute)
	cancel()
	if limitErr != nil {
		c.Header("Retry-After", "5")
		c.JSON(503, gin.H{"error": "Proteksi layanan sementara tidak tersedia"})
		return
	}
	if !allowed {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error": "Terlalu banyak pesan dalam waktu singkat. Mohon tunggu beberapa saat sebelum bertanya kembali.",
		})
		return
	}
	leaseID := observability.RequestID("")
	ctx, cancel = context.WithTimeout(c.Request.Context(), 500*time.Millisecond)
	acquired, leaseErr := shared.Current.AcquireAI(ctx, leaseID)
	cancel()
	if leaseErr != nil || !acquired {
		c.Header("Retry-After", "10")
		c.JSON(503, gin.H{"error": "Asisten sedang sibuk"})
		return
	}
	defer shared.Current.ReleaseAI(leaseID)

	// 2. Parse & Validate Payload
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Permintaan tidak valid: parameter 'message' wajib diisi.",
		})
		return
	}

	trimmedMessage := strings.TrimSpace(req.Message)
	if trimmedMessage == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Pesan tidak boleh kosong.",
		})
		return
	}

	if _, err := ValidateRequest(trimmedMessage, req.History); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if Suspicious(trimmedMessage) || UnsafeHistory(req.History) {
		c.JSON(200, gin.H{"response": SafetyReply, "sources": []gin.H{}, "fallback": true})
		return
	}
	if reply, source := LocalFAQ(trimmedMessage); reply != "" {
		c.JSON(200, gin.H{"response": reply, "sources": []gin.H{{"title": "Informasi resmi sekolah", "url": source}}, "model": "Skomda Verified FAQ"})
		return
	}
	req.Model = cfg.ChatbotModel
	// Cek apakah query DTP memiliki intensi spesifik (magang/karir, sertifikasi, daftar 9 spesialisasi, atau overview)
	if isDtpQuery(trimmedMessage) {
		lower := strings.ToLower(trimmedMessage)
		var targetedResp string
		var targetedSources []gin.H

		if isDtpInternshipOrCareerQuery(lower) {
			targetedResp = getDtpInternshipCareerResponse()
			targetedSources = []gin.H{
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
			targetedSources = []gin.H{
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
			targetedSources = []gin.H{
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
			targetedSources = []gin.H{
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
				c.Header("Content-Type", "text/event-stream")
				c.Header("Cache-Control", "no-cache")
				c.Header("Connection", "keep-alive")
				c.Header("X-Accel-Buffering", "no")
				c.Writer.Flush()

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
					payload, _ := json.Marshal(gin.H{
						"delta":   gin.H{"content": chunk},
						"sources": targetedSources,
					})
					_, _ = c.Writer.Write([]byte("data: " + string(payload) + "\n\n"))
					c.Writer.Flush()

				}
				_, _ = c.Writer.Write([]byte("data: [DONE]\n\n"))
				c.Writer.Flush()
				return
			}

			c.JSON(http.StatusOK, gin.H{
				"response": targetedResp,
				"sources":  targetedSources,
				"model":    "Skomda Knowledge Engine (DTP Curated)",
			})
			return
		}
	}

	// Siapkan query cerdas dengan injeksi konteks DTP/SKOMDA terkini bila relevan agar AI menjawab akurat dan dinamis
	processedMessage := trimmedMessage
	if isDtpQuery(trimmedMessage) {
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
			"- INSTRUKSI ASISTEN: Jawablah secara cerdas, spesifik, natural, dan langsung menjawab apa yang ditanyakan pengguna tanpa mengulang template yang sama. Jangan gunakan em dash (—). Jika ditanya magang/karir, fokuskan pada peluang magang dan karir; jika ditanya daftar spesialisasi, sebutkan 9 bidangnya secara ringkas dan rapi; jika ditanya pengertian DTP, jelaskan konsep programnya. Selalu berikan respon yang relevan dan variatif.]\n\nPertanyaan: " + trimmedMessage
	}

	// 3. Siapkan request ke NexusRouter Gateway
	nexusURL := strings.TrimRight(cfg.NexusRouterURL, "/") + "/api/v1/skomda/chat"
	forwardPayload, err := json.Marshal(map[string]interface{}{
		"message":       ProtectedConversation(processedMessage, req.History),
		"system_prompt": SafetyPolicy,
		"history":       []ChatMessage{},
		"stream":        req.Stream,
		"model":         req.Model,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal memproses data permintaan percakapan.",
		})
		return
	}

	httpReq, err := http.NewRequestWithContext(c.Request.Context(), http.MethodPost, nexusURL, bytes.NewBuffer(forwardPayload))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal membuat koneksi ke gateway AI.",
		})
		return
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

	client := GatewayClient

	attempted := ProviderAvailable(nexusURL)
	var resp *http.Response
	if attempted {
		resp, err = client.Do(httpReq)
	} else {
		err = ErrProviderUnavailable
	}
	if err != nil || (resp != nil && resp.StatusCode != http.StatusOK) {
		if attempted {
			ProviderFailed(nexusURL)
		}
		requestID, _ := c.Get("request_id")
		if err != nil {
			log.Printf("[Chatbot] upstream tidak tersedia request_id=%v", requestID)
		} else {
			log.Printf("[Chatbot] upstream mengembalikan status=%d request_id=%v", resp.StatusCode, requestID)
			_ = resp.Body.Close()
		}

		// Fallback cerdas jika gateway offline
		if isDtpQuery(trimmedMessage) {
			c.JSON(http.StatusOK, gin.H{
				"response": getDtpKnowledgeResponse(),
				"sources": []gin.H{
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
			return
		}

		// Fallback ramah jika NexusRouter offline atau mengembalikan error.
		c.JSON(http.StatusOK, gin.H{
			"response": UnavailableReply,
			"sources": []gin.H{
				{
					"title":    "Profil sekolah",
					"url":      "/tentang-kami/profil-sekolah",
					"category": "Informasi sekolah",
				},
			},
			"fallback": true,
		})
		return
	}
	ProviderRecovered(nexusURL)
	defer resp.Body.Close()

	// 4. Handle Streaming SSE atau JSON Response
	if req.Stream && strings.Contains(resp.Header.Get("Content-Type"), "text/event-stream") {
		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")
		c.Header("X-Accel-Buffering", "no")
		c.Writer.Flush()

		reader := bufio.NewReader(io.LimitReader(resp.Body, 512*1024))
		for {
			line, readErr := reader.ReadBytes('\n')
			if len(line) > 0 {
				if _, err := c.Writer.Write(line); err != nil {
					break
				}
				c.Writer.Flush()
			}
			if readErr != nil {
				if readErr != io.EOF {
					requestID, _ := c.Get("request_id")
					log.Printf("[Chatbot] streaming upstream terputus request_id=%v", requestID)
				}
				break
			}
		}
		return
	}

	// Response Non-Streaming (JSON biasa)
	body, err := io.ReadAll(io.LimitReader(resp.Body, 512*1024))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal membaca balasan dari gateway AI.",
		})
		return
	}

	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
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
