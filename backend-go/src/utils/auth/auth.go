package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/tiago123456789/overlay-stream-golang/src/types"
)

type Auth interface {
	GetToken(email string) (string, error)
	IsValid(token string) error
}

type JWTAuth struct {
}

func New() *JWTAuth {
	return &JWTAuth{}
}

func getSecret() []byte {
	return []byte(os.Getenv("JWT_SECRET"))
}

func (auth *JWTAuth) IsValid(tokenString string) error {
	claims := &types.TokePayload{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return getSecret(), nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}

func (auth *JWTAuth) GetToken(email string) (string, error) {
	expirationTime := time.Now().Add(1 * time.Hour)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, types.TokePayload{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	})

	tokenString, _ := token.SignedString(getSecret())

	return tokenString, nil
}
