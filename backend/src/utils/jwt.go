package utils

import (
	"errors"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/haristhropic/skomda-website/backend/src/models"
)

// JWTClaims merepresentasikan payload claims untuk otentikasi admin.
type JWTClaims struct {
	UserID uint   `json:"user_id"`
	Email  string `json:"email"`
	Name   string `json:"name"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken membuat token JWT yang ditandatangani dengan secret key.
func GenerateToken(user *models.User, secret string, duration time.Duration) (string, error) {
	if len(strings.TrimSpace(secret)) < 16 {
		return "", errors.New("kunci rahasia JWT (JWT_SECRET) tidak valid atau terlalu pendek (minimal 16 karakter)")
	}

	claims := JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		Name:   user.Name,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "skomda-backend",
			Subject:   user.Email,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ValidateToken memvalidasi string JWT dan mengembalikan claims terurai jika valid.
func ValidateToken(tokenStr, secret string) (*JWTClaims, error) {
	if len(strings.TrimSpace(secret)) < 16 {
		return nil, errors.New("kunci rahasia JWT (JWT_SECRET) tidak valid atau tidak dikonfigurasi")
	}

	token, err := jwt.ParseWithClaims(tokenStr, &JWTClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("metode penandatanganan token tidak valid")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, errors.New("token tidak valid atau telah kedaluwarsa")
	}

	return claims, nil
}
