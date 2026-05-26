<template>
  <div class="skill-store" @contextmenu.prevent @scroll="onStoreScroll" ref="storeRef" :class="{ 'store-scrolled': storeScrolled }">
    <!-- Header -->
    <div class="store-header">
      <div class="header-left">
        <h1 class="store-title">技能商店</h1>
        <span class="store-count" v-if="totalCount > 0">{{ totalCount }} 个技能</span>
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
      <HxInput
        v-model="searchQuery"
        placeholder="搜索技能名称、描述、标签..."
        :icon="IconSearch"
        @input="debounceSearch"
      />
      <HxSelect v-model="sortBy" @change="loadSkills()" :options="sortOptions" />
    </div>
    <div class="filter-bar">
      <div class="filter-chips">
        <HxButton
          v-for="cat in categories"
          :key="cat.value"
          :variant="selectedCategory === cat.value ? 'primary' : 'ghost'"
          size="sm"
          @click="selectedCategory = cat.value; loadSkills()"
        >{{ cat.label }}</HxButton>
      </div>
    </div>

    <!-- Rate limit warning -->
    <div v-if="rateLimited" class="rate-warning">
      <span class="warn-icon">!</span>
      <span>请求过于频繁，建议前往 <HxButton variant="ghost" size="sm" @click="goSettings">设置</HxButton> 绑定 2x CLI Token 以解除限制</span>
    </div>

    <!-- Loading -->
    <!-- Loading -->
    <HxSpinner v-if="loading && skills.length === 0" label="加载中..." />

    <!-- Empty -->
    <HxEmpty v-else-if="!loading && skills.length === 0">
      <template #default>
        <span v-if="searchQuery">未找到匹配「{{ searchQuery }}」的技能</span>
        <span v-else>暂无技能数据</span>
      </template>
    </HxEmpty>

    <!-- Skill grid -->
    <div v-else class="skill-grid">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="skill-card"
        @click="openDetail(skill)"
      >
        <div class="card-header">
          <div class="card-icon" v-html="getCategoryIcon((skill as any).category || '')"></div>
          <div class="card-info">
            <h3 class="card-name">{{ skill.name }}</h3>
            <div class="card-rating" v-if="skill.average_rating > 0">
              <span class="rating-star">*</span>
              <span>{{ skill.average_rating.toFixed(1) }}</span>
            </div>
          </div>
          <HxBadge v-if="skill.current_version" variant="info" size="sm">v{{ skill.current_version }}</HxBadge>
        </div>
        <p class="card-desc">{{ skill.summary || skill.description }}</p>
        <div class="card-footer">
          <div class="card-tags" v-if="skill.tags && skill.tags.length">
            <span v-for="tag in skill.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="card-footer-right">
            <span class="meta-stat">
              <IconDownload :size="11" />
              {{ formatNum(skill.total_downloads) }}
            </span>
            <div class="card-actions" @click.stop>
            <HxButton
              v-if="isInstalled(skill.slug)"
              variant="success" size="sm" disabled
            >
              <svg width="15" height="15" viewBox="0 0 1024 1024" fill="currentColor"><path d="M835.413333 316.586667a42.666667 42.666667 0 0 1-12.586666 30.293333L431.786667 737.92C418.773333 750.933333 405.333333 768 384 746.666667l-202.24-207.36a44.8 44.8 0 0 1-4.053333-60.16 42.666667 42.666667 0 0 1 62.506666-2.133334l161.066667 161.066667a6.826667 6.826667 0 0 0 9.813333 0l352.853334-353.066667a38.4 38.4 0 0 1 37.76-10.666666 44.16 44.16 0 0 1 33.706666 42.24z"/></svg>
              <span>已安装</span>
            </HxButton>
            <HxButton
              v-else-if="!installState[skill.slug]"
              variant="primary" size="sm"
              @click="installSkill(skill)"
            >
              <IconDownload :size="13" />
              <span>安装</span>
            </HxButton>
            <HxButton
              v-else-if="installState[skill.slug] === 'installing'"
              variant="primary" size="sm" disabled
            >
              <span class="spinner"></span>
              <span>安装中</span>
            </HxButton>
            <HxButton
              v-else-if="installState[skill.slug] === 'success'"
              variant="success" size="sm" disabled
            >
              <svg width="15" height="15" viewBox="0 0 1024 1024" fill="currentColor"><path d="M835.413333 316.586667a42.666667 42.666667 0 0 1-12.586666 30.293333L431.786667 737.92C418.773333 750.933333 405.333333 768 384 746.666667l-202.24-207.36a44.8 44.8 0 0 1-4.053333-60.16 42.666667 42.666667 0 0 1 62.506666-2.133334l161.066667 161.066667a6.826667 6.826667 0 0 0 9.813333 0l352.853334-353.066667a38.4 38.4 0 0 1 37.76-10.666666 44.16 44.16 0 0 1 33.706666 42.24z"/></svg>
              <span>已安装</span>
            </HxButton>
            <HxButton
              v-else-if="installState[skill.slug] === 'error'"
              variant="danger" size="sm"
              @click="installSkill(skill)"
            >
              安装失败，重试
            </HxButton>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Infinite scroll sentinel -->  
    <div v-if="hasMore" ref="scrollSentinel" class="scroll-sentinel">
      <div v-if="loading" class="load-more-spinner">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>

    </template>

    <!-- Installed tab content -->
    <template v-if="activeTab === 'installed'">
      <!-- Installed search -->
      <div class="search-bar">
        <HxInput v-model="installedSearch" placeholder="搜索已安装技能..." :icon="IconSearch" />
      </div>

      <!-- Source filter -->
      <div class="filter-bar">
        <div class="filter-chips">
          <HxButton :variant="installedFilter === 'all' ? 'primary' : 'ghost'" size="sm" @click="installedFilter = 'all'">全部</HxButton>
          <HxButton :variant="installedFilter === 'builtin' ? 'primary' : 'ghost'" size="sm" @click="installedFilter = 'builtin'">内置</HxButton>
          <HxButton :variant="installedFilter === '2x' ? 'primary' : 'ghost'" size="sm" @click="installedFilter = '2x'">商店安装</HxButton>
        </div>
      </div>

      <HxSpinner v-if="installedLoading" label="扫描已安装技能..." />

      <HxEmpty v-else-if="filteredInstalled.length === 0">
        <template #default>
          <span v-if="installedSearch">未找到匹配的已安装技能</span>
          <span v-else>暂无已安装技能</span>
        </template>
      </HxEmpty>

      <div v-else class="skill-grid">
        <div v-for="sk in filteredInstalled" :key="sk.slug + sk.category" class="skill-card">
          <div class="card-header">
            <div class="card-icon" v-html="getCategoryIcon(sk.category || sk.slug)"></div>
            <div class="card-info">
              <h3 class="card-name">{{ sk.name || sk.slug }}</h3>
            </div>
            <HxBadge v-if="sk.version" variant="info" size="sm">v{{ sk.version }}</HxBadge>
            <HxBadge v-if="sk.hasUpdate" variant="warning" size="sm">可更新</HxBadge>
          </div>
          <p class="card-desc" v-if="sk.description">{{ sk.description }}</p>
          <div class="card-footer">
            <div class="card-tags">
              <span v-if="sk.category" class="tag">{{ sk.category }}</span>
              <span class="tag" :class="{ cap: sk.source === '2x' }">{{ sk.source === '2x' ? '商店' : '内置' }}</span>
            </div>
            <div class="card-footer-right">
              <span class="meta-stat">{{ sk.files }} 文件</span>
              <div class="card-actions" @click.stop>
                <HxButton v-if="sk.hasUpdate" variant="primary" size="sm" @click="updateSkill(sk)">更新</HxButton>
                <HxButton variant="danger" size="sm" @click="uninstallSkill(sk)">卸载</HxButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Detail modal -->
    <div v-if="detailSkill" class="modal-overlay" @click.self="detailSkill = null">
      <div class="modal-panel">
        <div class="modal-header">
          <div class="modal-title-row">
            <div class="modal-icon" v-html="getCategoryIcon(detailSkill?.category || '')"></div>
            <div>
              <h2 class="modal-name">{{ detailSkill.name }}</h2>
              <div class="modal-subtitle">
                <span v-if="detailData?.owner">{{ detailData.owner.nickname || detailData.owner.username }}</span>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="detailSkill = null">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-stats">
          <div class="stat-item">
            <span class="stat-num">{{ formatNum(detailSkill.total_downloads) }}</span>
            <span class="stat-label">下载</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ formatNum(detailSkill.total_favorites) }}</span>
            <span class="stat-label">收藏</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ detailSkill.current_version || '-' }}</span>
            <span class="stat-label">版本</span>
          </div>
        </div>

        <div class="modal-body" @click="onModalBodyClick">
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
          <HxButton variant="primary" @click="installSkill(detailSkill); detailSkill = null">
            <IconDownload :size="15" />
            <span>安装技能</span>
          </HxButton>
        </div>
      </div>
    </div>

    <!-- Uninstall confirm modal -->
    <div v-if="uninstallTarget" class="modal-overlay" @click.self="uninstallTarget = null">
      <div class="modal-panel" style="max-width: 440px;">
        <div class="modal-header">
          <div class="modal-title-row">
            <div class="modal-icon" style="color: var(--error); background: rgba(255,69,58,0.1);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </div>
            <h2 class="modal-name">卸载技能</h2>
          </div>
          <button class="modal-close" @click="uninstallTarget = null">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="section-text">确定要卸载 <strong>{{ uninstallTarget.name || uninstallTarget.slug }}</strong> 吗？卸载后该技能将从本地移除。</p>
        </div>
        <div class="modal-footer">
          <HxButton variant="ghost" @click="uninstallTarget = null">取消</HxButton>
          <HxButton variant="danger" @click="confirmUninstall" style="background: rgba(255,69,58,0.85); border-color: rgba(255,69,58,0.9); color: #fff;">确认卸载</HxButton>
        </div>
      </div>
    </div>

    <!-- Install result toast -->
    <div v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, reactive, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { TwoXSkill, TwoXSkillDetail } from '@/types'
