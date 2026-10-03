package jurusan_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"github.com/haristhropic/skomda-website/backend/src/api/jurusan"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/models"
)

func setupTestDB() {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	config.DB = db
	config.DB.AutoMigrate(&models.Jurusan{})
	config.SeedJurusanIfEmpty(config.DB, "test")
}

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	api := r.Group("/api")
	jurusan.RegisterRoutes(api)
	return r
}

func TestGetJurusanList(t *testing.T) {
	setupTestDB()
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/jurusan", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data []models.Jurusan `json:"data"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(resp.Data), 2)
}

func TestGetJurusanBySlugSuccess(t *testing.T) {
	setupTestDB()
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/jurusan/sija", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data models.Jurusan `json:"data"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, "SIJA", resp.Data.Kode)
	assert.Equal(t, "sija", resp.Data.Slug)
}

func TestGetJurusanBySlugNotFound(t *testing.T) {
	setupTestDB()
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/api/jurusan/jurusan-tidak-ada", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestJurusanSkillsSerializer(t *testing.T) {
	setupTestDB()

	expectedSkills := []string{"Python", "Go", "Docker", "Kubernetes"}
	expectedCareers := []string{"Backend Engineer", "DevOps Engineer", "Site Reliability Engineer"}

	newJurusan := models.Jurusan{
		Kode:          "TEST",
		Nama:          "Jurusan Test Serializer",
		Slug:          "test-serializer",
		Deskripsi:     "Deskripsi pengujian serializer json slice pada GORM",
		Skills:        expectedSkills,
		ProspekKarier: expectedCareers,
		Gambar:        "/images/test.jpg",
	}

	err := config.DB.Create(&newJurusan).Error
	assert.NoError(t, err)
	assert.NotZero(t, newJurusan.ID)

	var retrieved models.Jurusan
	err = config.DB.Where("slug = ?", "test-serializer").First(&retrieved).Error
	assert.NoError(t, err)

	assert.Equal(t, "TEST", retrieved.Kode)
	assert.Equal(t, expectedSkills, retrieved.Skills)
	assert.Equal(t, expectedCareers, retrieved.ProspekKarier)
	assert.Equal(t, 4, len(retrieved.Skills))
	assert.Equal(t, 3, len(retrieved.ProspekKarier))
}

func TestSeedJurusanIfEmptyProduction(t *testing.T) {
	db, err := gorm.Open(sqlite.Open("file:memdb_prod_test?mode=memory&cache=shared"), &gorm.Config{})
	assert.NoError(t, err)
	assert.NotNil(t, db)

	err = db.AutoMigrate(&models.Jurusan{})
	assert.NoError(t, err)

	// Panggil seeder dengan env = "production"
	config.SeedJurusanIfEmpty(db, "production")

	var count int64
	db.Model(&models.Jurusan{}).Count(&count)
	assert.Equal(t, int64(0), count, "Seeder HARUS dilewati di environment production jika DB kosong")
}

func TestGetJurusanBySlugSQLInjection(t *testing.T) {
	setupTestDB()
	router := setupTestRouter()

	// Payload SQL injection mencoba bypass query
	sqliPayload := "' OR '1'='1"
	req, _ := http.NewRequest(http.MethodGet, "/api/jurusan/"+sqliPayload, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Query parameterized wajib menghasilkan 404 Not Found, bukan 200 OK dengan data bocor
	assert.Equal(t, http.StatusNotFound, w.Code)
}


