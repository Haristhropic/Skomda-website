// Package audit limits background database writes independently of request load.
package audit

import (
	"context"
	"log"
	"strings"
	"sync/atomic"
	"time"
	"unicode/utf8"

	"github.com/haristhropic/skomda-website/backend/src/models"
	"gorm.io/gorm"
)

type entry struct {
	db    *gorm.DB
	event models.AuditLog
}

type queue struct {
	jobs    chan entry
	dropped atomic.Uint64
}

func newQueue(workers, capacity int, write func(context.Context, entry)) *queue {
	q := &queue{jobs: make(chan entry, capacity)}
	for i := 0; i < workers; i++ {
		go func() {
			for item := range q.jobs {
				ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
				write(ctx, item)
				cancel()
			}
		}()
	}
	return q
}

var pending = newQueue(2, 256, func(ctx context.Context, item entry) {
	if err := item.db.WithContext(ctx).Create(&item.event).Error; err != nil {
		log.Print("audit_write_failed: database unavailable")
	}
})

func copied(value string, max int) string {
	if len(value) > max {
		value = value[:max]
		for !utf8.ValidString(value) && len(value) > 0 {
			value = value[:len(value)-1]
		}
	}
	return strings.Clone(value)
}

// Enqueue snapshots metadata before Fiber reuses its request buffers. A full
// queue drops the audit event without blocking or creating more goroutines.
// This queue is best-effort, not a durable security event transport.
func Enqueue(db *gorm.DB, event models.AuditLog) bool {
	if db == nil {
		return false
	}
	event.UserName = copied(event.UserName, 100)
	event.Action = copied(event.Action, 50)
	event.Entity = copied(event.Entity, 50)
	event.EntityID = copied(event.EntityID, 100)
	event.Details = copied(event.Details, 1024)
	event.IPAddress = copied(event.IPAddress, 50)
	if event.CreatedAt.IsZero() {
		event.CreatedAt = time.Now()
	}
	return pending.enqueue(entry{db: db, event: event})
}

func (q *queue) enqueue(item entry) bool {
	select {
	case q.jobs <- item:
		return true
	default:
		count := q.dropped.Add(1)
		if count == 1 || count%64 == 0 {
			log.Printf("audit_queue_full dropped_total=%d", count)
		}
		return false
	}
}

func Dropped() uint64 { return pending.dropped.Load() }
