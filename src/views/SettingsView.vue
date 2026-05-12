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
                  <span>GFW.NET 内置</span>
                </button>
                <button
                  :class="['provider-tab', { active: providerMode === 'custom' }]"
                  @click="providerMode = 'custom'; chatStore.setProviderMode('custom')"
                >
                  <IconSettings :size="16" />
                  <span>自定义提供商</span>
                </button>
              </div>
            </div>
          </div>

          <!-- GFW.NET 模式 -->
          <div v-if="providerMode === 'gfw'" class="card">
            <div class="card-header">
              <span class="card-header-tag default">GFW.NET</span>
              <span>内置模型服务</span>
            </div>
            <div class="card-body">
              <div class="form-row">
                <label class="form-label">GFW API Key</label>
                <input v-model="gfwApiKey" type="password" placeholder="gfw-..." class="form-input" />
                <p class="form-hint">在 gfw.net 控制台获取 API Key</p>
              </div>

              <div class="form-row">
                <label class="form-label">
                  提供商
                  <button class="sync-btn" @click="syncGfwModels" :disabled="gfwSyncing" title="从 GFW.NET 同步模型列表">
                    {{ gfwSyncing ? '同步中...' : '同步' }}
                  </button>
                </label>
                <div v-if="gfwProviders.length > 0" class="provider-chips">
                  <button
                    :class="['chip', { active: !selectedProvider }]"
                    @click="selectedProvider = ''"
                  >全部</button>
                  <button
                    v-for="p in gfwProviders"
                    :key="p"
                    :class="['chip', { active: selectedProvider === p }]"
                    @click="selectedProvider = p"
                  >{{ p }} <span class="chip-count">{{ providerModelCount(p) }}</span></button>
                </div>
                <p v-else class="form-hint">点击「同步」获取提供商列表</p>
              </div>

              <div class="form-row">
                <label class="form-label">模型</label>
                <select v-model="selectedModel" class="form-select" v-if="filteredGfwModels.length > 0">
                  <option v-for="m in filteredGfwModels" :key="m.model_code" :value="m.model_code">
                    {{ m.model_name }}{{ !selectedProvider ? ' (' + m.provider + ')' : '' }} {{ m.input_price ? '¥' + m.input_price + '/M' : '' }}
                  </option>
                </select>
                <input v-else v-model="selectedModel" type="text" placeholder="输入模型名称" class="form-input" />
              </div>

              <!-- 当前选中模型的详情 -->
              <div v-if="selectedGfwModel" class="model-detail">
                <div class="detail-row">
                  <span class="detail-label">provider</span>
                  <span class="detail-value">{{ selectedGfwModel.provider }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">model</span>
                  <span class="detail-value">{{ selectedGfwModel.model_code }}</span>
                </div>
                <div class="detail-row" v-if="selectedGfwModel.input_price">
                  <span class="detail-label">price</span>
                  <span class="detail-value">¥{{ selectedGfwModel.input_price }}/M in · ¥{{ selectedGfwModel.output_price }}/M out</span>
                </div>
                <div class="detail-row" v-if="selectedGfwModel.context_length">
                  <span class="detail-label">context</span>
                  <span class="detail-value">{{ formatContext(selectedGfwModel.context_length) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 自定义提供商模式 -->
          <div v-if="providerMode === 'custom'" class="card">
            <div class="card-header">
              <span class="card-header-tag custom">自定义</span>
              <span>自定义 API 提供商</span>
            </div>
            <div class="card-body">
              <!-- 上游选择 -->
              <div class="form-row">
                <label class="form-label">上游提供商</label>
                <div class="provider-chips">
                  <button
                    v-for="preset in providerPresets"
                    :key="preset.name"
                    :class="['chip', { active: customUpstream === preset.name }]"
                    @click="selectUpstream(preset)"
                  >{{ preset.name }}</button>
                  <button
                    :class="['chip', { active: customUpstream === '__manual__' }]"
                    @click="customUpstream = '__manual__'"
                  >手动输入</button>
                </div>
              </div>

              <div class="form-row" v-if="customUpstream === '__manual__'">
                <label class="form-label">提供商名称</label>
                <input v-model="customName" type="text" placeholder="my-provider" class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">API Base URL</label>
                <input v-model="customBaseUrl" type="text" placeholder="https://api.openai.com/v1" class="form-input" :disabled="customUpstream !== '__manual__'" />
              </div>
              <div class="form-row">
                <label class="form-label">API Key</label>
                <input v-model="customApiKey" type="password" placeholder="sk-..." class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">
                  模型
                  <button
                    v-if="customUpstream !== '__manual__'"
                    class="sync-btn"
                    @click="fetchUpstreamModels"
                    :disabled="upstreamModelsSyncing"
                  >{{ upstreamModelsSyncing ? '获取中...' : '获取模型列表' }}</button>
                </label>
                <select v-if="upstreamModels.length > 0" v-model="customModel" class="form-select">
                  <option v-for="m in upstreamModels" :key="m" :value="m">{{ m }}</option>
                </select>
                <input v-else v-model="customModel" type="text" placeholder="gpt-4o / deepseek-chat / qwen-plus" class="form-input" />
                <p v-if="upstreamModelsError" class="form-hint" style="color: var(--color-error);">{{ upstreamModelsError }}</p>
              </div>
              <div class="form-row">
                <label class="form-label">上下文长度</label>
                <input v-model.number="contextLength" type="number" class="form-input" style="max-width: 200px;" />
              </div>
            </div>
          </div>

          <!-- 连接测试 + 保存 -->
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
            <span v-if="saveSuccess" class="save-feedback">设置已保存</span>
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
const saveSuccess = ref(false)

// GFW 模型列表
const gfwApiKey = ref(localStorage.getItem('gfw_api_key') || '')
const gfwModels = ref<any[]>([])
const gfwSyncing = ref(false)
const selectedProvider = ref('')

const selectedGfwModel = computed(() => {
  return gfwModels.value.find(m => m.model_code === selectedModel.value) || null
})

// 从模型列表提取去重的提供商列表
const gfwProviders = computed(() => {
  const set = new Set<string>()
  gfwModels.value.forEach(m => { if (m.provider) set.add(m.provider) })
  return Array.from(set).sort()
})

// 按选中的提供商筛选模型
const filteredGfwModels = computed(() => {
  if (!selectedProvider.value) return gfwModels.value
  return gfwModels.value.filter(m => m.provider === selectedProvider.value)
})

// 统计每个提供商的模型数量
function providerModelCount(provider: string): number {
  return gfwModels.value.filter(m => m.provider === provider).length
}

async function syncGfwModels() {
  gfwSyncing.value = true
  try {
    const isDev = import.meta.env?.DEV ?? false
    const base = isDev ? '/proxy/gfw/api/v1' : 'https://api.gfw.net/api/v1'
    const r = await fetch(`${base}/models`)
    const body = await r.json()
    gfwModels.value = (body.data?.models || []).sort((a: any, b: any) => {
      // featured 优先，然后按 provider 分组
      if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1
      return (a.provider || '').localeCompare(b.provider || '')
    })
    localStorage.setItem('gfw_models_cache', JSON.stringify(gfwModels.value))
  } catch (e) {
    console.error('同步模型失败:', e)
  } finally {
    gfwSyncing.value = false
  }
}

// 从缓存加载 GFW 模型列表
try {
  const cached = localStorage.getItem('gfw_models_cache')
  if (cached) gfwModels.value = JSON.parse(cached)
} catch { /* ignore */ }

// 预设提供商（对齐 Hermes Agent 支持的上游列表）
const providerPresets = [
  { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
  { name: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-sonnet-4-20250514' },
  { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { name: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-pro' },
  { name: 'xAI / Grok', baseUrl: 'https://api.x.ai/v1', model: 'grok-3' },
  { name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', model: 'openai/gpt-4o' },
  { name: 'Qwen (DashScope)', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  { name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  { name: 'Hugging Face', baseUrl: 'https://api-inference.huggingface.co/v1', model: 'meta-llama/Llama-3.3-70B-Instruct' },
  { name: 'MiniMax', baseUrl: 'https://api.minimax.chat/v1', model: 'MiniMax-M1' },
  { name: 'Kimi / Moonshot', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-auto' },
  { name: 'Z.AI / GLM', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-plus' },
  { name: 'Ollama (本地)', baseUrl: 'http://localhost:11434/v1', model: 'llama3' },
]

const customUpstream = ref<string>(
  providerPresets.find(p => p.name === customProvider.value.name)?.name || '__manual__'
)

// 实时从上游 /models 接口获取的模型列表
const upstreamModels = ref<string[]>([])
const upstreamModelsSyncing = ref(false)
const upstreamModelsError = ref('')

async function fetchUpstreamModels() {
  const baseUrl = customBaseUrl.value
  const apiKey = customApiKey.value
  if (!baseUrl) { upstreamModelsError.value = '请先填写 API Base URL'; return }
  if (!apiKey) { upstreamModelsError.value = '请先填写 API Key'; return }

  upstreamModelsSyncing.value = true
  upstreamModelsError.value = ''

  try {
    const isDev = import.meta.env?.DEV ?? false
    let fetchUrl = `${baseUrl}/models`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
    }
    if (isDev && baseUrl.startsWith('http')) {
      headers['x-proxy-target'] = baseUrl
      fetchUrl = '/proxy/custom/models'
    }

    const r = await fetch(fetchUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    })
    if (!r.ok) {
      upstreamModelsError.value = `HTTP ${r.status}: 获取模型列表失败`
      return
    }
    const body = await r.json()
    const modelList: string[] = (body.data || [])
      .map((m: any) => m.id || m.model || '')
      .filter((id: string) => id)
      .sort()
    if (modelList.length === 0) {
      upstreamModelsError.value = '未获取到模型列表'
      return
    }
    upstreamModels.value = modelList
    // 如果当前选的模型不在列表中，自动选第一个
    if (!modelList.includes(customModel.value)) {
      customModel.value = modelList[0]
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    upstreamModelsError.value = `获取失败: ${msg}`
  } finally {
    upstreamModelsSyncing.value = false
  }
}

function selectUpstream(preset: { name: string; baseUrl: string; model: string }) {
  customUpstream.value = preset.name
  customName.value = preset.name
  customBaseUrl.value = preset.baseUrl
  customModel.value = preset.model
  // 切换上游时清空之前获取的模型列表
  upstreamModels.value = []
  upstreamModelsError.value = ''
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
  if (providerMode.value === 'gfw') {
    // 保存 GFW API Key
    localStorage.setItem('gfw_api_key', gfwApiKey.value)
  } else if (providerMode.value === 'custom') {
    chatStore.setCustomProvider({
      name: customName.value,
      baseUrl: customBaseUrl.value,
      apiKey: customApiKey.value,
      model: customModel.value,
    })
    chatStore.selectedModel = customModel.value
  }
  chatStore.setProviderMode(providerMode.value)
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 2000)
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
  background: var(--color-bg-page);
}

.settings-layout {
  display: flex;
  height: 100%;
}

/* ===== Left Nav ===== */
.settings-nav {
  width: 180px;
  min-width: 180px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border-right: 1px solid var(--glass-border);
  padding: 20px 0;
}

.settings-nav-title {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 16px 12px;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.1s;
  text-decoration: none;
  border-left: 2px solid transparent;
}

.settings-nav-item:hover {
  background: var(--color-bg-input);
  color: var(--color-text-primary);
}

.settings-nav-item.active {
  background: var(--color-bg-input);
  color: var(--color-text-primary);
  border-left-color: var(--color-text-primary);
  font-weight: 600;
}

/* ===== Right Content ===== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.content-section {
  max-width: 720px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.3px;
}

/* ===== Card ===== */
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(16px) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  overflow: hidden;
}

.card-body {
  padding: 16px 20px;
}

.card-body.no-padding {
  padding: 0;
}

/* ===== Form ===== */
.form-row {
  margin-bottom: 14px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 5px;
  font-family: var(--font-mono);
}

.form-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  background: var(--color-bg-input);
  transition: border-color 0.12s, box-shadow 0.12s;
  outline: none;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(10,132,255,0.08);
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-select {
  width: 100%;
  padding: 7px 28px 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  background: var(--color-bg-input);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  cursor: pointer;
  outline: none;
}

.form-select:focus {
  border-color: var(--color-text-tertiary);
}

.form-hint {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin: 3px 0 0;
}

.form-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}

/* ===== Buttons ===== */
.btn-primary {
  padding: 6px 16px;
  background: var(--color-text-primary);
  border: none;
  border-radius: 4px;
  color: var(--color-bg-page);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: opacity 0.12s;
}

.btn-primary:hover {
  opacity: 0.85;
}

.btn-primary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.12s;
}

.btn-secondary:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.btn-danger-outline {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-tertiary);
  font-size: 11px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.12s;
}

.btn-danger-outline:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

/* ===== User profile ===== */
.user-profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border);
}

.user-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-input);
  border-radius: 6px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.user-info { flex: 1; }

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-group {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-top: 1px;
}

.stats-grid {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 16px;
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
  padding: 8px 14px;
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--color-bg-input);
  border-bottom: 1px solid var(--color-border);
}

.data-table td {
  padding: 8px 14px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-subtle, var(--color-border));
}

.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: var(--color-bg-input); }

