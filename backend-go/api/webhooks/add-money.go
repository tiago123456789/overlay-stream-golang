package handler

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/tiago123456789/overlay-stream-golang/src/utils/notification"
	"github.com/tiago123456789/overlay-stream-golang/src/utils/webhook"
)

var pushNotification *notification.PusherNotification

func Handler(w http.ResponseWriter, r *http.Request) {
	apiKey := r.Header.Get("api-key")
	webhook.IsAuthorizated(apiKey, w)

	if pushNotification == nil {
		pushNotification = notification.New("my-channel")
	}

	var data map[string]interface{}
	body, _ := io.ReadAll(r.Body)
	json.Unmarshal(body, &data)

	_ = pushNotification.Emit("add-money", data)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
