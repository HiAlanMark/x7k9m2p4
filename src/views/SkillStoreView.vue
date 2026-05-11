<template>
  <div class="skill-store">
    <!-- Login section -->
    <div v-if="!isLoggedIn" class="login-section">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <IconStore :size="28" />
          </div>
          <h2 class="login-title">2x Skill 商店</h2>
          <p class="login-desc">登录以访问技能市场</p>
        </div>
        <div class="login-tabs">
          <button :class="['tab-btn', { active: loginMethod === 'email' }]" @click="loginMethod = 'email'">邮箱登录</button>
          <button :class="['tab-btn', { active: loginMethod === 'phone' }]" @click="loginMethod = 'phone'">手机登录</button>
        </div>
        <div class="login-form">
          <input v-if="loginMethod === 'email'" v-model="email" type="email" placeholder="请输入邮箱" class="form-input" />
          <input v-if="loginMethod === 'phone'" v-model="phone" type="tel" placeholder="请输入手机号" class="form-input" />
          <input v-model="password" type="password" placeholder="请输入密码" class="form-input" />
          <button @click="handleLogin" :disabled="loading" class="btn-primary login-submit">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="store-main">
      <!-- Top bar: user + search -->
      <div class="store-topbar">
        <div class="user-bar">
          <div class="user-info-inline">
            <div class="user-avatar-sm">
              <IconUser :size="16" />
            </div>
            <span class="user-name-sm">{{ profile?.nickname || profile?.username }}</span>
          </div>
          <button @click="logout" class="btn-text-danger">登出</button>
        </div>
      </div>

      <!-- Search area -->
      <div class="search-area">
        <div class="search-box">
          <span class="search-icon"><IconSearch :size="18" /></span>
          <input v-model="searchQuery" placeholder="搜索 Skill..." @input="debounceSearch" class="search-input" />
        </div>
        <div class="filter-row">
          <select v-model="selectedCategory" @change="loadSkills" class="filter-select">
            <option value="">全部分类</option>
            <option value="automation">Automation</option>
            <option value="ai">AI</option>
            <option value="data">Data</option>
            <option value="devops">DevOps</option>
            <option value="creative">Creative</option>
          </select>
          <select v-model="sortBy" @change="loadSkills" class="filter-select">
            <option value="downloads">下载量</option>
            <option value="rating">评分</option>
            <option value="favorites">收藏</option>
            <option value="latest">最新</option>
          </select>
        </div>
      </div>

      <!-- Main tabs -->
      <div class="main-tabs">
        <button :class="['main-tab', { active: activeTab === 'skills' }]" @click="activeTab = 'skills'">技能市场</button>
        <button :class="['main-tab', { active: activeTab === 'workflows' }]" @click="activeTab = 'workflows'">工作流市场</button>
        <button :class="['main-tab', { active: activeTab === 'rankings' }]" @click="activeTab = 'rankings'">排行榜</button>
        <button :class="['main-tab', { active: activeTab === 'my' }]" @click="activeTab = 'my'">我的</button>
      </div>

      <!-- Skills tab -->
      <div v-if="activeTab === 'skills'" class="tab-content">
        <div class="skill-grid">
          <div v-for="skill in skills" :key="skill.id" class="skill-card">
            <div class="skill-card-top">
              <div class="skill-icon-wrap">
                <IconStar :size="22" />
              </div>
              <div class="skill-info">
                <h3 class="skill-name">{{ skill.name }}</h3>
                <div class="skill-rating">
                  <IconStar :size="12" />
                  <span>{{ skill.average_rating.toFixed(1) }}</span>
                </div>
              </div>
            </div>
            <p class="skill-desc">{{ skill.summary }}</p>
            <div class="skill-meta">
              <span class="category-tag">{{ skill.category }}</span>
              <span class="meta-item">
                <IconDownload :size="12" />
                {{ skill.total_downloads.toLocaleString() }}
              </span>
              <span class="meta-item">
                <IconHeart :size="12" />
                {{ skill.total_favorites.toLocaleString() }}
              </span>
            </div>
            <div class="skill-tags">
              <span v-for="tag in skill.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="skill-actions">
              <button @click="toggleFavoriteSkill(skill.slug)" class="btn-icon-text">
                <IconHeart :size="14" />
                <span>{{ skillFavorited(skill.id) ? '已收藏' : '收藏' }}</span>
              </button>
              <button @click="downloadSkill(skill.slug)" class="btn-primary-sm">
                <IconDownload :size="14" />
                <span>下载</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Workflows tab -->
      <div v-if="activeTab === 'workflows'" class="tab-content">
        <div class="skill-grid">
          <div v-for="wf in workflows" :key="wf.id" class="skill-card">
            <div class="skill-card-top">
              <div class="skill-icon-wrap workflow-icon">
                <IconSettings :size="22" />
              </div>
              <div class="skill-info">
                <h3 class="skill-name">{{ wf.name }}</h3>
              </div>
            </div>
            <p class="skill-desc">{{ wf.summary }}</p>
            <div class="skill-meta">
              <span class="category-tag">{{ wf.category }}</span>
              <span class="meta-item">
                <IconDownload :size="12" />
                {{ wf.downloads }}
              </span>
              <span class="meta-item">
                <IconStar :size="12" />
                {{ wf.stars }}
              </span>
              <span class="meta-item">{{ wf.executions }} 次执行</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rankings tab -->
      <div v-if="activeTab === 'rankings'" class="tab-content">
        <div class="ranking-tabs">
          <button :class="['sub-tab', { active: rankingType === 'most_used' }]" @click="rankingType = 'most_used'; loadRankings()">最多使用</button>
          <button :class="['sub-tab', { active: rankingType === 'highest_rated' }]" @click="rankingType = 'highest_rated'; loadRankings()">最高评分</button>
          <button :class="['sub-tab', { active: rankingType === 'latest' }]" @click="rankingType = 'latest'; loadRankings()">最新发布</button>
        </div>
        <div class="ranking-card">
          <div class="ranking-list">
            <div v-for="r in rankings" :key="r.skill_id" class="ranking-item">
              <span :class="['rank-num', { top: r.rank <= 3 }]">#{{ r.rank }}</span>
              <span class="rank-name">{{ r.name }}</span>
              <span class="rank-score">{{ r.score.toFixed(0) }}</span>
            </div>
            <div v-if="!rankings || rankings.length === 0" class="empty-state">暂无排行数据</div>
          </div>
        </div>
      </div>

      <!-- My tab -->
      <div v-if="activeTab === 'my'" class="tab-content">
        <div class="my-tabs">
          <button :class="['sub-tab', { active: myTab === 'skills' }]" @click="myTab = 'skills'; loadMySkills()">我的技能</button>
          <button :class="['sub-tab', { active: myTab === 'favorites' }]" @click="myTab = 'favorites'; loadMyFavorites()">我的收藏</button>
          <button :class="['sub-tab', { active: myTab === 'downloads' }]" @click="myTab = 'downloads'; loadMyDownloads()">我的下载</button>
        </div>
        <div class="my-list-card">
          <div v-if="myTab === 'skills'">
            <div v-for="s in mySkills" :key="s.id" class="my-list-item">
              <div class="my-item-icon"><IconStar :size="16" /></div>
              <span class="my-item-name">{{ s.name }}</span>
              <span class="my-item-meta">v{{ s.current_version }}</span>
              <span class="my-item-meta">
                <IconDownload :size="12" />
                {{ s.total_downloads }}
              </span>
            </div>
            <div v-if="!mySkills || mySkills.length === 0" class="empty-state">暂无技能</div>
          </div>
          <div v-if="myTab === 'favorites'">
            <div v-for="s in myFavorites" :key="s.id" class="my-list-item">
              <div class="my-item-icon fav"><IconHeart :size="16" /></div>
              <span class="my-item-name">{{ s.name }}</span>
              <span class="my-item-meta">
                <IconStar :size="12" />
                {{ s.average_rating.toFixed(1) }}
              </span>
            </div>
            <div v-if="!myFavorites || myFavorites.length === 0" class="empty-state">暂无收藏</div>
          </div>
          <div v-if="myTab === 'downloads'">
            <div v-for="d in myDownloads" :key="d.skill_id" class="my-list-item">
              <div class="my-item-icon dl"><IconDownload :size="16" /></div>
              <span class="my-item-name">{{ d.skill_name }}</span>
              <span class="my-item-meta">{{ new Date(d.downloaded_at).toLocaleDateString() }}</span>
            </div>
            <div v-if="!myDownloads || myDownloads.length === 0" class="empty-state">暂无下载</div>
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
import IconStore from '../components/icons/IconStore.vue'
import IconUser from '../components/icons/IconUser.vue'
import IconSearch from '../components/icons/IconSearch.vue'
import IconStar from '../components/icons/IconStar.vue'
import IconSettings from '../components/icons/IconSettings.vue'
import IconDownload from '../components/icons/IconDownload.vue'
import IconHeart from '../components/icons/IconHeart.vue'

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
    profile.value = await api.twoXGetProfile() as { nickname?: string; username: string }
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
    await api.twoXToggleFavorite(slug)
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
  await loadSkills()
  await loadRankings()
  await loadWorkflows()
})
</script>