import * as api from '@/api'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import IconSearch from '../components/icons/IconSearch.vue'
import IconStar from '../components/icons/IconStar.vue'
import IconDownload from '../components/icons/IconDownload.vue'
import IconHeart from '../components/icons/IconHeart.vue'
import { HxButton, HxInput, HxSelect, HxCard, HxBadge, HxModal, HxSpinner, HxEmpty } from '../components/ui'
import { useToast } from '../composables/useToast'

const toast = useToast()

const router = useRouter()

// Scroll state for top mask
const storeRef = ref<HTMLElement | null>(null)
const storeScrolled = ref(false)

function onStoreScroll() {
  storeScrolled.value = (storeRef.value?.scrollTop || 0) > 10
}

// 分类图标映射
const svgAI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.2 2.3A4.5 4.5 0 0 0 4 14.5a4.5 4.5 0 0 0 6.5 4 3 3 0 0 0 5.5 1 3 3 0 0 0 1.8-5.2A4.5 4.5 0 0 0 18 7.5a4.5 4.5 0 0 0-6.5-4A3 3 0 0 0 12 5Z"/></svg>'
const svgDev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="2" x2="12" y2="22"/></svg>'
const svgCreate = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>'
const svgMedia = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
const svgSearch = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
const svgData = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
const svgShield = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
const svgBolt = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
const svgBook = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
const svgChat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
const svgGlobe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
const svgTool = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
const svgGame = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.21 12.7 2 15.53 2 18c0 1.52 1.2 3 3 3 1.3 0 2.4-.8 2.82-2h8.36c.42 1.2 1.52 2 2.82 2 1.8 0 3-1.48 3-3 0-2.47-.21-5.3-.702-9.41A4 4 0 0 0 17.32 5z"/></svg>'
const svgMail = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
const svgHome = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
const svgNote = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
const svgNetwork = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06-.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'

