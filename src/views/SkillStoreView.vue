<template>
  <div class="skill-store">
    <!-- Header -->
    <div class="store-header">
      <div class="header-left">
        <h1 class="store-title">技能商店</h1>
        <span class="store-count" v-if="totalCount > 0">{{ totalCount }} 个技能</span>
      </div>
      <div class="header-right">
        <span v-if="hasToken" class="token-badge connected">
          <span class="badge-dot"></span>已绑定
        </span>
        <span v-else class="token-badge">
          <span class="badge-dot dim"></span>未绑定
        </span>
      </div>
    </div>

    <!-- Tabs: 商店 / 已安装 -->
    <div class="main-tabs">
      <button :class="['main-tab', { active: activeTab === 'store' }]" @click="activeTab = 'store'">
        商店
        <span class="tab-count" v-if="totalCount > 0">{{ totalCount }}</span>
      </button>
      <button :class="['main-tab', { active: activeTab === 'installed' }]" @click="activeTab = 'installed'; loadInstalled()">
        已安装
        <span class="tab-count" v-if="installedSkills.length > 0">{{ installedSkills.length }}</span>
      </button>
    </div>

    <!-- Store tab content -->
    <template v-if="activeTab === 'store'">

    <!-- Search + Filters -->
    <div class="search-bar">
      <span class="search-icon"><IconSearch :size="16" /></span>
      <input
        v-model="searchQuery"
        @input="debounceSearch"
        placeholder="搜索技能名称、描述、标签..."
        class="search-input"
      />
      <kbd v-if="!searchQuery" class="search-hint">/</kbd>
    </div>
    <div class="filter-bar">
      <button
        v-for="cat in categories"
        :key="cat.value"
        :class="['filter-chip', { active: selectedCategory === cat.value }]"
        @click="selectedCategory = cat.value; loadSkills()"
      >{{ cat.label }}</button>
      <div class="filter-spacer"></div>
      <select v-model="sortBy" @change="loadSkills()" class="sort-select">
        <option value="downloads">下载量</option>
        <option value="rating">评分</option>
        <option value="latest">最新</option>
      </select>
    </div>

    <!-- Rate limit warning -->
    <div v-if="rateLimited" class="rate-warning">
      <span class="warn-icon">!</span>
      <span>请求过于频繁，建议前往 <button class="link-btn" @click="goSettings">设置</button> 绑定 2x CLI Token 以解除限制</span>
    </div>

    <!-- Loading -->
    <div v-if="loading && skills.length === 0" class="loading-state">
      <span class="spinner"></span>
      <span>加载中...</span>
    </div>

    <!-- Empty -->
    <div v-else-if="!loading && skills.length === 0" class="empty-state">
      <span class="empty-icon">~</span>
      <span v-if="searchQuery">未找到匹配「{{ searchQuery }}」的技能</span>
      <span v-else>暂无技能数据</span>
    </div>

    <!-- Skill grid -->
    <div v-else class="skill-grid">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="skill-card"
        @click="openDetail(skill)"
      >
        <div class="card-header">
          <div class="card-icon">
            <IconStar :size="18" />
          </div>
          <div class="card-info">
            <h3 class="card-name">{{ skill.name }}</h3>
            <div class="card-rating" v-if="skill.average_rating > 0">
              <span class="rating-star">*</span>
              <span>{{ skill.average_rating.toFixed(1) }}</span>
            </div>
          </div>
          <span class="card-version" v-if="skill.current_version">v{{ skill.current_version }}</span>
        </div>
        <p class="card-desc">{{ skill.summary || skill.description }}</p>
        <div class="card-meta">
          <span class="meta-tag" v-if="skill.category">{{ skill.category }}</span>
          <span class="meta-stat">
            <IconDownload :size="11" />
            {{ formatNum(skill.total_downloads) }}
          </span>
          <span class="meta-stat">
            <IconHeart :size="11" />
            {{ formatNum(skill.total_favorites) }}
          </span>
        </div>
        <div class="card-tags" v-if="skill.tags && skill.tags.length">
          <span v-for="tag in skill.tags.slice(0, 4)" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="card-actions" @click.stop>
          <button class="action-btn" @click="installSkill(skill)">
            <IconDownload :size="13" />
            <span>安装</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Load more -->
    <div v-if="skills.length > 0 && hasMore" class="load-more">
      <button @click="loadMore" :disabled="loading" class="load-more-btn">
        {{ loading ? '加载中...' : '加载更多' }}
      </button>
    </div>

    </template>

    <!-- Installed tab content -->
    <template v-if="activeTab === 'installed'">
      <!-- Installed search -->
      <div class="search-bar">
        <span class="search-icon"><IconSearch :size="16" /></span>
        <input v-model="installedSearch" placeholder="搜索已安装技能..." class="search-input" />
      </div>

      <!-- Source filter -->
      <div class="filter-bar">
        <button :class="['filter-chip', { active: installedFilter === 'all' }]" @click="installedFilter = 'all'">全部</button>
        <button :class="['filter-chip', { active: installedFilter === 'builtin' }]" @click="installedFilter = 'builtin'">内置</button>
        <button :class="['filter-chip', { active: installedFilter === '2x' }]" @click="installedFilter = '2x'">商店安装</button>
      </div>

      <div v-if="installedLoading" class="loading-state">
        <span class="spinner"></span>
        <span>扫描已安装技能...</span>
      </div>

      <div v-else-if="filteredInstalled.length === 0" class="empty-state">
        <span class="empty-icon">~</span>
        <span v-if="installedSearch">未找到匹配的已安装技能</span>
        <span v-else>暂无已安装技能</span>
      </div>

      <div v-else class="installed-list">
        <div v-for="sk in filteredInstalled" :key="sk.slug + sk.category" class="installed-item">
          <div class="installed-icon">
            <IconStar :size="16" />
          </div>
          <div class="installed-info">
            <div class="installed-name">{{ sk.name || sk.slug }}</div>
            <div class="installed-meta">
              <span class="meta-tag" v-if="sk.category">{{ sk.category }}</span>
              <span class="source-badge" :class="sk.source">{{ sk.source === '2x' ? '商店' : '内置' }}</span>
              <span v-if="sk.version" class="installed-ver">v{{ sk.version }}</span>
              <span class="installed-files">{{ sk.files }} 文件</span>
            </div>
            <div class="installed-desc" v-if="sk.description">{{ sk.description }}</div>
          </div>
          <button class="uninstall-btn" @click="uninstallSkill(sk)" :title="'卸载 ' + sk.slug">
            卸载
          </button>
        </div>
      </div>
    </template>

    <!-- Detail modal -->
    <div v-if="detailSkill" class="modal-overlay" @click.self="detailSkill = null">
      <div class="modal-panel">
        <div class="modal-header">
          <div class="modal-title-row">
            <div class="modal-icon"><IconStar :size="22" /></div>
            <div>
              <h2 class="modal-name">{{ detailSkill.name }}</h2>
              <div class="modal-subtitle">
                <span v-if="detailData?.owner">{{ detailData.owner.nickname || detailData.owner.username }}</span>
                <span v-if="detailSkill.current_version" class="modal-ver">v{{ detailSkill.current_version }}</span>
                <span v-if="detailSkill.license" class="modal-license">{{ detailSkill.license }}</span>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="detailSkill = null">x</button>
        </div>

        <div class="modal-stats">
          <div class="stat-item">
            <span class="stat-num">{{ formatNum(detailSkill.total_downloads) }}</span>
            <span class="stat-label">下载</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ detailSkill.average_rating > 0 ? detailSkill.average_rating.toFixed(1) : '-' }}</span>
            <span class="stat-label">评分</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ formatNum(detailSkill.total_favorites) }}</span>
            <span class="stat-label">收藏</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ detailSkill.total_reviews || 0 }}</span>
            <span class="stat-label">评价</span>
          </div>
        </div>

        <div class="modal-body">
          <div class="modal-section">
            <h4 class="section-label">简介</h4>
            <p class="section-text">{{ detailSkill.summary }}</p>
          </div>
          <div v-if="detailData?.long_description" class="modal-section">
            <h4 class="section-label">详细描述</h4>
            <div class="section-text markdown-body" v-html="renderMd(detailData.long_description)"></div>
          </div>
          <div v-if="detailSkill.tags && detailSkill.tags.length" class="modal-section">
            <h4 class="section-label">标签</h4>
            <div class="modal-tags">
              <span v-for="tag in detailSkill.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div v-if="detailSkill.capabilities && detailSkill.capabilities.length" class="modal-section">
            <h4 class="section-label">能力</h4>
            <div class="modal-tags">
              <span v-for="cap in detailSkill.capabilities" :key="cap" class="tag cap">{{ cap }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="install-btn" @click="installSkill(detailSkill); detailSkill = null">
            <IconDownload :size="15" />
            <span>安装技能</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Install result toast -->
    <div v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import type { TwoXSkill, TwoXSkillDetail } from '@/types'
import * as api from '@/api'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import IconSearch from '../components/icons/IconSearch.vue'
import IconStar from '../components/icons/IconStar.vue'
import IconDownload from '../components/icons/IconDownload.vue'
import IconHeart from '../components/icons/IconHeart.vue'

const router = useRouter()

const activeTab = ref<'store' | 'installed'>('store')
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('downloads')
const skills = ref<TwoXSkill[]>([])
const loading = ref(false)
const rateLimited = ref(false)
const totalCount = ref(0)
const offset = ref(0)
const pageSize = 30
const hasMore = ref(false)

const detailSkill = ref<TwoXSkill | null>(null)
const detailData = ref<TwoXSkillDetail | null>(null)
const detailLoading = ref(false)

const toastMsg = ref('')
const toastType = ref<'success' | 'error' | 'warn'>('success')

// 已安装技能
interface InstalledSkill {
  slug: string
  name: string
  category: string
  source: string
  version?: string
  description?: string
  author?: string
  files: number
  path: string
}
const installedSkills = ref<InstalledSkill[]>([])
const installedLoading = ref(false)
const installedSearch = ref('')
const installedFilter = ref<'all' | 'builtin' | '2x'>('all')

const filteredInstalled = computed(() => {
  let list = installedSkills.value
  if (installedFilter.value !== 'all') {
    list = list.filter(s => s.source === installedFilter.value)
  }
  if (installedSearch.value) {
    const q = installedSearch.value.toLowerCase()
    list = list.filter(s =>
      s.slug.toLowerCase().includes(q) ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q)
    )
  }
  return list
})

