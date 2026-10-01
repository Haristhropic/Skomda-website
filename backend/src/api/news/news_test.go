package news_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"github.com/nademmm/smktelkom-web/backend/src/api/news"
	"github.com/nademmm/smktelkom-web/backend/src/config"
	"github.com/nademmm/smktelkom-web/backend/src/models"
)

func setupTestDB() {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	config.DB = db
	config.DB.AutoMigrate(&models.News{})
	config.SeedNewsIfEmpty(config.DB, "test")
}

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	api := r.Group("/api")
	news.RegisterRoutes(api)
	return r
}

func TestGetNewsList(t *testing.T) {
	setupTestDB()
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/news", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data  []models.News `json:"data"`
		Total int           `json:"total"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(resp.Data), 10)
}

func TestGetNewsByCategory(t *testing.T) {
	setupTestDB()
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/news?category=Prestasi", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data []models.News `json:"data"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(resp.Data), 1)
	for _, item := range resp.Data {
		assert.Equal(t, "Prestasi", item.Category)
	}
}

func TestGetNewsBySlug(t *testing.T) {
	setupTestDB()
	router := setupTestRouter()

	slug := "penuh-dedikasi-siswa-dan-guru-smk-telkom-sidoarjo-peringati-hari-kemerdekaan-ri-ke-81"
	req, _ := http.NewRequest(http.MethodGet, "/api/news/"+slug, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data models.News `json:"data"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, slug, resp.Data.Slug)
}

func TestCreateUpdateDeleteNewsCRUD(t *testing.T) {
	setupTestDB()
	router := setupTestRouter()

	// 1. CREATE News
	createPayload := map[string]interface{}{
		"title":    "Inovasi Robotik Siswa SKOMDA Juara Lomba Nasional",
		"category": "Prestasi",
		"summary":  "Siswa SKOMDA berhasil membuat robot pembersih panel surya cerdas.",
		"content":  "Konten lengkap tentang robotik pembersih panel surya...",
		"author":   "Tim Lab Robotik",
	}
	payloadBytes, _ := json.Marshal(createPayload)

	reqCreate, _ := http.NewRequest(http.MethodPost, "/api/news", bytes.NewBuffer(payloadBytes))
	reqCreate.Header.Set("Content-Type", "application/json")
	wCreate := httptest.NewRecorder()
	router.ServeHTTP(wCreate, reqCreate)

	assert.Equal(t, http.StatusCreated, wCreate.Code)

	var createResp struct {
		Message string      `json:"message"`
		Data    models.News `json:"data"`
	}
	err := json.Unmarshal(wCreate.Body.Bytes(), &createResp)
	assert.NoError(t, err)
	assert.NotZero(t, createResp.Data.ID)
	assert.Equal(t, "inovasi-robotik-siswa-skomda-juara-lomba-nasional", createResp.Data.Slug)

	createdID := createResp.Data.ID

	// 2. UPDATE News
	updatePayload := map[string]interface{}{
		"title":    "Inovasi Robotik Siswa SKOMDA Raih Medali Emas",
		"category": "Prestasi",
		"summary":  "Update ringkasan berita medali emas.",
		"content":  "Update konten artikel lengkap.",
	}
	updateBytes, _ := json.Marshal(updatePayload)

	reqUpdate, _ := http.NewRequest(http.MethodPut, "/api/news/"+strconvFormat(createdID), bytes.NewBuffer(updateBytes))
	reqUpdate.Header.Set("Content-Type", "application/json")
	wUpdate := httptest.NewRecorder()
	router.ServeHTTP(wUpdate, reqUpdate)

	assert.Equal(t, http.StatusOK, wUpdate.Code)

	var updateResp struct {
		Data models.News `json:"data"`
	}
	err = json.Unmarshal(wUpdate.Body.Bytes(), &updateResp)
	assert.NoError(t, err)
	assert.Equal(t, "Inovasi Robotik Siswa SKOMDA Raih Medali Emas", updateResp.Data.Title)

	// 3. DELETE News
	reqDelete, _ := http.NewRequest(http.MethodDelete, "/api/news/"+strconvFormat(createdID), nil)
	wDelete := httptest.NewRecorder()
	router.ServeHTTP(wDelete, reqDelete)

	assert.Equal(t, http.StatusOK, wDelete.Code)

	// 4. Verify Not Found after delete
	reqGet, _ := http.NewRequest(http.MethodGet, "/api/news/"+createResp.Data.Slug, nil)
	wGet := httptest.NewRecorder()
	router.ServeHTTP(wGet, reqGet)

	assert.Equal(t, http.StatusNotFound, wGet.Code)
}

func strconvFormat(id uint) string {
	var buf [20]byte
	i := len(buf)
	for id >= 10 {
		i--
		buf[i] = byte('0' + id%10)
		id /= 10
	}
	i--
	buf[i] = byte('0' + id)
	return string(buf[i:])
}
