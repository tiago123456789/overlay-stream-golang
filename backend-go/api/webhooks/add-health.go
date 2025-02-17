package handler

import (
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

	data := map[string]interface{}{}
	_ = pushNotification.Emit("add-health", data)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