const hasToken = computed(() => !!localStorage.getItem('2x_token'))

const categories = [
  { value: '', label: '全部' },
  { value: 'automation', label: '自动化' },
  { value: 'ai', label: 'AI' },
  { value: 'data', label: '数据' },
  { value: 'devops', label: 'DevOps' },
  { value: 'creative', label: '创意' },
  { value: 'productivity', label: '效率' },
  { value: 'research', label: '研究' },
]

let searchTimeout: ReturnType<typeof setTimeout> | null = null

function debounceSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    offset.value = 0
    loadSkills()
  }, 300)
}

function formatNum(n: number): string {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

function renderMd(content: string) {
  const html = marked(content) as string
  return DOMPurify.sanitize(html)
}

function showToast(msg: string, type: 'success' | 'error' | 'warn' = 'success') {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

function goSettings() {
  router.push('/settings')
}

async function loadSkills() {
  loading.value = true
  rateLimited.value = false
  try {
    const resp = await api.twoXGetSkills(
      searchQuery.value || undefined,
      selectedCategory.value || undefined,
      undefined,
      sortBy.value,
      pageSize,
      offset.value,
    )
    if (offset.value === 0) {
      skills.value = resp.skills || []
    } else {
      skills.value = [...skills.value, ...(resp.skills || [])]
    }
    totalCount.value = (resp as any).total || skills.value.length
    hasMore.value = (resp.skills || []).length >= pageSize
  } catch (e: any) {
    const msg = e?.message || String(e)
    if (msg.includes('429') || msg.includes('rate') || msg.includes('limit')) {
      rateLimited.value = true
      showToast('请求频率受限，请绑定 2x Token', 'warn')
    } else {
      console.error('加载技能失败:', e)
    }
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  offset.value += pageSize
  await loadSkills()
}

async function openDetail(skill: TwoXSkill) {
  detailSkill.value = skill
  detailData.value = null
  detailLoading.value = true
  try {
    const data = await api.twoXGetSkillDetail(skill.slug)
    detailData.value = data as TwoXSkillDetail
  } catch (e: any) {
    const msg = e?.message || String(e)
    if (msg.includes('429') || msg.includes('rate') || msg.includes('limit')) {
      rateLimited.value = true
      showToast('查询频繁，建议绑定 2x Token', 'warn')
    }
  } finally {
    detailLoading.value = false
  }
}

async function installSkill(skill: TwoXSkill) {
  showToast(`正在安装 ${skill.name}...`, 'success')
  try {
    const isDev = import.meta.env?.DEV ?? false
    const agentUrl = isDev ? '/proxy/agent' : ''
    const r = await fetch(`${agentUrl}/v1/agent/install-skill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: skill.slug, category: skill.category || '' }),
    })
    const data = await r.json()
    if (data.success) {
      showToast(`${skill.name} 安装成功 (${data.files} 个文件)`, 'success')
      // 刷新已安装列表
      loadInstalled()
    } else {
      const errMsg = data.error || '未知错误'
      if (errMsg.includes('429') || errMsg.includes('401') || errMsg.includes('403')) {
        rateLimited.value = true
        showToast('下载受限，请前往设置绑定 2x CLI Token', 'warn')
      } else {
        showToast(`安装失败: ${errMsg}`, 'error')
      }
    }
  } catch (e: any) {
    showToast(`安装失败: Agent 未启动或网络错误`, 'error')
  }
}

async function loadInstalled() {
  installedLoading.value = true
  try {
    const isDev = import.meta.env?.DEV ?? false
    const agentUrl = isDev ? '/proxy/agent' : ''
    const r = await fetch(`${agentUrl}/v1/agent/skills`)
    const data = await r.json()
    installedSkills.value = (data.skills || []).sort((a: any, b: any) => {
      // 商店安装的排前面，然后按分类/名称排序
      if (a.source !== b.source) return a.source === '2x' ? -1 : 1
      if (a.category !== b.category) return (a.category || '').localeCompare(b.category || '')
      return (a.name || a.slug).localeCompare(b.name || b.slug)
    })
  } catch {
    showToast('无法获取已安装技能列表，请确认 Agent 已启动', 'error')
  } finally {
    installedLoading.value = false
  }
}

async function uninstallSkill(sk: InstalledSkill) {
  if (!confirm(`确定要卸载技能「${sk.name || sk.slug}」吗？`)) return
  try {
    const isDev = import.meta.env?.DEV ?? false
    const agentUrl = isDev ? '/proxy/agent' : ''
    const r = await fetch(`${agentUrl}/v1/agent/uninstall-skill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: sk.slug, category: sk.category }),
    })
    const data = await r.json()
    if (data.success) {
      showToast(`${sk.name || sk.slug} 已卸载`, 'success')
      installedSkills.value = installedSkills.value.filter(s => !(s.slug === sk.slug && s.category === sk.category))
    } else {
      showToast(`卸载失败: ${data.error}`, 'error')
    }
  } catch {
    showToast('卸载失败: Agent 未启动', 'error')
  }
}

