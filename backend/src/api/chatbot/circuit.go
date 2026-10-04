package chatbot

import (
	"errors"
	"sync"
	"time"
)

var ErrProviderUnavailable = errors.New("provider temporarily unavailable")
var providerCircuit = struct {
	sync.Mutex
	unavailable map[string]time.Time
}{unavailable: make(map[string]time.Time)}

// ProviderAvailable avoids repeating slow gateway timeouts throughout an outage.
// A bounded cooldown automatically permits recovery without operator action.
func ProviderAvailable(endpoint string) bool {
	providerCircuit.Lock()
	defer providerCircuit.Unlock()
	return !time.Now().Before(providerCircuit.unavailable[endpoint])
}

func ProviderFailed(endpoint string) {
	providerCircuit.Lock()
	defer providerCircuit.Unlock()
	if len(providerCircuit.unavailable) >= 32 {
		for key := range providerCircuit.unavailable {
			delete(providerCircuit.unavailable, key)
			break
		}
	}
	providerCircuit.unavailable[endpoint] = time.Now().Add(30 * time.Second)
}

func ProviderRecovered(endpoint string) {
	providerCircuit.Lock()
	delete(providerCircuit.unavailable, endpoint)
	providerCircuit.Unlock()
}
