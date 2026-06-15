<template>
  <div class="channels-view">
    <header class="channels-header">
      <h1 class="channels-title">{{ t('channels.title') }}</h1>
      <p class="channels-subtitle">{{ t('channels.subtitle') }}</p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="channels-loading">
      <HxSpinner size="md" />
      <span>{{ t('common.loading') }}</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="channels-error">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      <span>{{ error }}</span>
    </div>

    <!-- Channel cards grid -->
    <div v-if="!loading" class="channels-grid">
      <div
        v-for="ch in channels"
        :key="ch.platform"
        class="channel-card glass-panel"
        :class="{ 'channel-card--enabled': ch.enabled, 'channel-card--expanded': expanded[ch.platform] }"
      >
        <!-- Card header -->
        <div class="channel-card-header" @click="toggleExpand(ch.platform)">
          <div class="channel-card-identity">
            <span class="channel-icon" :class="{ 'channel-icon--active': ch.enabled }">
              <!-- Platform SVG icons -->
              <svg v-if="ch.platform === 'telegram'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <svg v-else-if="ch.platform === 'discord'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="6" y2="12.01"/><line x1="10" y1="12" x2="10" y2="12.01"/><line x1="14" y1="12" x2="14" y2="12.01"/><line x1="18" y1="12" x2="18" y2="12.01"/><line x1="8" y1="18" x2="16" y2="18"/><line x1="12" y1="6" x2="12" y2="3"/><circle cx="12" cy="3" r="1"/></svg>
              <svg v-else-if="ch.platform === 'slack'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
              <svg v-else-if="ch.platform === 'whatsapp'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <svg v-else-if="ch.platform === 'matrix'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
              <svg v-else-if="ch.platform === 'feishu'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <svg v-else-if="ch.platform === 'wechat'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <svg v-else-if="ch.platform === 'wecom'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
            </span>
            <div class="channel-card-info">
              <span class="channel-card-name">{{ t(`channels.platforms.${ch.platform}`) }}</span>
              <span class="channel-card-status">
                <span class="status-dot" :class="ch.enabled ? 'status-dot--on' : 'status-dot--off'"></span>
                {{ ch.enabled ? t('channels.enabled') : t('channels.disabled') }}
              </span>
            </div>
          </div>
          <div class="channel-card-actions" @click.stop>
            <HxToggle v-model="ch.enabled" @update:modelValue="onToggleEnabled(ch)" />
            <button class="channel-expand-btn" :title="expanded[ch.platform] ? t('channels.collapseConfig') : t('channels.expandConfig')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: expanded[ch.platform] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>

        <!-- Expandable config body -->
        <transition name="expand">
          <div v-if="expanded[ch.platform]" class="channel-card-body">
            <div v-for="key in getPlatformKeys(ch.platform)" :key="key" class="channel-field">
              <label class="channel-field-label">{{ t(`channels.fields.${key}`) }}</label>
              <HxInput
                :model-value="ch.config[key] || ''"
                :type="isSecretKey(key) ? 'password' : 'text'"
                :placeholder="t(`channels.fields.${key}`)"
                @update:model-value="(val: string) => onFieldChange(ch, key, val)"
              />
            </div>
            <div class="channel-card-footer">
              <HxButton
                variant="primary"
                size="sm"
                :loading="savingPlatform === ch.platform"
                :disabled="savingPlatform === ch.platform"
                @click="saveChannel(ch)"
              >
                {{ savingPlatform === ch.platform ? t('channels.saving') : t('channels.save') }}
              </HxButton>
              <span v-if="savedPlatform === ch.platform" class="channel-saved-hint">{{ t('channels.saved') }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { HxToggle, HxButton, HxInput, HxSpinner } from '@/components/ui'
import { hermesChannelsList, hermesChannelsUpdate, type ChannelConfig } from '@/api'

const { t } = useI18n()

const loading = ref(false)
const error = ref('')
const channels = ref<ChannelConfig[]>([])
const expanded = reactive<Record<string, boolean>>({})
const savingPlatform = ref('')
const savedPlatform = ref('')

// Platform key definitions (must match backend)
const PLATFORM_KEYS: Record<string, string[]> = {
  telegram: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_MENTION_CONTROL'],
  discord: ['DISCORD_BOT_TOKEN', 'DISCORD_MENTION_CONTROL', 'DISCORD_AUTO_THREAD'],
  slack: ['SLACK_BOT_TOKEN', 'SLACK_MENTION_CONTROL'],
  whatsapp: ['WHATSAPP_ENABLED', 'WHATSAPP_MENTION_CONTROL'],
  matrix: ['MATRIX_ACCESS_TOKEN', 'MATRIX_HOMESERVER', 'MATRIX_AUTO_THREAD'],
  feishu: ['FEISHU_APP_ID', 'FEISHU_APP_SECRET', 'FEISHU_MENTION_CONTROL'],
  wechat: ['WECHAT_ENABLED'],
  wecom: ['WECOM_BOT_ID', 'WECOM_BOT_SECRET'],
}

const SECRET_KEYS = new Set([
  'TELEGRAM_BOT_TOKEN', 'DISCORD_BOT_TOKEN', 'SLACK_BOT_TOKEN',
  'MATRIX_ACCESS_TOKEN', 'FEISHU_APP_SECRET', 'WECOM_BOT_SECRET',
])

function getPlatformKeys(platform: string): string[] {
  return PLATFORM_KEYS[platform] || []
}

function isSecretKey(key: string): boolean {
  return SECRET_KEYS.has(key)
}

function toggleExpand(platform: string) {
  expanded[platform] = !expanded[platform]
}

function onFieldChange(ch: ChannelConfig, key: string, value: string) {
  ch.config[key] = value
}

async function onToggleEnabled(ch: ChannelConfig) {
  await saveChannel(ch)
}

async function saveChannel(ch: ChannelConfig) {
  savingPlatform.value = ch.platform
  savedPlatform.value = ''
  try {
    await hermesChannelsUpdate(ch.platform, { ...ch.config }, ch.enabled)
    savedPlatform.value = ch.platform
    setTimeout(() => {
      if (savedPlatform.value === ch.platform) savedPlatform.value = ''
    }, 2000)
  } catch (e: any) {
    error.value = e?.message || t('channels.saveFailed')
  } finally {
    savingPlatform.value = ''
  }
}

async function fetchChannels() {
  loading.value = true
  error.value = ''
  try {
    const data = await hermesChannelsList()
    channels.value = data.channels || []
    // Ensure all config keys are present (even if empty)
    for (const ch of channels.value) {
      const keys = PLATFORM_KEYS[ch.platform] || []
      for (const k of keys) {
        if (!(k in ch.config)) {
          ch.config[k] = ''
        }
      }
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load channels'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchChannels()
})
</script>

<style scoped>
.channels-view {
  padding: 32px 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  overflow-y: auto;
}

.channels-header {
  margin-bottom: 32px;
}

.channels-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.channels-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.channels-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: var(--text-secondary);
  font-size: 14px;
}

.channels-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  background: color-mix(in srgb, #f44336 10%, transparent);
  color: #f44336;
  font-size: 14px;
  margin-bottom: 16px;
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.channel-card {
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border-base);
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.channel-card--enabled {
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent),
    0 0 16px color-mix(in srgb, var(--accent) 8%, transparent);
}

.channel-card:hover {
  border-color: color-mix(in srgb, var(--accent) 30%, var(--border-base));
}

.channel-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
}

.channel-card-identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.channel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--text-tertiary) 8%, transparent);
  color: var(--text-tertiary);
  transition: background 0.3s, color 0.3s;
  flex-shrink: 0;
}

.channel-icon--active {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
}

.channel-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.channel-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.channel-card-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot--on {
  background: var(--accent);
  box-shadow: 0 0 6px color-mix(in srgb, var(--accent) 60%, transparent);
}

.status-dot--off {
  background: var(--text-tertiary);
}

.channel-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: color-mix(in srgb, var(--text-tertiary) 8%, transparent);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.channel-expand-btn:hover {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
}

.channel-card-body {
  padding: 0 20px 20px;
  border-top: 1px solid color-mix(in srgb, var(--border-base) 60%, transparent);
}

.channel-field {
  margin-top: 14px;
}

.channel-field-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.channel-card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid color-mix(in srgb, var(--border-base) 40%, transparent);
}

.channel-saved-hint {
  font-size: 12px;
  color: var(--accent);
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: transform var(--slow);
  max-height: 400px;
  opacity: 1;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* Glass panel base style */
.glass-panel {
  background: var(--glass-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border-base, rgba(255, 255, 255, 0.08));
  border-radius: 12px;
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
}
</style>
