package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"github.com/tiago123456789/overlay-stream-golang/pkg/cors"
	"github.com/tiago123456789/overlay-stream-golang/src/types"
	"github.com/tiago123456789/overlay-stream-golang/src/utils/auth"
)

func getApiKey(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	accessToken := r.Header.Get("Authorization")
	accessToken = strings.ReplaceAll(accessToken, "Bearer ", "")

	if accessToken == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err := auth.New().IsValid(accessToken)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		message, _ := json.Marshal(types.ErrorMessage{
			Message: "Token is invalid or expired",
		})

		w.Write(message)
		return
	}

	response, _ := json.Marshal(types.AuthenticatedSuccesfull{
		Token:  "",
		ApiKey: os.Getenv("API_KEY"),
	})

	w.Write(response)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	cors.Enable(w, r, getApiKey)
}