const categoryIcons: Record<string, string> = {
  // 中文（商店）
  'AI 智能': svgAI, '开发工具': svgDev, '内容创作': svgCreate, '多媒体': svgMedia,
  '搜索研究': svgSearch, '数据分析': svgData, '安全合规': svgShield, '效率提升': svgBolt,
  '知识管理': svgBook, '通讯协作': svgChat, '浏览器自动化': svgGlobe, '工具': svgTool,
  // 英文（已安装技能目录）
  'autonomous-ai-agents': svgAI, 'mlops': svgAI, 'red-teaming': svgAI, 'self-improving': svgAI, 'self-improving-agent': svgAI,
  'software-development': svgDev, 'devops': svgDev, 'github': svgDev, 'find-skills': svgDev, 'skill-vetter': svgDev,
  'creative': svgCreate, 'diagramming': svgCreate,
  'media': svgMedia, 'gifs': svgMedia,
  'research': svgSearch, 'domain': svgSearch, 'ontology': svgSearch,
  'data-science': svgData,
  'productivity': svgBolt, 'proactive-agent': svgAI,
  'note-taking': svgNote,
  'social-media': svgChat, 'email': svgMail,
  'agent-browser': svgGlobe, 'mcp': svgNetwork,
  'gaming': svgGame, 'smart-home': svgHome, 'weather': svgGlobe,
  'dogfood': svgTool, 'summarize': svgBook, 'apple': svgHome, 'inference-sh': svgNetwork, 'index-cache': svgNetwork, 'yuanbao': svgChat,
}
const defaultCategoryIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'

function getCategoryIcon(category: string): string {
  return categoryIcons[category] || defaultCategoryIcon
}

const scrollSentinel = ref<HTMLElement | null>(null)

