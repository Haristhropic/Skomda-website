// Package migrations embeds the reviewed PostgreSQL schema migrations.
package migrations

import "embed"

// FS contains the SQL files consumed by the production migrator.
//
//go:embed *.sql
var FS embed.FS
