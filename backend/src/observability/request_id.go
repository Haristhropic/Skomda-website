package observability

import "github.com/google/uuid"

// RequestID returns a canonical UUID for log correlation. Invalid caller input
// is replaced, and valid input is normalized before it reaches the logs.
func RequestID(candidate string) string {
	parsed, err := uuid.Parse(candidate)
	if err != nil {
		return uuid.NewString()
	}
	return parsed.String()
}
