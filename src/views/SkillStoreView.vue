<template>
  <div class="skill-store">
    <h1>2x Skill 商店</h1>

    <!-- 登录状态 -->
    <div v-if="!isLoggedIn" class="login-section">
      <div class="login-tabs">
        <button :class="{ active: loginMethod === 'email' }" @click="loginMethod = 'email'">邮箱登录</button>
        <button :class="{ active: loginMethod === 'phone' }" @click="loginMethod = 'phone'">手机登录</button>
      </div>
      <div class="login-form">
        <input v-if="loginMethod === 'email'" v-model="email" type="email" placeholder="邮箱" />
        <input v-if="loginMethod === 'phone'" v-model="phone" type="tel" placeholder="手机号" />
        <input v-model="password" type="password" placeholder="密码" />
        <button @click="handleLogin" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>

    <div v-else>
      <!-- 用户信息 -->
      <div class="user-bar">
        <span>欢迎, {{ profile?.nickname || profile?.username }}</span>
        <button @click="logout" class="logout-btn">登出</button>
      </div>

      <!-- 搜索和筛选 -->
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="搜索 Skill..." @input="debounceSearch" />
        <select v-model="selectedCategory" @change="loadSkills">
          <option value="">全部分类</option>
          <option value="automation">Automation</option>
          <option value="ai">AI</option>
          <option value="data">Data</option>
          <option value="devops">DevOps</option>
          <option value="creative">Creative</option>
        </select>
        <select v-model="sortBy" @change="loadSkills">
          <option value="downloads">下载量</option>
          <option value="rating">评分</option>
          <option value="favorites">收藏</option>
          <option value="latest">最新</option>
        </select>
      </div>

      <!-- 排行榜切换 -->
      <div class="tabs">
        <button :class="{ active: activeTab === 'skills' }" @click="activeTab = 'skills'">技能市场</button>
        <button :class="{ active: activeTab === 'workflows' }" @click="activeTab = 'workflows'">工作流市场</button>
        <button :class="{ active: activeTab === 'rankings' }" @click="activeTab = 'rankings'">排行榜</button>
        <button :class="{ active: activeTab === 'my' }" @click="activeTab = 'my'">我的</button>
      </div>

      <!-- 技能列表 -->
      <div v-if="activeTab === 'skills'" class="skill-grid">
        <div v-for="skill in skills" :key="skill.id" class="skill-card">
          <div class="skill-header">
            <h3>{{ skill.name }}</h3>
            <span class="rating">⭐ {{ skill.average_rating.toFixed(1) }}</span>
          </div>
          <p class="skill-desc">{{ skill.summary }}</p>
          <div class="skill-meta">
            <span class="category">{{ skill.category }}</span>
            <span>📥 {{ skill.total_downloads.toLocaleString() }}</span>
            <span>❤️ {{ skill.total_favorites.toLocaleString() }}</span>
          </div>
          <div class="skill-tags">
            <span v-for="tag in skill.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="skill-actions">
            <button @click="toggleFavoriteSkill(skill.slug)" class="fav-btn">
              {{ skillFavorited(skill.id) ? '❤️ 已收藏' : '🤍 收藏' }}
            </button>
            <button @click="downloadSkill(skill.slug)" class="download-btn">下载</button>
          </div>
        </div>
      </div>

      <!-- 工作流列表 -->
      <div v-if="activeTab === 'workflows'" class="workflow-grid">
        <div v-for="wf in workflows" :key="wf.id" class="workflow-card">
          <h3>{{ wf.name }}</h3>
          <p>{{ wf.summary }}</p>
          <div class="wf-meta">
            <span>{{ wf.category }}</span>
            <span>📥 {{ wf.downloads }}</span>
            <span>⭐ {{ wf.stars }}</span>
            <span>🔄 {{ wf.executions }} 次执行</span>
          </div>
        </div>
      </div>

      <!-- 排行榜 -->
      <div v-if="activeTab === 'rankings'" class="rankings">
        <div class="ranking-tabs">
          <button :class="{ active: rankingType === 'most_used' }" @click="rankingType = 'most_used'; loadRankings()">最多使用</button>
          <button :class="{ active: rankingType === 'highest_rated' }" @click="rankingType = 'highest_rated'; loadRankings()">最高评分</button>
          <button :class="{ active: rankingType === 'latest' }" @click="rankingType = 'latest'; loadRankings()">最新发布</button>
        </div>
        <table class="ranking-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>名称</th>
              <th>得分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rankings" :key="r.skill_id">
              <td class="rank">#{{ r.rank }}</td>
              <td>{{ r.name }}</td>
              <td>{{ r.score.toFixed(0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 我的 -->
      <div v-if="activeTab === 'my'" class="my-section">
        <div class="my-tabs">
          <button :class="{ active: myTab === 'skills' }" @click="myTab = 'skills'; loadMySkills()">我的技能</button>
          <button :class="{ active: myTab === 'favorites' }" @click="myTab = 'favorites'; loadMyFavorites()">我的收藏</button>
          <button :class="{ active: myTab === 'downloads' }" @click="myTab = 'downloads'; loadMyDownloads()">我的下载</button>
        </div>
        <div v-if="myTab === 'skills'">
          <div v-for="s in mySkills" :key="s.id" class="my-item">
            <span>{{ s.name }}</span>
            <span>v{{ s.current_version }}</span>
            <span>📥 {{ s.total_downloads }}</span>
          </div>
        </div>
        <div v-if="myTab === 'favorites'">
          <div v-for="s in myFavorites" :key="s.id" class="my-item">
            <span>{{ s.name }}</span>
            <span>⭐ {{ s.average_rating.toFixed(1) }}</span>
          </div>
        </div>
        <div v-if="myTab === 'downloads'">
          <div v-for="d in myDownloads" :key="d.skill_id" class="my-item">
            <span>{{ d.skill_name }}</span>
            <span>{{ new Date(d.downloaded_at).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TwoXSkill, TwoXWorkflow, TwoXRanking, TwoXDownload } from '@/types'
import * as api from '@/api'

const isLoggedIn = ref(false)
const loginMethod = ref<'email' | 'phone'>('email')
const email = ref('')
const phone = ref('')
const password = ref('')
const loading = ref(false)
const profile = ref<{ nickname?: string; username: string } | null>(null)

const activeTab = ref('skills')
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('downloads')
const skills = ref<TwoXSkill[]>([])
const workflows = ref<TwoXWorkflow[]>([])

const rankingType = ref<'most_used' | 'highest_rated' | 'latest'>('most_used')
const rankings = ref<TwoXRanking[]>([])

const myTab = ref('skills')
const mySkills = ref<TwoXSkill[]>([])
const myFavorites = ref<TwoXSkill[]>([])
const myDownloads = ref<TwoXDownload[]>([])
const favoritedIds = ref<Set<number>>(new Set())

let searchTimeout: ReturnType<typeof setTimeout> | null = null

function debounceSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => loadSkills(), 300)
}

function skillFavorited(id: number) {
  return favoritedIds.value.has(id)
}

async function handleLogin() {
  loading.value = true
  try {
    if (loginMethod.value === 'email') {
      await api.twoXEmailLogin(email.value, password.value)
    } else {
      await api.twoXPhoneLogin(phone.value, password.value)
    }
    isLoggedIn.value = true
    await loadProfile()
    await loadSkills()
  } catch (e: unknown) {
    alert(e instanceof Error ? e.message : String(e))
  } finally {
    loading.value = false
  }
}

function logout() {
  isLoggedIn.value = false
  profile.value = null
}

async function loadProfile() {
  try {
    profile.value = await api.twoXGetProfile()
  } catch {
    // ignore
  }
}

async function loadSkills() {
  try {
    const resp = await api.twoXGetSkills(
      searchQuery.value || undefined,
      selectedCategory.value || undefined,
      undefined,
      sortBy.value,
      50,
      0,
    )
    skills.value = resp.skills
  } catch (e: unknown) {
    console.error('Failed to load skills:', e)
  }
}

async function loadWorkflows() {
  try {
    const resp = await api.twoXGetWorkflows(1, 50)
    workflows.value = resp.workflows
  } catch {
    // ignore
  }
}

async function loadRankings() {
  try {
    const resp = await api.twoXGetRankings(rankingType.value)
    rankings.value = resp.rankings
  } catch {
    // ignore
  }
}

async function loadMySkills() {
  try {
    const resp = await api.twoXGetMySkills()
    mySkills.value = resp.skills
  } catch {
    // ignore
  }
}

async function loadMyFavorites() {
  try {
    const resp = await api.twoXGetFavorites()
    myFavorites.value = resp.skills
    favoritedIds.value = new Set(resp.skills.map(s => s.id))
  } catch {
    // ignore
  }
}

async function loadMyDownloads() {
  try {
    const resp = await api.twoXGetDownloads()
    myDownloads.value = resp.downloads
  } catch {
    // ignore
  }
}

async function toggleFavoriteSkill(slug: string) {
  try {
    const favorited = await api.twoXToggleFavorite(slug)
    // Refresh skills to update state
    await loadSkills()
  } catch (e: unknown) {
    alert(e instanceof Error ? e.message : String(e))
  }
}

async function downloadSkill(slug: string) {
  try {
    const url = await api.twoXGetDownloadUrl(slug)
    window.open(url, '_blank')
  } catch (e: unknown) {
    alert(e instanceof Error ? e.message : String(e))
  }
}

onMounted(async () => {
  // Load public data first
  await loadSkills()
  await loadRankings()
})
</script>

<style scoped>
.skill-store {
  padding: 30px;
  overflow-y: auto;
  height: 100%;
}

h1 { color: #00d4ff; margin-bottom: 20px; }

.login-section {
  background: #16213e;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.login-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.login-tabs button {
  flex: 1;
  padding: 10px;
  background: #2a2a4a;
  border: none;
  border-radius: 6px;
  color: #888;
  cursor: pointer;
}

.login-tabs button.active {
  background: #0a84ff;
  color: white;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-form input {
  padding: 12px;
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 6px;
  color: #e0e0e0;
}

.login-form button {
  padding: 12px;
  background: #0a84ff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.user-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logout-btn {
  padding: 8px 16px;
  background: #ff1744;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 12px;
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 8px;
  color: #e0e0e0;
}

.search-bar select {
  padding: 12px;
  background: #2a2a4a;
  border: 1px solid #3a3a5a;
  border-radius: 8px;
  color: #e0e0e0;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  background: #2a2a4a;
  border: none;
  border-radius: 6px;
  color: #888;
  cursor: pointer;
}

.tabs button.active {
  background: #0a84ff;
  color: white;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.skill-card {
  background: #16213e;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s;
}

.skill-card:hover { transform: translateY(-2px); }

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.skill-header h3 { margin: 0; }
.rating { color: #ffa500; }

.skill-desc { color: #aaa; margin-bottom: 12px; min-height: 40px; }

.skill-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 8px;
}

.category { color: #00d4ff; }

.skill-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.tag {
  background: #2a2a4a;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #aaa;
}

.skill-actions { display: flex; gap: 10px; }

.fav-btn, .download-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.fav-btn { background: #2a2a4a; color: #e0e0e0; }
.download-btn { background: #0a84ff; color: white; }

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.workflow-card {
  background: #16213e;
  border-radius: 12px;
  padding: 20px;
}

.wf-meta {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: #888;
  margin-top: 10px;
}

.ranking-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.ranking-tabs button {
  padding: 8px 16px;
  background: #2a2a4a;
  border: none;
  border-radius: 6px;
  color: #888;
  cursor: pointer;
}

.ranking-tabs button.active {
  background: #0a84ff;
  color: white;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table th, .ranking-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #2a2a4a;
}

.ranking-table th { color: #888; font-weight: normal; }
.rank { color: #ffa500; font-weight: bold; }

.my-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.my-tabs button {
  padding: 8px 16px;
  background: #2a2a4a;
  border: none;
  border-radius: 6px;
  color: #888;
  cursor: pointer;
}

.my-tabs button.active {
  background: #0a84ff;
  color: white;
}

.my-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #2a2a4a;
}
</style>