onMounted(() => {
  loadSkills()
})

onBeforeUnmount(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<style scoped>
.skill-store {
  height: 100%;
  overflow-y: auto;
  background: transparent;
  padding: 24px 32px 32px;
  position: relative;
}

/* Header */
.store-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.store-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  letter-spacing: -0.3px;
}

.store-count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.token-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.token-badge.connected {
  color: var(--color-success);
  border-color: var(--color-success);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
}

.badge-dot.dim {
  background: var(--color-text-tertiary);
  opacity: 0.4;
}

/* Search */
.search-bar {
  position: relative;
  margin-bottom: 12px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  display: flex;
}

.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  font-size: 13px;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 2px 12px rgba(10,132,255,0.10);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.search-hint {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  padding: 1px 5px;
  pointer-events: none;
}

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 5px 12px;
  background: var(--color-bg-input);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  font-size: 12px;
  font-family: var(--font-family);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.12s;
}

.filter-chip:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.filter-chip.active {
  background: var(--color-text-primary);
  border-color: var(--color-text-primary);
  color: var(--color-bg-page);
}

.filter-spacer {
  flex: 1;
}

.sort-select {
  padding: 5px 24px 5px 8px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-secondary);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
  outline: none;
}

/* Rate limit warning */
.rate-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-warning);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.warn-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-warning);
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--font-family);
  text-decoration: underline;
  padding: 0;
}