.cell-name { font-weight: 600; }
.cell-mono { color: var(--color-text-tertiary); }
.cell-cost { color: var(--color-primary); font-weight: 600; }
.empty-cell { text-align: center !important; color: var(--color-text-tertiary); padding: 24px 14px !important; }

/* Status tag */
.status-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
}

.status-tag.active { background: var(--color-bg-input); color: var(--color-success); }
.status-tag.inactive { background: var(--color-bg-input); color: var(--color-error); }

/* ===== Packages ===== */
.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.package-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 16px 14px;
  text-align: center;
  position: relative;
  transition: border-color 0.12s;
}

.package-card:hover { border-color: var(--color-text-tertiary); }
.package-card.recommended { border-color: var(--color-text-primary); border-width: 2px; }

.package-badge {
  position: absolute;
  top: -1px;
  right: 12px;
  background: var(--color-text-primary);
  color: var(--color-bg-page);
  padding: 2px 8px;
  border-radius: 0 0 4px 4px;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
}

.package-name { font-size: 14px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px; }
.package-desc { font-size: 11px; color: var(--color-text-tertiary); margin-bottom: 12px; line-height: 1.4; }
.package-price { font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 2px; }
.package-amount { font-family: var(--font-mono); font-size: 12px; color: var(--color-text-secondary); margin-bottom: 2px; }
.package-bonus { font-family: var(--font-mono); font-size: 11px; color: var(--color-warning); margin-bottom: 12px; }
.package-btn { width: 100%; margin-top: 8px; }

