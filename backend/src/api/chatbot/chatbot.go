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
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nademmm/smktelkom-web/backend/src/config"
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

	if req.Model == "" || req.Model == "groq" || req.Model == "gemini" {
		req.Model = "gemini-3.8-flash"
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