<style scoped>
.skill-store {
  height: 100%;
  overflow-y: auto;
  background: var(--color-bg-page);
}

/* ===== Login Section ===== */
.login-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 32px;
}

.login-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 40px 36px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.login-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 14px;
  color: #FFFFFF;
  margin: 0 auto 16px;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.login-desc {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.login-tabs {
  display: flex;
  background: var(--color-bg-input);
  border-radius: var(--radius-btn);
  padding: 3px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 8px 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--color-bg-card);
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-input {
  padding: 10px 14px;
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

.login-submit {
  margin-top: 4px;
  padding: 10px;
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
}

.btn-primary-sm {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-btn);
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary-sm:hover {
  background: var(--color-primary-dark);
}

.btn-icon-text {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon-text:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.btn-text-danger {
  padding: 4px 12px;
  background: transparent;
  border: none;
  color: var(--color-error);
  font-size: 13px;
  font-family: var(--font-family);
  cursor: pointer;
  transition: color 0.2s;
}

.btn-text-danger:hover {
  color: #D63030;
}

/* ===== Store main ===== */
.store-main {
  padding: 24px 32px 32px;
}

.store-topbar {
  margin-bottom: 24px;
}

.user-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar-sm {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  border-radius: 50%;
  color: var(--color-primary);
}

.user-name-sm {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* ===== Search ===== */
.search-area {
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto 16px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 42px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-bg-card);
  box-shadow: var(--shadow-card);
  transition: all 0.2s;
  outline: none;
}

.search-input:hover {
  border-color: var(--color-primary);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card), 0 0 0 2px rgba(0, 112, 255, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.filter-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.filter-select {
  padding: 7px 28px 7px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  font-size: 13px;
  font-family: var(--font-family);
  color: var(--color-text-secondary);
  background: var(--color-bg-card);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2386909C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  transition: border-color 0.2s;
  outline: none;
}

.filter-select:hover {
  border-color: var(--color-primary);
}

.filter-select:focus {
  border-color: var(--color-primary);
}

/* ===== Main Tabs ===== */
.main-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
  gap: 0;
}

.main-tab {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-family);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
}

.main-tab:hover {
  color: var(--color-primary);
}

.main-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

/* ===== Sub Tabs ===== */
.ranking-tabs,
.my-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.sub-tab {
  padding: 6px 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  font-size: 13px;
  font-family: var(--font-family);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
}

.sub-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.sub-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #FFFFFF;
}

/* ===== Tab content ===== */
.tab-content {
  min-height: 200px;
}

/* ===== Skill grid ===== */
.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.skill-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-card);
  transition: all 0.2s;
}

