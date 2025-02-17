package types

type AuthenticatedSuccesfull struct {
	Token  string `json:"accessToken"`
	ApiKey string `json:"apiKey"`
}
