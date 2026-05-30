<template>
  <HxModal v-model="visible" :title="t('auth.connectTitle')" icon="key" :closable="false" size="sm">
    <div class="login-modal-body">
      <p class="login-description">
        {{ t('auth.connectDesc') }}
      </p>

      <HxInput
        v-model="token"
        type="password"
        :placeholder="t('auth.tokenPlaceholder')"
        :error="errorMsg"
        @enter="handleConnect"
      />

      <div v-if="errorMsg" class="login-error">{{ errorMsg }}</div>

      <div class="login-actions">
        <HxButton variant="ghost" @click="handleAutoLogin" :loading="autoLoading">
          {{ t('auth.autoConnect') }}
        </HxButton>
        <HxButton variant="primary" :loading="loading" :disabled="!token.trim()" @click="handleConnect">
          {{ t('auth.connect') }}
        </HxButton>
      </div>
    </div>
  </HxModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import HxModal from '../ui/HxModal.vue'
import HxInput from '../ui/HxInput.vue'
import HxButton from '../ui/HxButton.vue'
import { hermesAuthLogin, hermesAuthAutoLogin, setAuthToken, getAuthToken } from '@/api'

const { t } = useI18n()

const emit = defineEmits<{
  connected: []
}>()

const visible = ref(false)
const token = ref('')
const errorMsg = ref('')
const loading = ref(false)
const autoLoading = ref(false)

function show() {
  const existing = getAuthToken()
  if (existing) {
    token.value = existing
  }
  errorMsg.value = ''
  visible.value = true
}

function hide() {
  visible.value = false
}

async function handleAutoLogin() {
  autoLoading.value = true
  errorMsg.value = ''
  try {
    const result = await hermesAuthAutoLogin()
    if (result.success && result.token) {
      setAuthToken(result.token)
      token.value = result.token
      hide()
      emit('connected')
    } else {
      errorMsg.value = t('auth.autoFailed')
    }
  } catch (e: any) {
    errorMsg.value = e?.message || t('auth.autoFailed')
  } finally {
    autoLoading.value = false
  }
}

async function handleConnect() {
  if (!token.value.trim()) return
  errorMsg.value = ''
  loading.value = true
  try {
    const result = await hermesAuthLogin(token.value.trim())
    if (result.success) {
      setAuthToken(token.value.trim())
      hide()
      emit('connected')
    } else {
      errorMsg.value = t('auth.invalidToken')
    }
  } catch (e: any) {
    errorMsg.value = e?.message || t('auth.connectFailed')
  } finally {
    loading.value = false
  }
}

defineExpose({ show, hide })
</script>

<style scoped>
.login-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-description {
  font-size: 13px;
  color: var(--text-secondary, #888);
  line-height: 1.5;
  margin: 0;
}

.login-description code {
  background: var(--bg-elevated, #1a1a2e);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-primary, #e0e0e0);
}

.login-error {
  font-size: 12px;
  color: var(--error, #ff4757);
  margin: 0;
}

.login-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}
</style>
