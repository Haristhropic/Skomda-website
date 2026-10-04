package middleware

import (
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/models"
	"github.com/haristhropic/skomda-website/backend/src/utils"
	"gorm.io/gorm"
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

		// Role dalam JWT adalah snapshot saat login. Ambil role terbaru dari database
		// agar perubahan/penonaktifan akun berlaku tanpa menunggu token 24 jam kedaluwarsa.
		var user models.User
		if err := config.DB.WithContext(c.UserContext()).Select("id", "email", "name", "role").First(&user, claims.UserID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"error": "Akun tidak ditemukan atau sudah dinonaktifkan. Silakan login kembali.",
				})
			}
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "Tidak dapat memverifikasi akun saat ini. Silakan coba kembali.",
			})
		}
		claims.Email = user.Email
		claims.Name = user.Name
		claims.Role = user.Role
		if !strings.EqualFold(user.Role, "editor") && !strings.EqualFold(user.Role, "super_admin") {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Role akun tidak valid. Hubungi super admin.",
			})
		}

		// Simpan data user ke dalam Locals context Fiber
		c.Locals("user", claims)
		c.Locals("user_id", claims.UserID)
		c.Locals("user_email", claims.Email)
		c.Locals("user_name", claims.Name)
		c.Locals("user_role", claims.Role)
		// Content belongs to editors; super admins monitor and provision accounts.
		contentRequest := !strings.HasPrefix(c.Path(), "/api/auth/") && !strings.HasPrefix(c.Path(), "/api/admin/users") && c.Path() != "/api/admin/monitoring" && c.Path() != "/api/admin/audit-logs"
		if contentRequest && !strings.EqualFold(user.Role, "editor") {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Pengelolaan konten hanya tersedia untuk admin editor"})
		}

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
