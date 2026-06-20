package main

import (
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"gopkg.in/yaml.v3"
)

type availableModelInfo struct {
	ID        string `json:"id"`
	Provider  string `json:"provider"`
	BaseURL   string `json:"base_url,omitempty"`
	APIKeySet bool   `json:"api_key_set,omitempty"`
}

func handleAvailableModels(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		jsonError(w, "方法不允许", http.StatusMethodNotAllowed)
		return
	}

	models, defaultModel := discoverAvailableModels()
	jsonResponse(w, map[string]any{
		"models":        models,
		"default_model": defaultModel,
		"total":         len(models),
	})
}

func discoverAvailableModels() ([]availableModelInfo, string) {
	fallbackModel := "deepseek/deepseek-chat"
	fallback := []availableModelInfo{{ID: fallbackModel, Provider: "openrouter"}}

	configPath := filepath.Join(getHome(), ".hermes", "config.yaml")
	data, err := os.ReadFile(configPath)
	if err != nil {
		return fallback, fallbackModel
	}

	var cfg map[string]any
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return fallback, fallbackModel
	}

	seen := map[string]availableModelInfo{}
	add := func(id, provider, baseURL string, apiKeySet bool) {
		id = strings.TrimSpace(id)
		provider = strings.TrimSpace(provider)
		if id == "" {
			return
		}
		if provider == "" {
			provider = "custom"
		}
		key := provider + "/" + id
		if strings.Contains(id, "/") {
			key = id
		}
		seen[key] = availableModelInfo{ID: id, Provider: provider, BaseURL: baseURL, APIKeySet: apiKeySet}
	}

	provider := stringValue(cfg["provider"])
	model := stringValue(cfg["model"])
	baseURL := ""
	apiKeySet := hasAnyAPIKey(cfg, provider)
	if modelCfg, ok := cfg["model"].(map[string]any); ok {
		provider = stringValue(modelCfg["provider"])
		model = stringValue(modelCfg["default"])
		baseURL = stringValue(modelCfg["base_url"])
		apiKeySet = stringValue(modelCfg["api_key"]) != "" || stringValue(modelCfg["apiKey"]) != ""
	}
	defaultModel := model
	add(model, provider, baseURL, apiKeySet)

	if cps, ok := cfg["custom_providers"].(map[string]any); ok {
		names := make([]string, 0, len(cps))
		for name := range cps {
			names = append(names, name)
		}
		sort.Strings(names)
		for _, name := range names {
			pm, ok := cps[name].(map[string]any)
			if !ok {
				continue
			}
			baseURL := stringValue(pm["base_url"])
			apiKeySet := stringValue(pm["api_key"]) != "" || stringValue(pm["apiKey"]) != ""
			switch v := pm["models"].(type) {
			case []any:
				for _, item := range v {
					add(stringValue(item), name, baseURL, apiKeySet)
				}
			case []string:
				for _, item := range v {
					add(item, name, baseURL, apiKeySet)
				}
			}
			add(stringValue(pm["model"]), name, baseURL, apiKeySet)
		}
	}

	if len(seen) == 0 {
		return fallback, fallbackModel
	}
	keys := make([]string, 0, len(seen))
	for k := range seen {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	models := make([]availableModelInfo, 0, len(keys))
	for _, k := range keys {
		models = append(models, seen[k])
	}
	if defaultModel == "" {
		defaultModel = models[0].ID
	}
	return models, defaultModel
}

func stringValue(v any) string {
	switch x := v.(type) {
	case string:
		return strings.TrimSpace(x)
	case nil:
		return ""
	default:
		return ""
	}
}

func hasAnyAPIKey(cfg map[string]any, provider string) bool {
	provider = strings.ToLower(provider)
	for k, v := range cfg {
		lk := strings.ToLower(k)
		if strings.Contains(lk, "api_key") || strings.Contains(lk, "apikey") {
			if provider == "" || strings.Contains(lk, provider) || stringValue(v) != "" {
				return stringValue(v) != ""
			}
		}
	}
	return false
}
