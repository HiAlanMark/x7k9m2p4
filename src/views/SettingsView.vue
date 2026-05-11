<template>
  <div class="settings-view">
    <div class="settings-layout">
      <!-- Left navigation -->
      <aside class="settings-nav">
        <div class="settings-nav-title">设置</div>
        <a
          :class="['settings-nav-item', { active: activeSection === 'account' }]"
          @click="activeSection = 'account'"
        >
          <IconUser :size="18" />
          <span>账户</span>
        </a>
        <a
          :class="['settings-nav-item', { active: activeSection === 'model' }]"
          @click="activeSection = 'model'"
        >
          <IconSettings :size="18" />
          <span>模型设置</span>
        </a>
        <a
          :class="['settings-nav-item', { active: activeSection === 'apikeys' }]"
          @click="activeSection = 'apikeys'"
        >
          <IconStar :size="18" />
          <span>API Key</span>
        </a>
        <a
          :class="['settings-nav-item', { active: activeSection === 'usage' }]"
          @click="activeSection = 'usage'"
        >
          <IconChat :size="18" />
          <span>用量统计</span>
        </a>
        <a
          :class="['settings-nav-item', { active: activeSection === 'recharge' }]"
          @click="activeSection = 'recharge'"
        >
          <IconStore :size="18" />
          <span>充值</span>
        </a>
      </aside>

      <!-- Right content area -->
      <div class="settings-content">
        <!-- Account section -->
        <div v-if="activeSection === 'account'" class="content-section">
          <h2 class="section-title">gfw.net 账户</h2>

          <div v-if="!isLoggedIn" class="card">
            <div class="card-body">
              <div class="form-row">
                <label class="form-label">邮箱</label>
                <input v-model="email" type="email" placeholder="请输入邮箱" class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">密码</label>
                <input v-model="password" type="password" placeholder="请输入密码" class="form-input" />
              </div>
              <div class="form-actions">
                <button @click="handleLogin" :disabled="loading" class="btn-primary">
                  {{ loading ? '登录中...' : '登录' }}
                </button>
              </div>
            </div>
          </div>

          <div v-else class="card">
            <div class="card-body">
              <div class="user-profile-row">
                <div class="user-avatar">
                  <IconUser :size="24" />
                </div>
                <div class="user-info">
                  <div class="user-name">{{ user?.nickname || user?.email }}</div>
                  <div class="user-group">{{ userInfo?.group_name || 'Standard' }}</div>
                </div>
                <button @click="logout" class="btn-danger-outline">登出</button>
              </div>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">余额</span>
                  <span class="stat-value primary">{{ balance?.toFixed(2) }} G币</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">用户组</span>
                  <span class="stat-value">{{ userInfo?.group_name || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Model settings section -->
        <div v-if="activeSection === 'model'" class="content-section">
          <h2 class="section-title">模型设置</h2>

          <!-- Provider 选择 -->
          <div class="card" style="margin-bottom: 20px;">
            <div class="card-body">
              <div class="provider-tabs">
                <button
                  :class="['provider-tab', { active: providerMode === 'gfw' }]"
                  @click="providerMode = 'gfw'; chatStore.setProviderMode('gfw')"
                >
                  <IconStar :size="16" />
                  <span>gfw.net (内置)</span>
                </button>
                <button
                  :class="['provider-tab', { active: providerMode === 'custom' }]"
                  @click="providerMode = 'custom'; chatStore.setProviderMode('custom')"
                >
                  <IconSettings :size="16" />
                  <span>自定义 API</span>
                </button>
              </div>
            </div>
          </div>

          <!-- gfw.net 模式 -->
          <div v-if="providerMode === 'gfw'" class="card">
            <div class="card-header">
              <span class="card-header-tag default">默认</span>
              <span>gfw.net 模型服务</span>
            </div>
            <div class="card-body">
              <p class="hint-text">使用 gfw.net 内置的 API 中转服务，支持 56+ 模型，需要先在账户页面登录。</p>
              <div class="form-row">
                <label class="form-label">默认模型</label>
                <div class="form-input-wrap">
                  <select v-model="selectedModel" class="form-select">
                    <option v-for="m in featuredModels" :key="m.id" :value="m.id">
                      {{ m.name }} ({{ m.provider }}) - 上下文 {{ formatContext(m.context_window) }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <label class="form-label">上下文长度</label>
                <input v-model.number="contextLength" type="number" class="form-input" style="max-width: 200px;" />
              </div>
              <div class="form-row">
                <label class="form-label">流式输出</label>
                <label class="toggle">
                  <input v-model="streaming" type="checkbox" />
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">{{ streaming ? '已启用' : '已关闭' }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 自定义 API 模式 -->
          <div v-if="providerMode === 'custom'" class="card">
            <div class="card-header">
              <span class="card-header-tag custom">自定义</span>
              <span>自定义 API 提供商</span>
            </div>
            <div class="card-body">
              <p class="hint-text">
                接入任何兼容 OpenAI API 格式的服务（如 OpenAI、Anthropic、DeepSeek、Ollama、vLLM 等）。
              </p>
              <div class="form-row">
                <label class="form-label">名称</label>
                <input v-model="customName" type="text" placeholder="例如: OpenAI / DeepSeek / 本地 Ollama" class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">API Base URL</label>
                <input v-model="customBaseUrl" type="text" placeholder="例如: https://api.openai.com/v1" class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">API Key</label>
                <input v-model="customApiKey" type="password" placeholder="sk-..." class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">模型名称</label>
                <input v-model="customModel" type="text" placeholder="例如: gpt-4o / deepseek-chat / llama3" class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">上下文长度</label>
                <input v-model.number="contextLength" type="number" class="form-input" style="max-width: 200px;" />
              </div>
              <div class="form-row">
                <label class="form-label">流式输出</label>
                <label class="toggle">
                  <input v-model="streaming" type="checkbox" />
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">{{ streaming ? '已启用' : '已关闭' }}</span>
                </label>
              </div>

              <!-- 预设快捷填充 -->
              <div class="presets-section">
                <span class="presets-label">快速填充：</span>
                <button v-for="preset in providerPresets" :key="preset.name" class="preset-btn" @click="applyPreset(preset)">
                  {{ preset.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- 连接测试 -->
          <div class="card" style="margin-top: 16px;">
            <div class="card-body">
              <div class="test-row">
                <button @click="testConnection" :disabled="testing" class="btn-secondary">
                  {{ testing ? '测试中...' : '测试连接' }}
                </button>
                <span v-if="testResult" :class="['test-result', testResult.ok ? 'success' : 'error']">
                  {{ testResult.message }}
                </span>
              </div>
            </div>
          </div>

          <div class="form-actions" style="margin-top: 20px;">
            <button @click="saveModelSettings" class="btn-primary">保存设置</button>
          </div>
        </div>

        <!-- API Keys section -->
        <div v-if="activeSection === 'apikeys'" class="content-section">
          <h2 class="section-title">API Key 管理</h2>

          <div class="card">
            <div class="card-body no-padding">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>Key 前缀</th>
                    <th>限额</th>
                    <th>已用</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="key in apiKeys.slice(0, 10)" :key="key.id">
                    <td class="cell-name">{{ key.name }}</td>
                    <td class="cell-mono">{{ key.key_prefix }}</td>
                    <td>{{ key.gcoin_limit || '无限制' }} G币</td>
                    <td>{{ key.used_quota.toFixed(4) }}</td>
                    <td>
                      <span :class="['status-tag', key.is_active ? 'active' : 'inactive']">
                        {{ key.is_active ? '启用' : '停用' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-top: 16px;">
            <button @click="showCreateKey = !showCreateKey" class="btn-secondary">
              + 创建新 Key
            </button>
          </div>

          <div v-if="showCreateKey" class="card" style="margin-top: 12px;">
            <div class="card-body">
              <div class="form-row">
                <label class="form-label">Key 名称</label>
                <input v-model="newKeyName" placeholder="例如: Desktop Key" class="form-input" style="max-width: 300px;" />
              </div>
              <div class="form-row">
                <label class="form-label">G 币限额</label>
                <input v-model.number="newKeyLimit" type="number" class="form-input" style="max-width: 200px;" />
              </div>
              <div class="form-actions">
                <button @click="createKey" class="btn-primary">创建</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Usage section -->
        <div v-if="activeSection === 'usage'" class="content-section">
          <h2 class="section-title">用量统计 (近 7 天)</h2>

          <div class="card">
            <div class="card-body no-padding">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>请求数</th>
                    <th>输入 Token</th>
                    <th>输出 Token</th>
                    <th>费用 (G币)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in dailyUsage" :key="u.date">
                    <td>{{ u.date }}</td>
                    <td>{{ u.request_count }}</td>
                    <td>{{ u.input_tokens.toLocaleString() }}</td>
                    <td>{{ u.output_tokens.toLocaleString() }}</td>
                    <td class="cell-cost">{{ u.total_cost.toFixed(4) }}</td>
                  </tr>
                  <tr v-if="!dailyUsage || dailyUsage.length === 0">
                    <td colspan="5" class="empty-cell">暂无数据</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recharge section -->
        <div v-if="activeSection === 'recharge'" class="content-section">
          <h2 class="section-title">充值</h2>

          <div class="packages-grid">
            <div
              v-for="pkg in rechargePackages"
              :key="pkg.id"
              :class="['package-card', { recommended: pkg.badge }]"
            >
              <span v-if="pkg.badge" class="package-badge">{{ pkg.badge }}</span>
              <h3 class="package-name">{{ pkg.name }}</h3>
              <p class="package-desc">{{ pkg.description }}</p>
              <div class="package-price">{{ pkg.price }}</div>
              <div class="package-amount">{{ pkg.gcoin_amount }} G币</div>
              <div v-if="pkg.bonus_gcoin > 0" class="package-bonus">+{{ pkg.bonus_gcoin }} 赠送</div>
              <button class="btn-primary package-btn">立即充值</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGfwStore } from '../stores/gfw'
import { useChatStore } from '../stores/chat'
import { storeToRefs } from 'pinia'
import IconUser from '../components/icons/IconUser.vue'
import IconSettings from '../components/icons/IconSettings.vue'
import IconStar from '../components/icons/IconStar.vue'
import IconChat from '../components/icons/IconChat.vue'
import IconStore from '../components/icons/IconStore.vue'

const gfwStore = useGfwStore()
const chatStore = useChatStore()

const { isLoggedIn, user, balance, models, apiKeys, dailyUsage, rechargePackages, loading } = storeToRefs(gfwStore)
const { selectedModel, providerMode: storeProviderMode, customProvider } = storeToRefs(chatStore)

const email = ref('')
const password = ref('')
const contextLength = ref(128000)
const streaming = ref(true)
const showCreateKey = ref(false)
const newKeyName = ref('')
const newKeyLimit = ref(50)
const userInfo = ref<{ group_name: string } | null>(null)
const activeSection = ref('account')

// 自定义 provider
const providerMode = ref(storeProviderMode.value)
const customName = ref(customProvider.value.name)
const customBaseUrl = ref(customProvider.value.baseUrl)
const customApiKey = ref(customProvider.value.apiKey)
const customModel = ref(customProvider.value.model)
const testing = ref(false)
const testResult = ref<{ ok: boolean; message: string } | null>(null)

// 预设提供商
const providerPresets = [
  { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
  { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { name: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-sonnet-4-20250514' },
  { name: 'Ollama (本地)', baseUrl: 'http://localhost:11434/v1', model: 'llama3' },
  { name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', model: 'openai/gpt-4o' },
  { name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
]

function applyPreset(preset: { name: string; baseUrl: string; model: string }) {
  customName.value = preset.name
  customBaseUrl.value = preset.baseUrl
  customModel.value = preset.model
}

async function testConnection() {
  testing.value = true
  testResult.value = null

  const config = providerMode.value === 'custom'
    ? { baseUrl: customBaseUrl.value, apiKey: customApiKey.value, model: customModel.value }
    : chatStore.getActiveConfig()

  if (!config.apiKey) {
    testResult.value = { ok: false, message: '请先填写 API Key' }
    testing.value = false
    return
  }

  if (!config.baseUrl) {
    testResult.value = { ok: false, message: '请先填写 API Base URL' }
    testing.value = false
    return
  }

  try {
    // 开发模式下通过 Vite 代理避免 CORS
    const isDev = import.meta.env?.DEV ?? false
    let fetchUrl = `${config.baseUrl}/chat/completions`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    }
    if (isDev && config.baseUrl.startsWith('http')) {
      headers['x-proxy-target'] = config.baseUrl
      fetchUrl = '/proxy/custom/chat/completions'
    }

    const r = await fetch(fetchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (r.ok) {
      const data = await r.json()
      const model = data?.model || config.model || '未知'
      testResult.value = { ok: true, message: `连接成功! 模型: ${model}` }
    } else if (r.status === 401) {
      testResult.value = { ok: false, message: 'API Key 无效 (401 Unauthorized)' }
    } else if (r.status === 404) {
      testResult.value = { ok: false, message: 'API 地址错误，端点不存在 (404)' }
    } else {
      let errText = ''
      try { errText = await r.text() } catch {}
      testResult.value = { ok: false, message: `HTTP ${r.status}: ${errText.slice(0, 120)}` }
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS')) {
      testResult.value = { ok: false, message: '网络错误（可能是跨域限制）。请检查 API 地址是否正确，或在桌面版中测试。' }
    } else if (msg.includes('timeout') || msg.includes('abort')) {
      testResult.value = { ok: false, message: '连接超时，请检查 API 地址是否可访问。' }
    } else {
      testResult.value = { ok: false, message: `连接失败: ${msg}` }
    }
  }
  testing.value = false
}

function saveModelSettings() {
  if (providerMode.value === 'custom') {
    chatStore.setCustomProvider({
      name: customName.value,
      baseUrl: customBaseUrl.value,
      apiKey: customApiKey.value,
      model: customModel.value,
    })
  }
  chatStore.setProviderMode(providerMode.value)
}

const featuredModels = computed(() => {
  return models.value.filter(m => m.is_featured && m.is_available)
})

function formatContext(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(0)}M`
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`
  return tokens.toString()
}

async function handleLogin() {
  await gfwStore.login(email.value, password.value)
  await gfwStore.fetchUserInfo()
  await gfwStore.fetchModels()
  await gfwStore.fetchApiKeys()
  await gfwStore.fetchDailyUsage()
  await gfwStore.fetchRechargePackages()
}

function logout() {
  gfwStore.logout()
}

async function createKey() {
  await gfwStore.createApiKey(newKeyName.value || 'Desktop Key', newKeyLimit.value)
  showCreateKey.value = false
  newKeyName.value = ''
}

function saveSettings() {
  saveModelSettings()
}

onMounted(async () => {
  if (isLoggedIn.value) {
    await gfwStore.fetchUserInfo()
    await gfwStore.fetchModels()
    await gfwStore.fetchApiKeys()
    await gfwStore.fetchDailyUsage()
    await gfwStore.fetchRechargePackages()
  }
})
</script>

<style scoped>
.settings-view {
  height: 100%;
  overflow: hidden;
}

.settings-layout {
  display: flex;
  height: 100%;
}

/* ===== Left Nav ===== */
.settings-nav {
  width: 200px;
  min-width: 200px;
  background: var(--color-bg-card);
  border-right: 1px solid var(--color-border);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}

.settings-nav-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  padding: 0 20px 20px;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  border-left: 3px solid transparent;
}

.settings-nav-item:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.settings-nav-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 600;
}

/* ===== Right Content ===== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.content-section {
  max-width: 800px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

/* ===== Card ===== */
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.card-body {
  padding: 24px;
}

.card-body.no-padding {
  padding: 0;
}

/* ===== Form ===== */
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-label {
  width: 120px;
  min-width: 120px;
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.form-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-bg-card);
  transition: border-color 0.2s;
  outline: none;
}

.form-input:hover {
  border-color: var(--color-primary);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 112, 255, 0.1);
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-input-wrap {
  flex: 1;
}

.form-select {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-bg-card);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2386909C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  transition: border-color 0.2s;
  outline: none;
}

.form-select:hover {
  border-color: var(--color-primary);
}

.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 112, 255, 0.1);
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

/* Toggle switch */
.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 40px;
  height: 22px;
  background: var(--color-border);
  border-radius: 11px;
  transition: background 0.2s;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #FFFFFF;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.toggle input:checked + .toggle-slider {
  background: var(--color-primary);
}

.toggle input:checked + .toggle-slider::after {
  transform: translateX(18px);
}

.toggle-text {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* ===== Buttons ===== */
.btn-primary {
  padding: 8px 24px;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-btn);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 2px 8px rgba(0, 112, 255, 0.25);
}

.btn-primary:disabled {
  background: var(--color-bg-input);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  padding: 8px 24px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-btn);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--color-primary-light);
}

.btn-danger-outline {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid var(--color-error);
  border-radius: var(--radius-btn);
  color: var(--color-error);
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger-outline:hover {
  background: #FFECE8;
}

/* ===== User profile ===== */
.user-profile-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.user-avatar {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  border-radius: 50%;
  color: var(--color-primary);
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-group {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

.stats-grid {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-value.primary {
  color: var(--color-primary);
}

/* ===== Data table ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: var(--color-bg-page);
  border-bottom: 1px solid var(--color-border);
}

.data-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: var(--color-bg-page);
}

.cell-name {
  font-weight: 600;
}

.cell-mono {
  font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.cell-cost {
  font-weight: 600;
  color: var(--color-primary);
}

.empty-cell {
  text-align: center !important;
  color: var(--color-text-tertiary);
  padding: 32px 16px !important;
}

/* Status tag */
.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.active {
  background: #E8FFEA;
  color: var(--color-success);
}

.status-tag.inactive {
  background: #FFECE8;
  color: var(--color-error);
}

/* ===== Packages ===== */
.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.package-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 24px 20px;
  text-align: center;
  position: relative;
  transition: all 0.2s;
  box-shadow: var(--shadow-card);
}

.package-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.package-card.recommended {
  border-color: var(--color-primary);
  border-width: 2px;
}

.package-badge {
  position: absolute;
  top: -1px;
  right: 16px;
  background: var(--color-primary);
  color: #FFFFFF;
  padding: 3px 12px;
  border-radius: 0 0 6px 6px;
  font-size: 11px;
  font-weight: 600;
}

.package-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.package-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 16px;
  line-height: 1.4;
}

.package-price {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.package-amount {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.package-bonus {
  font-size: 13px;
  color: var(--color-warning);
  font-weight: 500;
  margin-bottom: 16px;
}

.package-btn {
  width: 100%;
  margin-top: 12px;
}
/* ===== Provider Tabs ===== */
.provider-tabs {
  display: flex;
  gap: 12px;
}

.provider-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 14px 20px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s;
}

.provider-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.provider-tab.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.card-header-tag {
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.card-header-tag.default {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.card-header-tag.custom {
  background: #F0EAFF;
  color: var(--color-accent);
}

[data-theme="dark"] .card-header-tag.custom {
  background: #1E1640;
}

.hint-text {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 20px;
  line-height: 1.6;
}

/* Presets */
.presets-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.presets-label {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-right: 4px;
}

.preset-btn {
  padding: 4px 12px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.15s;
}

.preset-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

/* Test connection */
.test-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.test-result {
  font-size: 13px;
  font-weight: 500;
}

.test-result.success { color: var(--color-success); }
.test-result.error { color: var(--color-error); }

</style>
