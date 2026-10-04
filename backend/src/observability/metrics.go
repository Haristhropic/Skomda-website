package observability

import (
	"fmt"
	"github.com/haristhropic/skomda-website/backend/src/audit"
	"log"
	"net/http"
	"os"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Request struct {
	Timestamp  time.Time `json:"timestamp"`
	Method     string    `json:"method"`
	Route      string    `json:"route"`
	Status     int       `json:"status"`
	DurationMS float64   `json:"duration_ms"`
	RequestID  string    `json:"request_id"`
}
type counter struct {
	Count   uint64
	Errors  uint64
	Seconds float64
	Buckets [8]uint64
}

var buckets = []float64{.01, .05, .1, .25, .5, 1, 2, 5}
var metrics = struct {
	sync.Mutex
	Started   time.Time
	Total     uint64
	Errors    uint64
	Routes    map[string]*counter
	Recent    []Request
	Durations []float64
}{Started: time.Now(), Routes: make(map[string]*counter)}

// Record accepts route templates, never URLs with queries or request bodies.
func Record(method, route string, status int, elapsed time.Duration, requestID string) {
	method = strings.Clone(method)
	route = strings.Clone(route)
	requestID = strings.Clone(requestID)
	if method != "GET" && method != "POST" && method != "PUT" && method != "PATCH" && method != "DELETE" && method != "OPTIONS" && method != "HEAD" {
		method = "OTHER"
	}
	metrics.Lock()
	defer metrics.Unlock()
	metrics.Total++
	if status >= 500 {
		metrics.Errors++
	}
	key := method + " " + route + " " + strconv.Itoa(status)
	entry := metrics.Routes[key]
	if entry == nil {
		if len(metrics.Routes) >= 512 {
			key = method + " unmatched " + strconv.Itoa(status)
		}
		entry = metrics.Routes[key]
		if entry == nil {
			entry = &counter{}
			metrics.Routes[key] = entry
		}
	}
	entry.Count++
	entry.Seconds += elapsed.Seconds()
	if status >= 500 {
		entry.Errors++
	}
	for i, limit := range buckets {
		if elapsed.Seconds() <= limit {
			entry.Buckets[i]++
		}
	}
	metrics.Recent = append(metrics.Recent, Request{time.Now().UTC(), method, route, status, float64(elapsed.Microseconds()) / 1000, requestID})
	if len(metrics.Recent) > 100 {
		metrics.Recent = metrics.Recent[1:]
	}
	metrics.Durations = append(metrics.Durations, float64(elapsed.Microseconds())/1000)
	if len(metrics.Durations) > 2048 {
		metrics.Durations = metrics.Durations[1:]
	}
}

func Snapshot() map[string]interface{} {
	metrics.Lock()
	defer metrics.Unlock()
	durations := append([]float64(nil), metrics.Durations...)
	sort.Float64s(durations)
	p95 := float64(0)
	if len(durations) > 0 {
		p95 = durations[(len(durations)-1)*95/100]
	}
	recent := append([]Request(nil), metrics.Recent...)
	for i, j := 0, len(recent)-1; i < j; i, j = i+1, j-1 {
		recent[i], recent[j] = recent[j], recent[i]
	}
	hostname, _ := os.Hostname()
	uptime := time.Since(metrics.Started).Seconds()
	return map[string]interface{}{"captured_at": time.Now().UTC(), "instance": hostname, "scope": "replica", "uptime_seconds": uptime, "requests": map[string]interface{}{"total": metrics.Total, "errors": metrics.Errors, "rate_per_second": float64(metrics.Total) / uptime, "p95_ms": p95}, "recent_requests": recent}
}

// StartPrivateServer is served only on an unpublished private Docker port.
// No application secrets, request text, IPs, or queries enter these metrics.
func StartPrivateServer(port string) {
	if port == "" {
		return
	}
	if value, err := strconv.Atoi(port); err != nil || value < 1024 || value > 65535 {
		log.Fatal("invalid MONITORING_PORT")
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(405)
			return
		}
		w.Header().Set("Content-Type", "text/plain; version=0.0.4")
		metrics.Lock()
		defer metrics.Unlock()
		fmt.Fprintln(w, "# TYPE skomda_http_requests_total counter")
		for key, value := range metrics.Routes {
			// The label string is generated internally; templates never contain queries.
			var method, route, status string
			fmt.Sscan(key, &method, &route, &status)
			labels := fmt.Sprintf("method=%q,route=%q,status=%q", method, route, status)
			fmt.Fprintf(w, "skomda_http_requests_total{%s} %d\n", labels, value.Count)
			for i, limit := range buckets {
				fmt.Fprintf(w, "skomda_http_request_duration_seconds_bucket{%s,le=%q} %d\n", labels, strconv.FormatFloat(limit, 'f', -1, 64), value.Buckets[i])
			}
			fmt.Fprintf(w, "skomda_http_request_duration_seconds_bucket{%s,le=\"+Inf\"} %d\n", labels, value.Count)
			fmt.Fprintf(w, "skomda_http_request_duration_seconds_sum{%s} %f\n", labels, value.Seconds)
			fmt.Fprintf(w, "skomda_http_request_duration_seconds_count{%s} %d\n", labels, value.Count)
		}
		var memory runtime.MemStats
		runtime.ReadMemStats(&memory)
		fmt.Fprintf(w, "skomda_process_uptime_seconds %f\nskomda_go_goroutines %d\nskomda_go_memory_bytes %d\n", time.Since(metrics.Started).Seconds(), runtime.NumGoroutine(), memory.Alloc)
		fmt.Fprintf(w, "# TYPE skomda_audit_dropped_total counter\nskomda_audit_dropped_total %d\n", audit.Dropped())
	})
	server := &http.Server{Addr: ":" + port, Handler: mux, ReadHeaderTimeout: 3 * time.Second, ReadTimeout: 5 * time.Second, WriteTimeout: 5 * time.Second, IdleTimeout: 30 * time.Second}
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("private metrics server unavailable")
		}
	}()
}
