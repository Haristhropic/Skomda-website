// Package shared coordinates replicas through the private Redis service.
package shared

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

var Current *Store

type Store struct {
	Client *redis.Client
	mu     sync.Mutex
	local  map[string]bucket
}
type bucket struct {
	Count int
	Until time.Time
}

func New(rawURL string) (*Store, error) {
	s := &Store{local: make(map[string]bucket)}
	if rawURL == "" {
		return s, nil
	}
	options, err := redis.ParseURL(rawURL)
	if err != nil {
		return nil, fmt.Errorf("invalid REDIS_URL")
	}
	options.PoolSize = 10
	options.MinIdleConns = 1
	options.DialTimeout = time.Second
	options.ReadTimeout = 500 * time.Millisecond
	options.WriteTimeout = 500 * time.Millisecond
	options.MaxRetries = 0
	options.ContextTimeoutEnabled = true
	s.Client = redis.NewClient(options)
	return s, nil
}

func (s *Store) Enabled() bool { return s != nil && s.Client != nil }
func (s *Store) Healthy(ctx context.Context) bool {
	if !s.Enabled() {
		return true
	}
	return s.Client.Ping(ctx).Err() == nil
}

func Hash(raw string) string { sum := sha256.Sum256([]byte(raw)); return hex.EncodeToString(sum[:]) }

var limitScript = redis.NewScript(`
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return {count, redis.call('PTTL', KEYS[1])}
`)

// Allow uses one atomic fixed window across every replica. Configured Redis
// failures return an error so security sensitive callers can fail closed.
func (s *Store) Allow(ctx context.Context, scope, identity string, maximum int, window time.Duration) (bool, time.Duration, error) {
	key := "skomda:limit:v1:" + scope + ":" + Hash(identity)
	if s.Enabled() {
		result, err := limitScript.Run(ctx, s.Client, []string{key}, window.Milliseconds()).Int64Slice()
		if err != nil {
			return false, 0, err
		}
		return result[0] <= int64(maximum), time.Duration(result[1]) * time.Millisecond, nil
	}
	// Development only fallback. Production replicas use configured Redis.
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	if len(s.local) > 4096 {
		for k, b := range s.local {
			if now.After(b.Until) {
				delete(s.local, k)
			}
		}
	}
	b := s.local[key]
	if now.After(b.Until) {
		b = bucket{Until: now.Add(window)}
	}
	b.Count++
	s.local[key] = b
	return b.Count <= maximum, time.Until(b.Until), nil
}

// Generation changes on successful content writes. Old entries expire after
// 30 seconds and cannot be selected after an invalidation from any replica.
func (s *Store) Generation(ctx context.Context) (string, error) {
	if !s.Enabled() {
		return "", fmt.Errorf("cache disabled")
	}
	value, err := s.Client.Get(ctx, "skomda:content:generation").Result()
	if err == redis.Nil {
		return "0", nil
	}
	return value, err
}
func (s *Store) Invalidate(ctx context.Context) error {
	if !s.Enabled() {
		return nil
	}
	return s.Client.Incr(ctx, "skomda:content:generation").Err()
}

// A distributed lease prevents a blue/green overlap doubling AI concurrency.
var acquireScript = redis.NewScript(`
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1])
if redis.call('ZCARD', KEYS[1]) >= tonumber(ARGV[3]) then return 0 end
redis.call('ZADD', KEYS[1], ARGV[2], ARGV[4])
redis.call('PEXPIRE', KEYS[1], 60000)
return 1
`)

func (s *Store) AcquireAI(ctx context.Context, id string) (bool, error) {
	if !s.Enabled() {
		return true, nil
	}
	now := time.Now().UnixMilli()
	result, err := acquireScript.Run(ctx, s.Client, []string{"skomda:ai:leases"}, now, now+40000, 16, id).Int()
	return result == 1, err
}
func (s *Store) ReleaseAI(id string) {
	if !s.Enabled() {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()
	_ = s.Client.ZRem(ctx, "skomda:ai:leases", id).Err()
}