/* Loading / Empty */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  color: var(--color-text-tertiary);
  font-size: 13px;
  font-family: var(--font-mono);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 28px;
  opacity: 0.3;
}

/* Skill grid */
.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.skill-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(16px) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.skill-card:hover {
  border-color: var(--color-text-tertiary);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}

.card-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-input);
  border-radius: 6px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: var(--color-warning);
  margin-top: 2px;
}

.rating-star {
  font-weight: 700;
}

.card-version {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  background: var(--color-bg-input);
  padding: 2px 5px;
  border-radius: 3px;
  flex-shrink: 0;
}

.card-desc {
  font-size: 12px;
  color: var(--color-text-tertiary);
  line-height: 1.5;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
}

.meta-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  background: var(--color-bg-input);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--color-text-secondary);
}

.meta-stat {
  display: flex;
  align-items: center;
  gap: 3px;
}

.card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.tag {
  font-family: var(--font-mono);
  font-size: 10px;
  background: var(--color-bg-input);
  color: var(--color-text-tertiary);
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.tag.cap {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: var(--color-bg-input);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.12s;
}

.action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Load more */
.load-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.load-more-btn {
  padding: 7px 24px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.12s;
}

.load-more-btn:hover:not(:disabled) {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.load-more-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 40px;
}

.modal-panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  width: 100%;
  max-width: 640px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal-title-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.modal-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-input);
  border-radius: 8px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.modal-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px;
}

