package handler

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/tiago123456789/overlay-stream-golang/pkg/cors"
	"github.com/tiago123456789/overlay-stream-golang/src/types"
	"github.com/tiago123456789/overlay-stream-golang/src/utils/auth"
)

func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var credential types.Credential
	body, _ := io.ReadAll(r.Body)
	json.Unmarshal(body, &credential)

	if credential.Email == "" && credential.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		message, _ := json.Marshal(types.ErrorMessage{
			Message: "Email/Password are required",
		})

		w.Write(message)
		return
	}

	if credential.Email != os.Getenv("USER_EMAIL") && credential.Password == os.Getenv("USER_PASSWORD") {
		w.WriteHeader(http.StatusUnauthorized)
		message, _ := json.Marshal(types.ErrorMessage{
			Message: "Email/Password are invalid",
		})

		w.Write(message)
		return
	}

	tokenString, _ := auth.New().GetToken(credential.Email)
	accessToken, _ := json.Marshal(types.AuthenticatedSuccesfull{
		Token:  tokenString,
		ApiKey: os.Getenv("API_KEY"),
	})

	w.Write(accessToken)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	cors.Enable(w, r, login)
}
