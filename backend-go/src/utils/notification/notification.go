package notification

import (
	"os"

	"github.com/pusher/pusher-http-go/v5"
)

type NotificationInterface interface {
	Emit(event string, data map[string]interface{}) error
}

type PusherNotification struct {
	pusher  pusher.Client
	channel string
}

func New(channel string) *PusherNotification {
	pusherClient := pusher.Client{
		AppID:   os.Getenv("PUSHER_APP_ID"),
		Key:     os.Getenv("PUSHER_KEY"),
		Secret:  os.Getenv("PUSHER_SECRET"),
		Cluster: os.Getenv("PUSHER_CLUSTER"),
	}
	return &PusherNotification{
		channel: channel,
		pusher:  pusherClient,
	}
}

func (n *PusherNotification) Emit(event string, data map[string]interface{}) error {
	err := n.pusher.Trigger(n.channel, event, data)

	if err != nil {
		return err
	}

	return nil
}
