package api

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/haristhropic/skomda-website/backend/src/config"
	"gorm.io/gorm"
)

func requestDB(c *fiber.Ctx) *gorm.DB { return config.DB.WithContext(c.UserContext()) }

// A content editor can edit business fields, never GORM identity/lifecycle
// fields supplied by the caller. Existing values survive partial updates.
func parseContentBody(c *fiber.Ctx, target interface{}) error {
	if len(c.Body()) > 1024*1024 {
		return fmt.Errorf("payload terlalu besar")
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(c.Body(), &fields); err != nil {
		return err
	}
	if fields == nil {
		return fmt.Errorf("payload harus berupa objek JSON")
	}
	for key := range fields {
		normalized := strings.ReplaceAll(strings.ToLower(key), "_", "")
		if normalized == "id" || normalized == "createdat" || normalized == "updatedat" || normalized == "deletedat" {
			delete(fields, key)
		}
	}
	filtered, err := json.Marshal(fields)
	if err != nil {
		return err
	}
	return json.Unmarshal(filtered, target)
}
func listLimit(c *fiber.Ctx) int {
	limit, err := strconv.Atoi(c.Query("limit", "100"))
	if err != nil || limit < 1 || limit > 100 {
		return 100
	}
	return limit
}
func listOffset(c *fiber.Ctx) int {
	page, err := strconv.Atoi(c.Query("page", "1"))
	if err != nil || page < 1 || page > 10000 {
		return 0
	}
	return (page - 1) * listLimit(c)
}
