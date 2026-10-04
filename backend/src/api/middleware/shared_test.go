package middleware

import (
	"net/http/httptest"
	"testing"

	"github.com/alicebob/miniredis/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/haristhropic/skomda-website/backend/src/shared"
)

func TestCacheIsolationAndInvalidation(t *testing.T) {
	server := miniredis.RunT(t)
	store, _ := shared.New("redis://" + server.Addr() + "/0")
	shared.Current = store
	defer store.Client.Close()
	app := fiber.New()
	app.Use(PublicCache())
	calls := 0
	app.Get("/api/news", func(c *fiber.Ctx) error {
		calls++
		return c.JSON(fiber.Map{"calls": calls, "query": c.Query("category")})
	})
	app.Post("/api/news", func(c *fiber.Ctx) error { return c.SendStatus(201) })
	request := func(path, token string) string {
		r := httptest.NewRequest("GET", path, nil)
		if token != "" {
			r.Header.Set("Authorization", token)
		}
		response, err := app.Test(r)
		if err != nil {
			t.Fatal(err)
		}
		defer response.Body.Close()
		return response.Header.Get("X-Cache")
	}
	if request("/api/news?category=one", "") != "MISS" || request("/api/news?category=one", "") != "HIT" {
		t.Fatal("cache missing")
	}
	if request("/api/news?category=two", "") != "MISS" {
		t.Fatal("query cache collision")
	}
	if request("/api/news?category=one", "Bearer private") != "" {
		t.Fatal("authenticated response cached")
	}
	response, err := app.Test(httptest.NewRequest("POST", "/api/news", nil))
	if err != nil {
		t.Fatal(err)
	}
	response.Body.Close()
	if request("/api/news?category=one", "") != "MISS" {
		t.Fatal("mutation failed to invalidate")
	}
	for _, path := range []string{"/api/auth/me", "/api/admin/news", "/api/settings", "/api/trial-class", "/api/alumni", "/api/health"} {
		if publicContentPath(path) {
			t.Fatalf("private data eligible for caching: %s", path)
		}
	}
}
