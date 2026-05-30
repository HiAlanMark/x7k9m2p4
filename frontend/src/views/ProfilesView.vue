<template>
  <div class="profiles-view">
    <header class="profiles-header">
      <h1 class="profiles-title">{{ t('profiles.title') }}</h1>
      <p class="profiles-subtitle">{{ t('profiles.subtitle') }}</p>
    </header>

    <!-- Create new profile -->
    <div class="profiles-create glass-panel">
      <HxInput
        v-model="newProfileName"
        :placeholder="t('profiles.namePlaceholder')"
        class="profiles-create-input"
        @keydown.enter="handleCreate"
      />
      <HxButton :loading="creating" :disabled="!newProfileName.trim()" @click="handleCreate">
        {{ t('profiles.create') }}
      </HxButton>
    </div>

    <!-- Import button -->
    <div class="profiles-actions">
      <HxButton variant="secondary" size="sm" @click="triggerImport">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {{ t('common.import') }}
      </HxButton>
      <input
        ref="importInputRef"
        type="file"
        accept=".tar.gz,.tgz"
        style="display: none"
        @change="handleImport"
      />
    </div>

    <!-- Loading state -->
    <div v-if="profilesStore.loading" class="profiles-loading">
      <HxSpinner size="md" />
      <span>{{ t('common.loading') }}</span>
    </div>

    <!-- Error state -->
    <div v-if="profilesStore.error" class="profiles-error">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      <span>{{ profilesStore.error }}</span>
    </div>

    <!-- Profile cards -->
    <div v-if="!profilesStore.loading" class="profiles-grid">
      <div
        v-for="p in profilesStore.profiles"
        :key="p.name"
        class="profile-card glass-panel"
        :class="{ 'profile-card--active': p.is_active }"
      >
        <!-- Active indicator: cyan left border -->
        <div v-if="p.is_active" class="profile-active-indicator"></div>

        <div class="profile-card-header">
          <div class="profile-name-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span class="profile-name">{{ p.name }}</span>
            <span v-if="p.is_active" class="profile-badge">{{ t('profiles.active') }}</span>
          </div>
        </div>

        <div class="profile-card-meta">
          <div class="profile-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>{{ p.sessions }} {{ t('profiles.sessions') }}</span>
          </div>
          <div class="profile-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{{ formatDate(p.created_at) }}</span>
          </div>
          <!-- Runtime status indicator -->
          <div v-if="getRuntimeStatus(p.name)" class="profile-meta-item">
            <span class="runtime-dot" :class="{ running: getRuntimeStatus(p.name)!.running }"></span>
            <span>{{ getRuntimeStatus(p.name)!.running ? '运行中' : '已停止' }}</span>
          </div>
        </div>

        <div class="profile-card-actions">
          <!-- Switch button -->
          <HxButton
            v-if="!p.is_active"
            variant="secondary"
            size="sm"
            @click="confirmSwitch(p.name)"
          >
            {{ t('profiles.switch') }}
          </HxButton>

          <!-- Export button -->
          <HxButton
            variant="ghost"
            size="sm"
            :loading="exportingName === p.name"
            @click="handleExport(p.name)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {{ t('common.export') }}
          </HxButton>

          <!-- Delete button (disabled for active/default) -->
          <HxButton
            variant="danger"
            size="sm"
            :disabled="p.is_active || p.name === 'default'"
            @click="confirmDelete(p.name)"
          >
            {{ t('common.delete') }}
          </HxButton>

          <!-- Restart button (when stopped) -->
          <HxButton
            v-if="getRuntimeStatus(p.name) && !getRuntimeStatus(p.name)!.running"
            variant="ghost"
            size="sm"
            @click="handleRestart(p.name)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            启动
          </HxButton>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <HxEmpty
      v-if="!profilesStore.loading && profilesStore.profiles.length === 0"
      :title="t('profiles.empty')"
    />

    <!-- Confirm Modal: Switch -->
    <HxModal v-model="switchModalVisible" :title="t('profiles.switchTitle')" icon="info" size="sm">
      <p class="confirm-text">{{ t('profiles.switchConfirm', { name: switchTargetName }) }}</p>
      <template #footer>
        <HxButton variant="secondary" size="sm" @click="switchModalVisible = false">{{ t('common.cancel') }}</HxButton>
        <HxButton :loading="switching" @click="handleSwitch">{{ t('profiles.switch') }}</HxButton>
      </template>
    </HxModal>

    <!-- Confirm Modal: Delete -->
    <HxModal v-model="deleteModalVisible" :title="t('profiles.deleteTitle')" icon="alert-triangle" size="sm">
      <p class="confirm-text">{{ t('profiles.deleteConfirm', { name: deleteTargetName }) }}</p>
      <template #footer>
        <HxButton variant="secondary" size="sm" @click="deleteModalVisible = false">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="danger" :loading="deleting" @click="handleDelete">{{ t('common.delete') }}</HxButton>
      </template>
    </HxModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProfilesStore } from '@/stores/profiles'
import { HxButton, HxInput, HxModal, HxSpinner, HxEmpty } from '@/components/ui'
import { profilesRuntimeStatuses, profileRestart, type ProfileRuntimeStatus } from '@/api'

