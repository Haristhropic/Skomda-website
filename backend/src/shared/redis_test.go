package shared

import (
	"context"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
)

func TestSharedRateLimitAcrossReplicas(t *testing.T) {
	server := miniredis.RunT(t)
	first, _ := New("redis://" + server.Addr() + "/0")
	second, _ := New("redis://" + server.Addr() + "/0")
	defer first.Client.Close()
	defer second.Client.Close()
	ctx := context.Background()
	for i := 0; i < 5; i++ {
		store := first
		if i%2 != 0 {
			store = second
		}
		ok, _, err := store.Allow(ctx, "login", "visitor", 5, time.Minute)
		if err != nil || !ok {
			t.Fatalf("request %d rejected: %v", i, err)
		}
	}
	ok, retry, err := second.Allow(ctx, "login", "visitor", 5, time.Minute)
	if err != nil || ok || retry <= 0 {
		t.Fatalf("shared limit did not apply: %v %v", ok, err)
	}
	server.FastForward(time.Minute)
	ok, _, err = first.Allow(ctx, "login", "visitor", 5, time.Minute)
	if err != nil || !ok {
		t.Fatal("expired window did not reset")
	}
}
func TestRedisFailureFailsClosed(t *testing.T) {
	server := miniredis.RunT(t)
	store, _ := New("redis://" + server.Addr() + "/0")
	defer store.Client.Close()
	server.Close()
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	allowed, _, err := store.Allow(ctx, "login", "visitor", 5, time.Minute)
	if allowed || err == nil {
		t.Fatal("Redis outage must not allow protected operation")
	}
}
func TestDistributedAILease(t *testing.T) {
	server := miniredis.RunT(t)
	store, _ := New("redis://" + server.Addr() + "/0")
	defer store.Client.Close()
	for i := 0; i < 16; i++ {
		ok, err := store.AcquireAI(context.Background(), string(rune('a'+i)))
		if err != nil || !ok {
			t.Fatalf("lease failed %v", err)
		}
	}
	if ok, _ := store.AcquireAI(context.Background(), "overflow"); ok {
		t.Fatal("AI concurrency exceeded")
	}
	store.ReleaseAI("a")
	if ok, _ := store.AcquireAI(context.Background(), "replacement"); !ok {
		t.Fatal("release did not free lease")
	}
}
func TestCacheGenerationInvalidatesAcrossReplicas(t *testing.T) {
	server := miniredis.RunT(t)
	first, _ := New("redis://" + server.Addr() + "/0")
	second, _ := New("redis://" + server.Addr() + "/0")
	defer first.Client.Close()
	defer second.Client.Close()
	before, _ := first.Generation(context.Background())
	if err := second.Invalidate(context.Background()); err != nil {
		t.Fatal(err)
	}
	after, _ := first.Generation(context.Background())
	if before == after {
		t.Fatal("other replica did not see invalidation")
	}
}
