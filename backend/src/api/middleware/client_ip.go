package middleware

import (
	"net"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// ClientIPKey returns the visitor IP passed by Cloudflare or, in local development,
// the direct peer IP. The production API is reachable through the Cloudflare Tunnel
// and its Docker-published host port is bound to loopback.
func ClientIPKey(c *fiber.Ctx) string {
	if forwarded := strings.TrimSpace(c.Get("CF-Connecting-IP")); forwarded != "" {
		if ip := net.ParseIP(forwarded); ip != nil {
			return ip.String()
		}
	}

	if ip := net.ParseIP(strings.TrimSpace(c.IP())); ip != nil {
		return ip.String()
	}
	return "unknown"
}