const { t } = useI18n()
const profilesStore = useProfilesStore()

const newProfileName = ref('')
const creating = ref(false)
const exportingName = ref('')
const switching = ref(false)
const deleting = ref(false)

// Switch modal
const switchModalVisible = ref(false)
const switchTargetName = ref('')

// Delete modal
const deleteModalVisible = ref(false)
const deleteTargetName = ref('')

// Import
const importInputRef = ref<HTMLInputElement | null>(null)

// ── Runtime status ──
const runtimeStatuses = ref<ProfileRuntimeStatus[]>([])
const runtimeLoading = ref(false)

async function loadRuntimeStatuses() {
  runtimeLoading.value = true
  try {
    const data = await profilesRuntimeStatuses()
    runtimeStatuses.value = data.profiles || []
  } catch {
    // ignore
  } finally {
    runtimeLoading.value = false
  }
}

function getRuntimeStatus(name: string): ProfileRuntimeStatus | undefined {
  return runtimeStatuses.value.find(p => p.name === name)
}

async function handleRestart(name: string) {
  try {
    await profileRestart(name)
    await loadRuntimeStatuses()
  } catch {
    // ignore
  }
}

onMounted(() => {
  profilesStore.fetchProfiles()
  loadRuntimeStatuses()
})

async function handleCreate() {
  const name = newProfileName.value.trim()
  if (!name) return
  creating.value = true
  const ok = await profilesStore.createProfile(name)
  creating.value = false
  if (ok) {
    newProfileName.value = ''
  }
}

function confirmSwitch(name: string) {
  switchTargetName.value = name
  switchModalVisible.value = true
}

async function handleSwitch() {
  switching.value = true
  const ok = await profilesStore.switchProfile(switchTargetName.value)
  switching.value = false
  if (ok) {
    switchModalVisible.value = false
  }
}

function confirmDelete(name: string) {
  deleteTargetName.value = name
  deleteModalVisible.value = true
}

async function handleDelete() {
  deleting.value = true
  const ok = await profilesStore.deleteProfile(deleteTargetName.value)
  deleting.value = false
  if (ok) {
    deleteModalVisible.value = false
  }
}

async function handleExport(name: string) {
  exportingName.value = name
  await profilesStore.exportProfile(name)
  exportingName.value = ''
}

function triggerImport() {
  importInputRef.value?.click()
}

async function handleImport(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  await profilesStore.importProfile(file)
  target.value = ''
}

function formatDate(iso: string): string {
  if (!iso) return '--'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString()
  } catch {
    return iso
  }
}
</script>

<style scoped>
.profiles-view {
  padding: 32px 40px;
  max-width: 960px;
  margin: 0 auto;
}

.profiles-header {
  margin-bottom: 28px;
}

.profiles-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.profiles-subtitle {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0;
}

/* Create bar */
.profiles-create {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(var(--blur-md)) saturate(1.4);
  -webkit-backdrop-filter: blur(var(--blur-md)) saturate(1.4);
}

.profiles-create-input {
  flex: 1;
}

/* Actions row */
.profiles-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

/* Loading & Error */
.profiles-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  padding: 32px 0;
  justify-content: center;
}

.profiles-error {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-danger, #f87171);
  padding: 12px 16px;
  background: rgba(248, 113, 113, 0.08);
  border-radius: var(--radius-md);
  margin-bottom: 16px;
}

/* Grid */
.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* Card */
.profile-card {
  position: relative;
  padding: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(var(--blur-md)) saturate(1.4);
  -webkit-backdrop-filter: blur(var(--blur-md)) saturate(1.4);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.profile-card:hover {
  border-color: var(--border-light);
  box-shadow: var(--shadow-md);
}

.profile-card--active {
  border-color: rgba(90, 200, 250, 0.35);
  box-shadow: inset 0 0 0 1px rgba(90, 200, 250, 0.12), var(--shadow-sm);
}

/* Active indicator: cyan left border */
.profile-active-indicator {
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 3px;
  background: rgba(90, 200, 250, 0.85);
  box-shadow: 0 0 8px rgba(90, 200, 250, 0.3);
}

.profile-card-header {
  margin-bottom: 14px;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
}

.profile-name {
  font-size: 16px;
  font-weight: 600;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(90, 200, 250, 1);
  background: rgba(90, 200, 250, 0.12);
  border: 1px solid rgba(90, 200, 250, 0.22);
  border-radius: var(--radius-sm);
  letter-spacing: 0.02em;
}

/* Meta */
.profile-card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.profile-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-tertiary);
}

/* Actions */
.profile-card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Confirm modal text */
.confirm-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Glass panel */
.glass-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(var(--blur-md)) saturate(1.4);
  -webkit-backdrop-filter: blur(var(--blur-md)) saturate(1.4);
}

/* Runtime status dot */
.runtime-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-tertiary);
  flex-shrink: 0;
}
.runtime-dot.running {
  background: var(--success, #3fb950);
  animation: runtime-pulse 2s infinite;
}
@keyframes runtime-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
