// Package chatbot menyediakan route handler proxy ke NexusRouter AI Gateway
// untuk asisten virtual resmi SMK Telkom Sidoarjo.
package chatbot

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/haristhropic/skomda-website/backend/src/config"
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

// RateLimiter sederhana in-memory per IP (maksimal 15 request per menit).
type RateLimiter struct {
	mu      sync.Mutex
	history map[string][]time.Time
}

var limiter = &RateLimiter{
	history: make(map[string][]time.Time),
}

func (rl *RateLimiter) allow(ip string, maxReq int, window time.Duration) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-window)

	// Filter timestamps lama
	var valid []time.Time
	for _, t := range rl.history[ip] {
		if t.After(cutoff) {
			valid = append(valid, t)
		}
	}

	if len(valid) >= maxReq {
		rl.history[ip] = valid
		return false
	}

	valid = append(valid, now)
	rl.history[ip] = valid
	return true
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
				"target": cfg.NexusRouterURL,
			})
		})
	}
}

func handleChatMessage(c *gin.Context, cfg config.Config) {
	clientIP := c.ClientIP()

	// 1. Rate Limiting Check (15 req/menit)
	if !limiter.allow(clientIP, 15, 1*time.Minute) {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error": "Terlalu banyak pesan dalam waktu singkat. Mohon tunggu beberapa saat sebelum bertanya kembali.",
		})
		return
	}

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

	if req.Model == "" || req.Model == "groq" || req.Model == "gemini" || req.Model == "gemini-3.8-flash" {
		if cfg.ChatbotModel != "" {
			req.Model = cfg.ChatbotModel
		} else {
			req.Model = "llama-3.3-70b-versatile"
		}
	}

	// Tangani pertanyaan seputar DTP (Digital Talent Program) secara langsung agar jawaban akurat dengan 9 spesialisasi lengkap
	if isDtpQuery(trimmedMessage) {
		dtpResp := getDtpKnowledgeResponse()
		dtpSources := []gin.H{
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

		if req.Stream {
			c.Header("Content-Type", "text/event-stream")
			c.Header("Cache-Control", "no-cache")
			c.Header("Connection", "keep-alive")
			c.Header("X-Accel-Buffering", "no")
			c.Writer.Flush()

			words := strings.Split(dtpResp, " ")
			chunkSize := 5
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
					"sources": dtpSources,
				})
				_, _ = c.Writer.Write([]byte("data: " + string(payload) + "\n\n"))
				c.Writer.Flush()
				time.Sleep(15 * time.Millisecond)
			}
			_, _ = c.Writer.Write([]byte("data: [DONE]\n\n"))
			c.Writer.Flush()
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"response": dtpResp,
			"sources":  dtpSources,
			"model":    "Skomda Knowledge Base (DTP 9 Specializations)",
		})
		return
	}

	// Kirim pesan murni pengguna tanpa polusi prefix agar RAG retrieval & instruction-following akurat
	processedMessage := trimmedMessage

	// 3. Siapkan request ke NexusRouter Gateway
	nexusURL := strings.TrimRight(cfg.NexusRouterURL, "/") + "/api/v1/skomda/chat"
	forwardPayload, err := json.Marshal(map[string]interface{}{
		"message": processedMessage,
		"history": req.History,
		"stream":  req.Stream,
		"model":   req.Model,
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
	httpReq.Header.Set("X-Agent-Name", "Skomda-Website-Bot")
	httpReq.Header.Set("X-Internal-Client", "skomda")
	httpReq.Header.Set("X-Virtual-Key", "vk-skomda")
	if req.Stream {
		httpReq.Header.Set("Accept", "text/event-stream")
	}

	client := &http.Client{
		Timeout: 45 * time.Second,
	}

	resp, err := client.Do(httpReq)
	if err != nil {
		log.Printf("[Chatbot] Gagal menghubungi NexusRouter di %s: %v", nexusURL, err)
		// Fallback ramah jika NexusRouter offline
		c.JSON(http.StatusOK, gin.H{
			"response": "Mohon maaf, asisten virtual SMK Telkom Sidoarjo sedang dalam pemeliharaan berkala.\n\nUntuk informasi pendaftaran PPDB 2026/2027, jurusan, atau konsultasi sekolah, silakan hubungi WhatsApp resmi kami di **0811-3021-919** atau unduh brosur resmi di menu [Unduh Informasi](/unduh-informasi).",
			"sources": []gin.H{
				{
					"title":    "Unduh Brosur PPDB & Informasi",
					"url":      "/unduh-informasi",
					"category": "PPDB & Regulasi",
				},
			},
			"fallback": true,
		})
		return
	}
	defer resp.Body.Close()

	// 4. Handle Streaming SSE atau JSON Response
	if req.Stream && strings.Contains(resp.Header.Get("Content-Type"), "text/event-stream") {
		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")
		c.Header("X-Accel-Buffering", "no")
		c.Writer.Flush()

		reader := bufio.NewReader(resp.Body)
		for {
			line, readErr := reader.ReadBytes('\n')
			if len(line) > 0 {
				_, _ = c.Writer.Write(line)
				c.Writer.Flush()
			}
			if readErr != nil {
				if readErr != io.EOF {
					log.Printf("[Chatbot] Streaming read error: %v", readErr)
				}
				break
			}
		}
		return
	}

	// Response Non-Streaming (JSON biasa)
	body, err := io.ReadAll(resp.Body)
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