const activeTab = ref<'store' | 'installed'>('store')
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('downloads')
const sortOptions = [
  { label: '下载量', value: 'downloads' },
  { label: '收藏量', value: 'favorites' },
  { label: '最新', value: 'latest' },
]
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

// 安装状态追踪: slug → 'installing' | 'success' | 'error' | undefined
const installState = reactive<Record<string, string>>({})
const installError = reactive<Record<string, string>>({})

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
  hasUpdate?: boolean
  storeVersion?: string
}
const installedSkills = ref<InstalledSkill[]>([])
const installedLoading = ref(false)

function isInstalled(slug: string): boolean {
  return installedSkills.value.some(s => s.slug === slug)
}

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

const rawCategories = ref<string[]>([])
const categories = computed(() => {
  const seen = new Set<string>()
  const list: { value: string; label: string }[] = [{ value: '', label: '全部' }]
  for (const c of rawCategories.value) {
    if (!c || seen.has(c)) continue
    seen.add(c)
    list.push({ value: c, label: c })
  }
  return list
})

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

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
  } else {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

function onModalBodyClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest('.code-copy-btn')
  if (!btn) return
  const pre = btn.closest('.code-window')?.querySelector('pre')
  if (pre) {
    copyToClipboard(pre.textContent || '')
    const span = btn.querySelector('span')
    if (span) {
      span.textContent = '已复制'
      setTimeout(() => { span.textContent = '复制' }, 1500)
    }
  }
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
      // 首次加载时收集 2x 真实分类
      if (rawCategories.value.length === 0 && skills.value.length > 0) {
        const catSet = new Set<string>()
        for (const s of skills.value) {
          const c = (s as any).category?.trim()
          if (c) catSet.add(c)
        }
        rawCategories.value = [...catSet].sort()
      }
    } else {
      skills.value = [...skills.value, ...(resp.skills || [])]
    }
    totalCount.value = (resp as any).total || skills.value.length
    hasMore.value = (resp.skills || []).length >= pageSize
  } catch (e: any) {
    const msg = e?.message || String(e)
    if (msg.includes('429') || msg.includes('rate') || msg.includes('limit')) {
      rateLimited.value = true
      toast.error('请求受限', '请绑定 2x Token')
    } else {
      console.error('加载技能失败:', e)
    }
  } finally {
    loading.value = false
  }
}

async function openDetail(skill: TwoXSkill) {
  detailSkill.value = skill
  detailData.value = null
  detailLoading.value = true
  try {
    const data = await api.twoXGetSkillDetail(skill.slug)
    detailData.value = data as TwoXSkillDetail
    // 翻译代码块复制按钮文字
    nextTick(() => {
      document.querySelectorAll('.code-copy-btn span').forEach(s => {
        if (s.textContent === 'Copy') s.textContent = '复制'
      })
    })
  } catch (e: any) {
    const msg = e?.message || String(e)
    if (msg.includes('429') || msg.includes('rate') || msg.includes('limit')) {
      rateLimited.value = true
      toast.error('查询频繁', '建议绑定 2x Token')
    }
  } finally {
    detailLoading.value = false
  }
}

async function installSkill(skill: TwoXSkill) {
  const slug = skill.slug
  installState[slug] = 'installing'
  installError[slug] = ''
  try {
    const isDev = import.meta.env?.DEV ?? false
    const agentUrl = isDev ? '/proxy/agent' : ''  // Wails 模式下走 AssetServer Handler（同源）
    const r = await fetch(`${agentUrl}/v1/store/install`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        slug, 
        version: skill.current_version || '', 
        oss_url: (skill as any).current_version_oss_url || '' 
      }),
    })
    const data = await r.json()
    if (data.success) {
      installState[slug] = 'success'
      toast.success('安装成功', skill.name || slug)
      await loadInstalled()
      // 3秒后清除成功状态
      setTimeout(() => { delete installState[slug] }, 5000)
    } else {
      installState[slug] = 'error'
      installError[slug] = data.error || '安装失败'
      toast.error('安装失败', data.error || '未知错误')
    }
  } catch (e: any) {
    installState[slug] = 'error'
    installError[slug] = e.message || '网络错误'
    toast.error('安装失败', 'Agent 未启动或网络错误')
  }
}

async function loadInstalled() {
  installedLoading.value = true
  try {
    const isDev = import.meta.env?.DEV ?? false
    const agentUrl = isDev ? '/proxy/agent' : ''  // Wails 模式下走 AssetServer Handler（同源）
    const r = await fetch(`${agentUrl}/v1/agent/skills`)
    const data = await r.json()
    installedSkills.value = (data.skills || []).sort((a: any, b: any) => {
      // 商店安装的排前面，然后按分类/名称排序
      if (a.source !== b.source) return a.source === '2x' ? -1 : 1
      if (a.category !== b.category) return (a.category || '').localeCompare(b.category || '')
      return (a.name || a.slug).localeCompare(b.name || b.slug)
    })
    // 异步检查商店技能是否有更新
    checkUpdates()
  } catch {
    toast.error('加载失败', '无法获取已安装技能列表，请确认 Agent 已启动')
  } finally {
    installedLoading.value = false
  }
}

