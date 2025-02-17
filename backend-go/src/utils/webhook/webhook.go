package webhook

import (
	"net/http"
	"os"
)

func IsAuthorizated(apiKey string, w http.ResponseWriter) {
	if apiKey == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if apiKey != os.Getenv("API_KEY") {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		return
	}
}