/* ===== Provider Tabs ===== */
.provider-tabs {
  display: flex;
  gap: 8px;
}

.provider-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  background: var(--color-bg-input);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.12s;
}

.provider-tab:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.provider-tab.active {
  border-color: var(--color-text-primary);
  background: var(--color-bg-input);
  color: var(--color-text-primary);
  font-weight: 600;
}

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.card-header-tag {
  font-family: var(--font-mono);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
}

.card-header-tag.default { background: var(--color-bg-input); color: var(--color-primary); }
.card-header-tag.custom { background: var(--color-bg-input); color: var(--color-accent); }

.hint-text {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-bottom: 14px;
  line-height: 1.5;
}

/* Presets */
.presets-section {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.presets-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-right: 4px;
}

.preset-btn {
  padding: 3px 10px;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  background: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.12s;
}

.preset-btn:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

/* Model detail */
.model-detail {
  margin-top: 10px;
  padding: 8px 12px;
  background: var(--color-bg-input);
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}

.detail-label { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-tertiary); }
.detail-value { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-primary); }

.sync-btn {
  margin-left: 8px;
  padding: 2px 8px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.12s;
}

.sync-btn:hover:not(:disabled) { border-color: var(--color-text-secondary); color: var(--color-text-primary); }
.sync-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* Test connection */
.test-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.test-result { font-family: var(--font-mono); font-size: 12px; font-weight: 500; }
.test-result.success { color: var(--color-success); }
.test-result.error { color: var(--color-error); }

.save-feedback {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-success);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Toggle */
.toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.toggle input { display: none; }
.toggle-slider { position: relative; width: 32px; height: 18px; background: var(--color-border); border-radius: 9px; transition: background 0.15s; }
.toggle-slider::after { content: ''; position: absolute; width: 14px; height: 14px; background: var(--color-bg-page); border-radius: 50%; top: 2px; left: 2px; transition: transform 0.15s; }
.toggle input:checked + .toggle-slider { background: var(--color-text-primary); }
.toggle input:checked + .toggle-slider::after { transform: translateX(14px); }
.toggle-text { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-tertiary); }

/* Scrollbar */
.settings-content::-webkit-scrollbar { width: 4px; }
.settings-content::-webkit-scrollbar-track { background: transparent; }
.settings-content::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

/* Provider chips */
.provider-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: var(--color-bg-input);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.1s;
}

.chip:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.chip.active {
  border-color: var(--color-text-primary);
  background: var(--color-bg-input);
  color: var(--color-text-primary);
  font-weight: 600;
}

.chip-count {
  font-size: 9px;
  color: var(--color-text-tertiary);
  font-weight: 400;
}

.model-select-group {
  width: 100%;
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