async function checkUpdates() {
  const storeSkills = installedSkills.value.filter(s => s.source === '2x' && s.version)
  if (storeSkills.length === 0) return
  // twoXFetch 已内置全局限流，直接顺序调用即可
  for (const sk of storeSkills) {
    try {
      const detail = await api.twoXGetSkillDetail(sk.slug)
      if (detail && detail.current_version && sk.version !== detail.current_version) {
        sk.hasUpdate = true
        sk.storeVersion = detail.current_version
      }
    } catch { /* ignore */ }
  }
}

async function updateSkill(sk: InstalledSkill) {
  try {
    const isDev = import.meta.env?.DEV ?? false
    const agentUrl = isDev ? '/proxy/agent' : ''  // Wails 模式下走 AssetServer Handler（同源）
    const r = await fetch(`${agentUrl}/v1/agent/install-skill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: sk.slug, category: sk.category }),
    })
    const data = await r.json()
    if (data.success) {
      sk.hasUpdate = false
      sk.version = sk.storeVersion
      sk.storeVersion = undefined
      toast.success('更新成功', `${sk.name || sk.slug} 已更新到 v${sk.version}`)
    } else {
      toast.error('更新失败', data.error || '未知错误')
    }
  } catch {
    toast.error('更新失败', 'Agent 未启动或网络错误')
  }
}

const uninstallTarget = ref<InstalledSkill | null>(null)

async function confirmUninstall() {
  const sk = uninstallTarget.value
  if (!sk) return
  try {
    const isDev = import.meta.env?.DEV ?? false
    const agentUrl = isDev ? '/proxy/agent' : ''  // Wails 模式下走 AssetServer Handler（同源）
    const r = await fetch(`${agentUrl}/v1/agent/uninstall-skill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: sk.slug, category: sk.category }),
    })
    const data = await r.json()
    if (data.success) {
      toast.success('已卸载', sk.name || sk.slug)
      installedSkills.value = installedSkills.value.filter(s => !(s.slug === sk.slug && s.category === sk.category))
    } else {
      toast.error('卸载失败', data.error)
    }
  } catch {
    toast.error('卸载失败', 'Agent 未启动')
  } finally {
    uninstallTarget.value = null
  }
}

async function uninstallSkill(sk: InstalledSkill) {
  uninstallTarget.value = sk
}

async function loadMore() {
  if (loading.value || !hasMore.value) return
  offset.value += pageSize
  await loadSkills()
}

let io: IntersectionObserver | null = null

onMounted(() => {
  loadSkills()
  loadInstalled()
  // IntersectionObserver 监听 sentinel 自动加载更多
  io = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && hasMore.value && !loading.value) {
      loadMore()
    }
  }, { rootMargin: '200px' })
  // hasMore 变化时重新绑定 sentinel
  watch(hasMore, async (val) => {
    await nextTick()
    if (val && scrollSentinel.value) {
      io?.observe(scrollSentinel.value)
    }
  })
})

onBeforeUnmount(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (io) { io.disconnect(); io = null }
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

.skill-store.store-scrolled {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0px, black 120px, black 100%);
  mask-image: linear-gradient(to bottom, transparent 0px, black 120px, black 100%);
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

/* Search */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.search-bar :deep(.hixns-input) {
  flex: 1;
  min-width: 0;
  min-height: 32px;
  padding: 5px 10px;
  border-radius: 6px;
}

.search-bar :deep(.hixns-input__field) {
  font-size: 12px;
}

.search-bar :deep(.hixns-input__field)::placeholder {
  font-size: 12px;
}

.search-bar :deep(.hixns-select) {
  flex-shrink: 0;
  width: 100px;
  min-height: auto;
}

.search-bar :deep(.hixns-select__trigger) {
  min-height: 32px;
  padding: 5px 8px;
  font-size: 12px;
  border-radius: 6px;
}

.search-bar :deep(.hixns-select__value) {
  font-size: 12px;
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
  border-color: var(--color-border);
  box-shadow: none;
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

/* Skill Grid — VueBits */
.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.skill-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-2xl);
  padding: var(--space-4);
  cursor: pointer;
  transition: all var(--duration-200) var(--ease-expo);
  position: relative;
}

