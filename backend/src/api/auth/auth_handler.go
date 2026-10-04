package auth

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"github.com/haristhropic/skomda-website/backend/src/models"
	"github.com/haristhropic/skomda-website/backend/src/utils"
	"golang.org/x/crypto/bcrypt"
)

var dummyPasswordHash, _ = bcrypt.GenerateFromPassword([]byte("unused-timing-only-not-an-account"), bcrypt.DefaultCost)

// LoginHandler menangani autentikasi pengguna panel admin dan menerbitkan HttpOnly cookie.
func LoginHandler(cfg config.Config) fiber.Handler {
	type LoginInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	return func(c *fiber.Ctx) error {
		if len(c.Body()) > 8192 {
			return c.Status(413).JSON(fiber.Map{"error": "Permintaan masuk terlalu besar"})
		}
		var input LoginInput
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Format payload data login tidak valid",
			})
		}

		email := strings.ToLower(strings.TrimSpace(input.Email))
		password := input.Password

		if email == "" || password == "" || len(email) > 150 || len(password) > 72 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Email dan kata sandi wajib diisi",
			})
		}

		var user models.User
		err := config.DB.WithContext(c.UserContext()).Where("LOWER(email) = ?", email).First(&user).Error
		if err != nil {
			_ = bcrypt.CompareHashAndPassword(dummyPasswordHash, []byte(password))
		}
		if err != nil || !user.CheckPassword(password) {
			// Rekam percobaan gagal ke audit log untuk pemantauan keamanan
			go func(ip string) {
				config.DB.Create(&models.AuditLog{
					UserID:    0,
					UserName:  "GUEST",
					Action:    "LOGIN_FAILED",
					Entity:    "auth",
					Details:   "Percobaan login ditolak: kredensial tidak cocok",
					IPAddress: ip,
					CreatedAt: time.Now(),
				})
			}(c.IP())

			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Email atau kata sandi tidak valid. Silakan periksa kembali.",
			})
		}
		if !strings.EqualFold(user.Role, "editor") && !strings.EqualFold(user.Role, "super_admin") {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Role akun tidak valid. Hubungi super admin.",
			})
		}

		// Terbitkan token JWT berlaku 24 jam
		tokenDuration := 24 * time.Hour
		token, err := utils.GenerateToken(&user, cfg.JWTSecret, tokenDuration)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Gagal menerbitkan token otentikasi",
			})
		}

		// Set cookie HttpOnly
		isProd := strings.EqualFold(cfg.Env, "production")
		c.Cookie(&fiber.Cookie{
			Name:     "skomda_admin_token",
			Value:    token,
			Expires:  time.Now().Add(tokenDuration),
			HTTPOnly: true,
			Secure:   isProd,
			SameSite: "Lax",
			Path:     "/",
		})

		// Catat ke audit log
		go func(uid uint, name, ip string) {
			config.DB.Create(&models.AuditLog{
				UserID:    uid,
				UserName:  name,
				Action:    "LOGIN",
				Entity:    "auth",
				EntityID:  fmt.Sprint(user.ID),
				Details:   "Login berhasil ke panel admin",
				IPAddress: ip,
				CreatedAt: time.Now(),
			})
		}(user.ID, user.Name, c.IP())

		return c.JSON(fiber.Map{
			"message": "Login berhasil",
			"user": fiber.Map{
				"id":     user.ID,
				"name":   user.Name,
				"email":  user.Email,
				"role":   user.Role,
				"avatar": user.Avatar,
			},
		})
	}
}

// MeHandler mengembalikan data profil pengguna yang sedang login berdasarkan sesi token.
func MeHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		userIDVal := c.Locals("user_id")
		if userIDVal == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Sesi tidak ditemukan",
			})
		}

		userID, ok := userIDVal.(uint)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "ID pengguna tidak valid",
			})
		}

		var user models.User
		if err := config.DB.WithContext(c.UserContext()).First(&user, userID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Pengguna tidak ditemukan",
			})
		}

		return c.JSON(fiber.Map{
			"user": fiber.Map{
				"id":         user.ID,
				"name":       user.Name,
				"email":      user.Email,
				"role":       user.Role,
				"avatar":     user.Avatar,
				"created_at": user.CreatedAt,
			},
		})
	}
}

// LogoutHandler menghapus cookie sesi otentikasi admin.
func LogoutHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Cookie(&fiber.Cookie{
			Name:     "skomda_admin_token",
			Value:    "",
			Expires:  time.Now().Add(-1 * time.Hour),
			HTTPOnly: true,
			Path:     "/",
		})

		userName, _ := c.Locals("user_name").(string)
		userID, _ := c.Locals("user_id").(uint)
		if userID > 0 {
			go func(uid uint, name, ip string) {
				config.DB.Create(&models.AuditLog{
					UserID:    uid,
					UserName:  name,
					Action:    "LOGOUT",
					Entity:    "auth",
					Details:   "Logout dari panel admin",
					IPAddress: ip,
					CreatedAt: time.Now(),
				})
			}(userID, userName, c.IP())
		}

		return c.JSON(fiber.Map{
			"message": "Sesi berhasil ditutup (logout)",
		})
	}
}
