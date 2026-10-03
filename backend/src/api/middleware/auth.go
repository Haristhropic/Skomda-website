package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/haristhropic/skomda-website/backend/src/utils"
)

// AuthMiddleware memverifikasi token JWT dari HttpOnly cookie atau header Authorization.
func AuthMiddleware(secret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var tokenStr string

		// 1. Cek dari cookie HttpOnly (rekomendasi keamanan utama)
		cookieToken := c.Cookies("skomda_admin_token")
		if cookieToken != "" {
			tokenStr = cookieToken
		}

		// 2. Fallback cek dari header Authorization: Bearer <token>
		if tokenStr == "" {
			authHeader := c.Get("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if tokenStr == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali.",
			})
		}

		claims, err := utils.ValidateToken(tokenStr, secret)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Token tidak valid atau kedaluwarsa. Silakan login kembali.",
			})
		}

		// Simpan data user ke dalam Locals context Fiber
		c.Locals("user", claims)
		c.Locals("user_id", claims.UserID)
		c.Locals("user_email", claims.Email)
		c.Locals("user_name", claims.Name)
		c.Locals("user_role", claims.Role)

		return c.Next()
	}
}

// RequireRole membatasi akses endpoint hanya untuk role tertentu (misal: super_admin).
func RequireRole(allowedRoles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		roleVal := c.Locals("user_role")
		if roleVal == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Otentikasi diperlukan sebelum memeriksa izin role",
			})
		}

		role, ok := roleVal.(string)
		if !ok {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Role pengguna tidak valid",
			})
		}

		for _, allowed := range allowedRoles {
			if strings.EqualFold(role, allowed) {
				return c.Next()
			}
		}

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Akses ditolak: role Anda tidak memiliki izin untuk melakukan aksi ini",
		})
	}
}