.skill-card:hover {
  border-color: var(--border-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.skill-card:active {
  transform: scale(0.995);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.card-header .hixns-badge {
  vertical-align: middle;
  line-height: 1;
}

.card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-glow);
  border-radius: var(--radius-lg);
  color: var(--accent);
  flex-shrink: 0;
}

.card-icon :deep(svg) {
  display: block;
  width: 20px;
  height: 20px;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: var(--text-xs);
  color: var(--warning);
  margin-top: 2px;
}

.rating-star {
  font-weight: 700;
}

/* Version badge — override HxBadge for card context */
.skill-card .hixns-badge {
  padding: 2px 8px !important;
  font-size: var(--text-xs) !important;
  font-weight: var(--font-medium) !important;
  font-family: var(--font-mono) !important;
  border-radius: var(--radius-xs) !important;
  background: var(--bg-elevated) !important;
  color: var(--text-tertiary) !important;
  border: 1px solid var(--border-base) !important;
  backdrop-filter: none !important;
  line-height: 1.4 !important;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 2px;
}

.skill-card .hixns-badge-dot::before {
  display: none;
}

.card-desc {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  line-height: var(--leading-normal);
  margin: 0 0 var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}

.meta-tag {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  background: var(--bg-elevated);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--text-secondary);
}

.card-footer {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: auto;
}

.card-footer .card-tags {
  margin-bottom: 0;
  flex: 1;
  min-width: 0;
}

.card-footer-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
  margin-left: auto;
}

.meta-stat {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.card-tags {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
}

.tag {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  background: var(--bg-elevated);
  color: var(--text-tertiary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.tag.cap {
  color: var(--primary-text);
  background: var(--primary-light);
}

.card-actions {
  display: flex;
  flex-shrink: 0;
}

/* Card install button — override HxButton for card context */
.skill-card .hixns-btn {
  padding: var(--space-1) var(--space-3) !important;
  font-size: var(--text-xs) !important;
  font-weight: var(--font-medium) !important;
  font-family: var(--font-sans) !important;
  min-height: 28px !important;
  border-radius: var(--radius-md) !important;
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-base) !important;
  color: var(--text-secondary) !important;
  box-shadow: none !important;
  transition: all var(--duration-150) var(--ease-expo) !important;
  position: relative;
  overflow: hidden;
}

.skill-card .hixns-btn .btn-content {
  display: inline-flex !important;
  align-items: center !important;
  gap: var(--space-1) !important;
}

.skill-card .hixns-btn svg {
  flex-shrink: 0 !important;
}

.skill-card .hixns-btn::before,
.skill-card .hixns-btn::after {
  display: none !important;
}

.skill-card .hixns-btn:hover:not(:disabled) {
  border-color: var(--accent) !important;
  color: var(--accent) !important;
  background: var(--accent-glow) !important;
  transform: none !important;
}

.skill-card .hixns-btn:active:not(:disabled) {
  transform: scale(0.97) !important;
}

/* Installed state */
.skill-card .hixns-btn:disabled {
  opacity: 0.6 !important;
  cursor: default !important;
}

.skill-card .hixns-btn.hixns-btn--success {
  background: rgba(48, 209, 88, 0.08) !important;
  border-color: rgba(48, 209, 88, 0.2) !important;
  color: var(--success) !important;
}

/* Action button (legacy) */
.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background: var(--bg-elevated);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-family: var(--font-sans);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-expo);
}

.action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Load more */
.load-more {
  display: flex;
  justify-content: center;
  padding: 20px;
  display: none; /* replaced by infinite scroll */
}

.scroll-sentinel {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.load-more-spinner {
  display: flex;
  align-items: center;
  gap: 6px;
}

.load-more-spinner .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-tertiary);
  animation: dotBounce 1.2s ease-in-out infinite;
}

.load-more-spinner .dot:nth-child(2) {
  animation-delay: 0.15s;
}

.load-more-spinner .dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
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
  background: var(--bg-overlay);
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 40px;
  animation: modalOverlayIn var(--duration-250) ease;
}

@keyframes modalOverlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 640px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: modalPanelIn var(--duration-350) var(--ease-back);
}

@keyframes modalPanelIn {
  from { opacity: 0; transform: scale(0.92) translateY(16px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-base);
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.modal-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  color: var(--primary-text);
  flex-shrink: 0;
}

.modal-icon :deep(svg) {
  display: block;
  width: 22px;
  height: 22px;
}

.modal-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.modal-subtitle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.modal-ver,
.modal-license {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  background: var(--bg-elevated);
  padding: 1px 5px;
  border-radius: var(--radius-xs);
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-expo);
  flex-shrink: 0;
  align-self: center;
}

