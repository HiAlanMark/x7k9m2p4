<template>
  <div class="settings-view">
    <h1>设置</h1>

    <!-- gfw.net 账户 -->
    <section class="settings-section">
      <h2>gfw.net 账户</h2>
      <div v-if="!isLoggedIn" class="login-form">
        <input v-model="email" type="email" placeholder="邮箱" />
        <input v-model="password" type="password" placeholder="密码" />
        <button @click="handleLogin" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
      <div v-else class="user-info">
        <div class="user-header">
          <span>{{ user?.nickname || user?.email }}</span>
          <button @click="logout" class="logout-btn">登出</button>
        </div>
        <div class="stats">
          <div class="stat">
            <span class="label">余额</span>
            <span class="value">{{ balance?.toFixed(2) }} G币</span>
          </div>
          <div class="stat">
            <span class="label">用户组</span>
            <span class="value">{{ userInfo?.group_name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 模型设置 -->
    <section class="settings-section">
      <h2>模型设置</h2>
      <div class="form-group">
        <label>默认模型</label>
        <select v-model="selectedModel">
          <option v-for="m in featuredModels" :key="m.id" :value="m.id">
            {{ m.name }} ({{ m.provider }}) - 上下文 {{ formatContext(m.context_window) }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>上下文长度</label>
        <input v-model.number="contextLength" type="number" />
      </div>
      <div class="form-group">
        <label>
          <input v-model="streaming" type="checkbox" />
          启用流式输出
        </label>
      </div>
    </section>

    <!-- API Key 管理 -->
    <section class="settings-section">
      <h2>API Key 管理</h2>
      <div class="api-keys">
        <div v-for="key in apiKeys.slice(0, 10)" :key="key.id" class="api-key-item">
          <div class="key-info">
            <span class="key-name">{{ key.name }}</span>
            <span class="key-prefix">{{ key.key_prefix }}</span>
          </div>
          <div class="key-meta">
            <span>限额: {{ key.gcoin_limit || '无' }} G币</span>
            <span>已用: {{ key.used_quota.toFixed(4) }}</span>
            <span :class="['status', key.is_active ? 'active' : 'inactive']">
              {{ key.is_active ? '启用' : '已停用' }}
            </span>
          </div>
        </div>
      </div>
      <button @click="showCreateKey = !showCreateKey">+ 创建新 Key</button>
      <div v-if="showCreateKey" class="create-key-form">
        <input v-model="newKeyName" placeholder="Key 名称" />
        <input v-model.number="newKeyLimit" type="number" placeholder="G 币限额" />
        <button @click="createKey">创建</button>
      </div>
    </section>

    <!-- 用量统计 -->
    <section class="settings-section">
      <h2>用量统计 (近 7 天)</h2>
      <table class="usage-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>请求数</th>
            <th>输入 Token</th>
            <th>输出 Token</th>
            <th>费用</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in dailyUsage" :key="u.date">
            <td>{{ u.date }}</td>
            <td>{{ u.request_count }}</td>
            <td>{{ u.input_tokens.toLocaleString() }}</td>
            <td>{{ u.output_tokens.toLocaleString() }}</td>
            <td>{{ u.total_cost.toFixed(4) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 充值 -->
    <section class="settings-section">
      <h2>充值</h2>
      <div class="packages">
        <div v-for="pkg in rechargePackages" :key="pkg.id" class="package-card">
          <h3>{{ pkg.name }}</h3>
          <p>{{ pkg.description }}</p>
          <div class="price">¥{{ pkg.price }}</div>
          <div class="amount">{{ pkg.gcoin_amount }} G币</div>
          <div v-if="pkg.bonus_gcoin > 0" class="bonus">+{{ pkg.bonus_gcoin }} 赠送</div>
          <span v-if="pkg.badge" class="badge">{{ pkg.badge }}</span>
        </div>
      </div>
    </section>

    <!-- 保存按钮 -->
    <div class="actions">
      <button @click="saveSettings" class="save-btn">保存设置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGfwStore } from '../stores/gfw'
import { useChatStore } from '../stores/chat'
import { storeToRefs } from 'pinia'

const gfwStore = useGfwStore()
const chatStore = useChatStore()

const { isLoggedIn, user, balance, models, apiKeys, dailyUsage, rechargePackages, loading } = storeToRefs(gfwStore)
const { selectedModel } = storeToRefs(chatStore)

const email = ref('')
const password = ref('')
const contextLength = ref(128000)
const streaming = ref(true)
const showCreateKey = ref(false)
const newKeyName = ref('')
const newKeyLimit = ref(50)
const userInfo = ref<{ group_name: string } | null>(null)

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
  // Save to config
  chatStore.selectedModel = selectedModel.value
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
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
  overflow-y: auto;
  height: 100%;
}

h1 { color: #00d4ff; margin-bottom: 30px; }
h2 { color: #e0e0e0; margin-bottom: 16px; font-size: 1.1rem; }

.settings-section {
  background: #16213e;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.login-form input {
  padding: 10px;
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 6px;
  color: #e0e0e0;
}

.login-form button, button {
  padding: 10px 20px;
  background: #0a84ff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.logout-btn { background: #ff1744; }

.stats { display: flex; gap: 20px; }
.stat { display: flex; flex-direction: column; }
.stat .label { font-size: 0.85rem; color: #888; }
.stat .value { color: #00d4ff; font-weight: bold; }

.form-group {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group label { min-width: 100px; }

.form-group select, .form-group input[type="number"] {
  padding: 8px;
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 6px;
  color: #e0e0e0;
}

.api-key-item {
  background: #2a2a4a;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.key-info { display: flex; justify-content: space-between; margin-bottom: 4px; }
.key-name { font-weight: bold; }
.key-prefix { font-family: monospace; color: #888; }
.key-meta { display: flex; gap: 16px; font-size: 0.85rem; color: #aaa; }
.key-meta .status.active { color: #00c853; }
.key-meta .status.inactive { color: #ff1744; }

.create-key-form {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  padding: 12px;
  background: #2a2a4a;
  border-radius: 8px;
}

.create-key-form input {
  padding: 8px;
  background: #1a1a2e;
  border: 1px solid #3a3a5a;
  border-radius: 6px;
  color: #e0e0e0;
}

.usage-table {
  width: 100%;
  border-collapse: collapse;
}

.usage-table th, .usage-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #2a2a4a;
}

.usage-table th { color: #888; font-weight: normal; font-size: 0.85rem; }

.packages { display: flex; gap: 16px; flex-wrap: wrap; }

.package-card {
  background: #2a2a4a;
  padding: 20px;
  border-radius: 12px;
  min-width: 200px;
  text-align: center;
}

.package-card .price { font-size: 1.5rem; color: #00d4ff; margin: 10px 0; }
.package-card .amount { color: #aaa; }
.package-card .bonus { color: #ffa500; font-size: 0.9rem; }
.package-card .badge {
  display: inline-block;
  background: #ff1744;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-top: 8px;
}

.actions { margin-top: 20px; text-align: center; }
.save-btn {
  padding: 12px 40px;
  background: #00c853;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}
</style>