.skill-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.skill-card-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 12px;
}

.skill-icon-wrap {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  border-radius: 10px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.skill-icon-wrap.workflow-icon {
  background: #F0EAFF;
  color: var(--color-accent);
}

.skill-info {
  flex: 1;
  min-width: 0;
}

.skill-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skill-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--color-warning);
}

.skill-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  line-height: 1.5;
  margin-bottom: 12px;
  min-height: 38px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-bottom: 10px;
}

.category-tag {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.skill-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.tag {
  background: var(--color-bg-input);
  color: var(--color-text-tertiary);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
}

.skill-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* ===== Rankings ===== */
.ranking-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.ranking-list {
  padding: 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-item:hover {
  background: var(--color-bg-page);
}

.rank-num {
  width: 40px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.rank-num.top {
  color: var(--color-warning);
}

.rank-name {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.rank-score {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

/* ===== My section ===== */
.my-list-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.my-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s;
}

.my-list-item:last-child {
  border-bottom: none;
}

.my-list-item:hover {
  background: var(--color-bg-page);
}

.my-item-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  border-radius: 8px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.my-item-icon.fav {
  background: #FFECE8;
  color: var(--color-error);
}

.my-item-icon.dl {
  background: #E8FFEA;
  color: var(--color-success);
}

.my-item-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.my-item-meta {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* ===== Empty state ===== */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-tertiary);
  font-size: 14px;
}
</style>