.modal-close:hover {
  background: var(--bg-surface);
  border-color: var(--border-light);
  color: var(--text-primary);
}

.modal-stats {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border-base);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  border-right: 1px solid var(--border-base);
}

.stat-item:last-child {
  border-right: none;
}

.stat-num {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 2px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6) var(--space-6);
}

.modal-section {
  margin-bottom: var(--space-6);
}

.modal-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  letter-spacing: 0.3px;
  margin: 0 0 var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-base);
}

.section-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* Markdown content inside modal */
.markdown-body :deep(p) { margin: var(--space-2) 0; line-height: var(--leading-relaxed); }
.markdown-body :deep(p:first-child) { margin-top: 0; }
.markdown-body :deep(p:last-child) { margin-bottom: 0; }
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) { color: var(--text-primary); font-weight: var(--font-semibold); margin: var(--space-4) 0 var(--space-2); }
.markdown-body :deep(h2) { font-size: var(--text-lg); padding-bottom: var(--space-2); border-bottom: 1px solid var(--border-base); }
.markdown-body :deep(h3) { font-size: var(--text-base); }
.markdown-body :deep(h4) { font-size: var(--text-sm); color: var(--text-tertiary); }
.markdown-body :deep(strong) { font-weight: var(--font-semibold); color: var(--text-primary); }
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 20px; margin: var(--space-2) 0; }
.markdown-body :deep(li) { margin: 2px 0; line-height: var(--leading-relaxed); }
.markdown-body :deep(li::marker) { color: var(--text-tertiary); }
.markdown-body :deep(code) { font-family: var(--font-mono); font-size: var(--text-xs); background: var(--bg-elevated); padding: 1px 5px; border-radius: var(--radius-xs); color: var(--primary-text); }
.markdown-body :deep(pre) { 
  background: #0D1117; 
  border-radius: var(--radius-md); 
  padding: var(--space-3); 
  overflow-x: auto; 
  margin: var(--space-3) 0; 
  color: #E6EDF3; 
}

.markdown-body :deep(pre code) { 
  background: none; 
  padding: 0; 
  font-size: var(--text-xs); 
  color: #E6EDF3; 
}
.markdown-body :deep(a) { color: var(--primary-text); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color var(--duration-150) var(--ease-expo); }
.markdown-body :deep(a:hover) { border-bottom-color: var(--primary-text); }
.markdown-body :deep(blockquote) { border-left: 2px solid var(--primary); margin: var(--space-3) 0; padding: var(--space-2) var(--space-4); color: var(--text-tertiary); }
.markdown-body :deep(hr) { border: none; border-top: 1px solid var(--border-base); margin: var(--space-4) 0; }
.markdown-body :deep(img) { max-width: 100%; border-radius: var(--radius-md); }
.markdown-body :deep(table) { width: 100%; border-collapse: collapse; margin: var(--space-3) 0; font-size: var(--text-xs); }
.markdown-body :deep(th), .markdown-body :deep(td) { border: 1px solid var(--border-base); padding: var(--space-1) var(--space-2); text-align: left; }
.markdown-body :deep(th) { background: var(--bg-elevated); font-weight: var(--font-semibold); color: var(--text-primary); }

/* Code blocks (from skill detail HTML) */
.markdown-body :deep(.code-window) {
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-base);
  background: #0D1117;
}

.markdown-body :deep(.code-tab) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.markdown-body :deep(.code-lang-icon) {
  font-size: 11px;
  font-weight: 600;
  color: #8B949E;
}

.markdown-body :deep(.code-copy-btn) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #8B949E;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
  font-family: var(--font-sans);
}

.markdown-body :deep(.code-copy-btn:hover) {
  color: #E6EDF3;
  border-color: rgba(90,200,250,0.4);
}

.markdown-body :deep(.code-body) {
  display: flex;
  overflow: auto;
}

.markdown-body :deep(.code-gutter) {
  flex-shrink: 0;
  padding: 12px 8px;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.65;
  color: #484F58;
  background: rgba(255,255,255,0.01);
  border-right: 1px solid rgba(255,255,255,0.05);
  user-select: none;
  white-space: pre;
}

.markdown-body :deep(.code-body pre) {
  margin: 0;
  padding: 12px 14px;
  overflow: auto;
  flex: 1;
  background: transparent;
  border: none;
}

.markdown-body :deep(.code-body code) {
  background: none;
  padding: 0;
  font-size: 12px;
  color: #E6EDF3;
}

.modal-tags {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
}

.modal-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-base);
  display: flex;
  justify-content: flex-end;
}

