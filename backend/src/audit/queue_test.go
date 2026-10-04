package audit

import (
	"context"
	"sync/atomic"
	"testing"
	"time"
)

func TestQueueBoundsWorkersAndRejectsOverflow(t *testing.T) {
	blocked := make(chan struct{})
	started := make(chan struct{}, 2)
	var active, peak atomic.Int32
	q := newQueue(2, 3, func(ctx context.Context, _ entry) {
		count := active.Add(1)
		for {
			previous := peak.Load()
			if count <= previous || peak.CompareAndSwap(previous, count) {
				break
			}
		}
		if _, ok := ctx.Deadline(); !ok {
			t.Error("write missing deadline")
		}
		select {
		case started <- struct{}{}:
		default:
		}
		<-blocked
		active.Add(-1)
	})
	q.enqueue(entry{})
	q.enqueue(entry{})
	for i := 0; i < 2; i++ {
		select {
		case <-started:
		case <-time.After(time.Second):
			t.Fatal("workers did not start")
		}
	}
	for i := 0; i < 3; i++ {
		if !q.enqueue(entry{}) {
			t.Fatal("queue unexpectedly full")
		}
	}
	if q.enqueue(entry{}) {
		t.Fatal("overflow must not enqueue")
	}
	if q.dropped.Load() != 1 || peak.Load() != 2 {
		t.Fatalf("dropped=%d peak=%d", q.dropped.Load(), peak.Load())
	}
	close(blocked)
	close(q.jobs)
}
