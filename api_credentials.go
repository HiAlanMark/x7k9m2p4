package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

func handleConfigCredentials(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(204)
		return
	}

	configPath := filepath.Join(getHome(), ".hermes", "config.yaml")

	switch r.Method {
	case http.MethodPut:
		creds, keys, err := readCredentials(configPath)
		if err != nil {
			jsonError(w, "读取凭证失败: "+err.Error(), 500)
			return
		}
		jsonResponse(w, map[string]any{
			"credentials": creds,
			"keys":        keys,
		})

	case http.MethodPost:
		var body map[string]string
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			jsonError(w, "无效 JSON", 400)
			return
		}
		updated := updateConfigCredentials(configPath, body)
		jsonResponse(w, map[string]any{
			"success": true,
			"updated": updated,
		})

	default:
		jsonError(w, "方法不允许", 405)
	}
}

func readCredentials(path string) (map[string]string, []string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, nil, err
	}

	var config map[string]any
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, nil, err
	}

	creds := make(map[string]string)
	var keys []string
	extractCredentialKeys(config, "", creds, &keys)
	return creds, keys, nil
}

func extractCredentialKeys(obj map[string]any, prefix string, creds map[string]string, keys *[]string) {
	for k, v := range obj {
		fullKey := k
		if prefix != "" {
			fullKey = prefix + "." + k
		}

		switch val := v.(type) {
		case map[string]any:
			extractCredentialKeys(val, fullKey, creds, keys)
		case string:
			lower := strings.ToLower(k)
			if strings.Contains(lower, "api_key") || strings.Contains(lower, "apikey") ||
				strings.Contains(lower, "token") || strings.Contains(lower, "secret") ||
				strings.Contains(lower, "password") || strings.Contains(lower, "credential") {
				creds[fullKey] = maskSecret(val)
				*keys = append(*keys, fullKey)
			}
		}
	}
}

func maskSecret(s string) string {
	if len(s) <= 8 {
		return strings.Repeat("*", len(s))
	}
	return s[:4] + strings.Repeat("*", len(s)-8) + s[len(s)-4:]
}

func updateConfigCredentials(path string, updates map[string]string) []string {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}

	var config map[string]any
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil
	}

	var updated []string
	for key, value := range updates {
		parts := strings.Split(key, ".")
		if setNestedValue(config, parts, value) {
			updated = append(updated, key)
		}
	}

	if len(updated) > 0 {
		out, err := yaml.Marshal(config)
		if err != nil {
			fmt.Fprintf(os.Stderr, "[credentials] yaml marshal error: %v\n", err)
			return updated
		}
		if err := os.WriteFile(path, out, 0600); err != nil {
			fmt.Fprintf(os.Stderr, "[credentials] write error: %v\n", err)
		}
	}

	return updated
}

func setNestedValue(obj map[string]any, keys []string, value string) bool {
	if len(keys) == 0 {
		return false
	}
	current := obj
	for i := 0; i < len(keys)-1; i++ {
		next, ok := current[keys[i]]
		if !ok {
			return false
		}
		if m, ok := next.(map[string]any); ok {
			current = m
		} else {
			return false
		}
	}
	lastKey := keys[len(keys)-1]
	if _, exists := current[lastKey]; exists {
		current[lastKey] = value
		return true
	}
	return false
}