/* Modal install button — match session-item.active */
.modal-footer .hixns-btn {
  padding: var(--space-2) var(--space-5) !important;
  font-size: var(--text-base) !important;
  font-weight: var(--font-semibold) !important;
  font-family: var(--font-sans) !important;
  min-height: 36px !important;
  border-radius: var(--radius-md) !important;
  background: linear-gradient(135deg, rgba(90, 200, 250, 0.25) 0%, rgba(90, 200, 250, 0.15) 100%) !important;
  border: 1px solid rgba(90, 200, 250, 0.35) !important;
  border-left-color: rgba(90, 200, 250, 0.6) !important;
  color: rgba(90, 200, 250, 1) !important;
  box-shadow: inset 0 0 0 1px rgba(90, 200, 250, 0.15), 0 0 16px rgba(90, 200, 250, 0.2) !important;
  transition: all var(--duration-150) var(--ease-expo) !important;
  position: relative;
  overflow: hidden;
}

.modal-footer .hixns-btn .btn-content {
  display: inline-flex !important;
  align-items: center !important;
  gap: var(--space-2) !important;
}

.modal-footer .hixns-btn svg {
  flex-shrink: 0 !important;
}

.modal-footer .hixns-btn::before,
.modal-footer .hixns-btn::after {
  display: none !important;
}

.modal-footer .hixns-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(90, 200, 250, 0.35) 0%, rgba(90, 200, 250, 0.2) 100%) !important;
  border-color: rgba(90, 200, 250, 0.5) !important;
  box-shadow: inset 0 0 0 1px rgba(90, 200, 250, 0.2), 0 0 20px rgba(90, 200, 250, 0.3) !important;
  transform: none !important;
}

.modal-footer .hixns-btn:active:not(:disabled) {
  background: linear-gradient(135deg, rgba(90, 200, 250, 0.18) 0%, rgba(90, 200, 250, 0.08) 100%) !important;
  box-shadow: inset 0 0 0 1px rgba(90, 200, 250, 0.06), 0 0 8px rgba(90, 200, 250, 0.08) !important;
  transform: scale(0.97) !important;
}

.install-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: var(--accent);
  border: none;
  border-radius: var(--radius-md);
  color: #fff;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: opacity var(--duration-150) var(--ease-expo);
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
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-family: var(--font-sans);
  z-index: 200;
  animation: toast-in var(--duration-200) ease;
}

.toast.success {
  background: var(--success);
  color: #fff;
}

.toast.error {
  background: var(--error);
  color: #fff;
}

.toast.warn {
  background: var(--warning);
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
  gap: 6px;
  background: transparent;
  border: none;
  border-radius: 0;
  overflow: visible;
}

.installed-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  transition: border-color var(--fast), box-shadow var(--fast);
}

.installed-item:hover {
  background: var(--bg-surface);
  border-color: var(--border-light);
  box-shadow: var(--shadow-sm);
}

.installed-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-glow);
  border-radius: var(--radius-md);
  color: var(--accent);
  flex-shrink: 0;
  margin-top: 1px;
}

.installed-icon :deep(svg) {
  display: block;
  width: 18px;
  height: 18px;
}

.installed-info {
  flex: 1;
  min-width: 0;
}

.installed-name {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.installed-name-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.installed-ver {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}

.installed-files {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}

.installed-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  padding: 1px 5px;
  border-radius: var(--radius-xs);
  font-weight: 600;
}

.source-badge.builtin {
  background: var(--bg-elevated);
  color: var(--text-tertiary);
}

.source-badge.2x {
  background: var(--primary-light);
  color: var(--primary-text);
}

.uninstall-btn {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid var(--border-base);
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-expo);
  flex-shrink: 0;
}

.uninstall-btn:hover {
  border-color: var(--error);
  color: var(--error);
}

.installed-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.update-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  background: var(--warning);
  color: #000;
  padding: 1px 5px;
  border-radius: 6px;
  margin-left: 6px;
  vertical-align: middle;
  animation: pulse 2s ease infinite;
}

.update-ver {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--warning);
  font-weight: 600;
}

.update-btn {
  padding: 4px 10px;
  background: var(--primary);
  border: none;
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: #fff;
  cursor: pointer;
  transition: opacity var(--duration-150) var(--ease-expo);
  flex-shrink: 0;
  font-weight: 600;
}

.update-btn:hover {
  opacity: 0.85;
}

/* Scrollbar */
.skill-store::-webkit-scrollbar { width: 6px; }
.skill-store::-webkit-scrollbar-track { background: transparent; }
.skill-store::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }

.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 2px; }

/* 安装按钮状态 */
.install-btn.installing {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--accent);
  color: #fff;
  border: none;
  cursor: default;
  font-size: var(--text-base);
  opacity: 0.85;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