.modal-subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.modal-ver,
.modal-license {
  font-family: var(--font-mono);
  font-size: 10px;
  background: var(--color-bg-input);
  padding: 1px 5px;
  border-radius: 3px;
}

.modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.12s;
}

.modal-close:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-primary);
}

.modal-stats {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-border);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  border-right: 1px solid var(--color-border);
}

.stat-item:last-child {
  border-right: none;
}

.stat-num {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.modal-section {
  margin-bottom: 18px;
}

.modal-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 6px;
  font-family: var(--font-mono);
}

.section-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.modal-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
}

.install-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: var(--color-text-primary);
  border: none;
  border-radius: 6px;
  color: var(--color-bg-page);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  transition: opacity 0.12s;
}

.install-btn:hover {
  opacity: 0.85;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-family: var(--font-family);
  z-index: 200;
  animation: toast-in 0.2s ease;
}

.toast.success {
  background: var(--color-success);
  color: #fff;
}

.toast.error {
  background: var(--color-error);
  color: #fff;
}

.toast.warn {
  background: var(--color-warning);
  color: #fff;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* Main tabs */
.main-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
}

.main-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-family);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.12s;
}

.main-tab:hover { color: var(--color-text-primary); }

.main-tab.active {
  color: var(--color-text-primary);
  border-bottom-color: var(--color-text-primary);
  font-weight: 600;
}

.tab-count {
  font-family: var(--font-mono);
  font-size: 10px;
  background: var(--color-bg-input);
  color: var(--color-text-tertiary);
  padding: 1px 5px;
  border-radius: 3px;
}

.main-tab.active .tab-count {
  background: var(--color-text-primary);
  color: var(--color-bg-page);
}

/* Installed list */
.installed-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.installed-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-bg-card);
  transition: background 0.1s;
}

.installed-item:hover {
  background: var(--color-bg-input);
}

.installed-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-input);
  border-radius: 6px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.installed-info {
  flex: 1;
  min-width: 0;
}

.installed-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.installed-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  font-size: 11px;
}

.installed-ver {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
}

.installed-files {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
}

.installed-desc {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600;
}

.source-badge.builtin {
  background: var(--color-bg-input);
  color: var(--color-text-tertiary);
}

.source-badge.2x {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.uninstall-btn {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.12s;
  flex-shrink: 0;
}

.uninstall-btn:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

/* Scrollbar */
.skill-store::-webkit-scrollbar { width: 6px; }
.skill-store::-webkit-scrollbar-track { background: transparent; }
.skill-store::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }

.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }
</style>
