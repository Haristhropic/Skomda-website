package main

import (
	"regexp"
	"strings"
	"testing"

	"github.com/haristhropic/skomda-website/backend/src/migrations"
)

func TestBaselineColumnInventoryMatchesEmbeddedDDL(t *testing.T) {
	data, err := migrations.FS.ReadFile("00001_initial_schema.sql")
	if err != nil {
		t.Fatal(err)
	}
	for table, expected := range expectedColumns {
		pattern := regexp.MustCompile(`(?s)CREATE TABLE public\.` + regexp.QuoteMeta(table) + ` \((.*?)\n\);`)
		match := pattern.FindStringSubmatch(string(data))
		if len(match) != 2 {
			t.Fatalf("missing table %s", table)
		}
		var columns []string
		for _, line := range strings.Split(match[1], "\n") {
			fields := strings.Fields(strings.TrimSpace(line))
			if len(fields) > 0 {
				columns = append(columns, strings.Trim(fields[0], `"`))
			}
		}
		if err := requireExactNames(table, expected, columns); err != nil {
			t.Fatal(err)
		}
	}
}
