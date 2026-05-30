<template>
  <div class="files-view">
    <!-- Header -->
    <div class="files-header">
      <h2 class="files-title">{{ t('files.title') }}</h2>
      <div class="files-toolbar">
        <button class="toolbar-btn" @click="refresh" :title="t('files.refresh')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <button class="toolbar-btn primary" @click="triggerUpload" :title="t('files.upload')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>{{ t('files.upload') }}</span>
        </button>
        <button class="toolbar-btn" @click="showMkdirModal = true" :title="t('files.newFolder')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
          <span>{{ t('files.newFolder') }}</span>
        </button>
        <button class="toolbar-btn" @click="showNewFileModal = true; newFileName = ''" title="新建文件">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
          <span>新建文件</span>
        </button>
        <button v-if="selectedEntry" class="toolbar-btn" @click="downloadSelected" :title="t('files.download')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button v-if="selectedEntry" class="toolbar-btn" @click="showRenameModal = true; renameValue = selectedEntry.name" :title="t('files.rename')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button v-if="selectedEntry" class="toolbar-btn danger" @click="confirmDeleteEntry" :title="t('files.delete')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
        <button v-if="selectedEntry && selectedEntry.type !== 'dir'" class="toolbar-btn" @click="handleCopy" :title="'复制文件'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span>复制</span>
        </button>
        <button v-if="selectedEntry" class="toolbar-btn" @click="showProperties" title="属性">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>属性</span>
        </button>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="breadcrumb glass">
      <button
        v-for="(seg, idx) in breadcrumbs"
        :key="idx"
        class="breadcrumb-item"
        :class="{ active: idx === breadcrumbs.length - 1 }"
        @click="navigateBreadcrumb(idx)"
      >
        <svg v-if="idx === 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>{{ seg.name }}</span>
      </button>
    </div>

    <!-- Drop zone overlay -->
    <div v-if="dragOver" class="dropzone-overlay" @dragover.prevent @dragleave="dragOver = false" @drop.prevent="onDrop">
      <div class="dropzone-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p>{{ t('files.dropzone') }}</p>
      </div>
    </div>

    <!-- File list -->
    <div class="files-content" @dragover.prevent="dragOver = true" @dragleave="dragOver = false" @drop.prevent="onDrop">
      <!-- Loading -->
      <div v-if="loading" class="files-loading">
        <div class="spinner"></div>
        <span>{{ t('files.loading') }}</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="files-error">
        <span>{{ error }}</span>
        <button class="retry-btn" @click="refresh">{{ t('common.retry') }}</button>
      </div>

      <!-- Empty -->
      <div v-else-if="entries.length === 0" class="files-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        <p>{{ t('files.empty') }}</p>
      </div>

      <!-- Table -->
      <div v-else class="files-table-wrap">
        <table class="files-table">
          <thead>
            <tr>
              <th class="col-icon"></th>
              <th class="col-name">{{ t('files.name') }}</th>
              <th class="col-size">{{ t('files.size') }}</th>
              <th class="col-modified">{{ t('files.modified') }}</th>
              <th class="col-perms">{{ t('files.permissions') }}</th>
            </tr>
          </thead>
          <tbody>
            <!-- Parent dir row -->
            <tr v-if="currentPath !== homePath && breadcrumbs.length > 1" class="file-row parent-row" @click="navigateParent">
              <td class="col-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </td>
              <td class="col-name" colspan="4">..</td>
            </tr>
            <tr
              v-for="entry in entries"
              :key="entry.name"
              class="file-row"
              :class="{ selected: selectedEntry?.name === entry.name, 'is-dir': entry.type === 'dir' }"
              @click="onEntryClick(entry)"
              @dblclick="onEntryDblClick(entry)"
              @contextmenu.prevent="onEntryContext($event, entry)"
            >
              <td class="col-icon">
                <!-- Folder icon -->
                <svg v-if="entry.type === 'dir'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent, #00d4ff)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <!-- File icon -->
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </td>
              <td class="col-name">{{ entry.name }}</td>
              <td class="col-size">{{ entry.type === 'dir' ? '—' : formatSize(entry.size) }}</td>
              <td class="col-modified">{{ formatTime(entry.modified) }}</td>
              <td class="col-perms">{{ entry.permissions }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- File Preview Modal -->
    <HxModal v-model="showPreview" :title="previewFile?.name || 'Preview'" size="lg" width="800px">
      <div class="preview-content">
        <div v-if="previewLoading" class="preview-loading">
          <div class="spinner"></div>
        </div>
        <div v-else-if="previewError" class="preview-error">{{ previewError }}</div>
        <pre v-else class="preview-code"><code>{{ previewContent }}</code></pre>
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showPreview = false">{{ t('files.closePreview') }}</HxButton>
        <HxButton variant="primary" @click="downloadFile(previewFile?.path || '')">{{ t('files.download') }}</HxButton>
      </template>
    </HxModal>

    <!-- New Folder Modal -->
    <HxModal v-model="showMkdirModal" icon="plus" :title="t('files.newFolder')" size="sm">
      <div class="form-row">
        <label class="form-label">{{ t('files.folderName') }}</label>
        <input v-model="mkdirName" class="form-input" :placeholder="t('files.folderName')" @keydown.enter="createFolder" />
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showMkdirModal = false">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="primary" @click="createFolder" :disabled="!mkdirName.trim()">{{ t('files.createFolder') }}</HxButton>
      </template>
    </HxModal>

    <!-- Rename Modal -->
    <HxModal v-model="showRenameModal" icon="edit" :title="t('files.rename')" size="sm">
      <div class="form-row">
        <label class="form-label">{{ t('files.newName') }}</label>
        <input v-model="renameValue" class="form-input" :placeholder="t('files.newName')" @keydown.enter="renameEntry" />
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showRenameModal = false">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="primary" @click="renameEntry" :disabled="!renameValue.trim()">{{ t('common.confirm') }}</HxButton>
      </template>
    </HxModal>

    <!-- Delete Confirm Modal -->
    <HxModal v-model="showDeleteModal" icon="trash" icon-color="var(--error)" icon-bg="rgba(255,69,58,0.1)" :title="t('files.confirmDelete')" size="sm">
      <p class="delete-warning">
        {{ deleteTarget?.type === 'dir'
          ? t('files.deleteFolderWarning', { name: deleteTarget?.name })
          : t('files.deleteWarning', { name: deleteTarget?.name })
        }}
      </p>
      <template #footer>
        <HxButton variant="ghost" @click="showDeleteModal = false">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="danger" @click="deleteEntry">{{ t('common.confirm') }}</HxButton>
      </template>
    </HxModal>

    <!-- Copy modal -->
    <HxModal v-model="showCopyModal" icon="copy" :title="'复制文件'" size="sm">
      <div class="modal-form-group">
        <label class="modal-label">目标文件名</label>
        <input
          v-model="copyDestName"
          class="modal-input"
          placeholder="输入新文件名"
          @keydown.enter="confirmCopy"
        />
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showCopyModal = false">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="primary" @click="confirmCopy">{{ t('common.confirm') }}</HxButton>
      </template>
    </HxModal>

    <!-- New File Modal -->
    <HxModal v-model="showNewFileModal" :title="'新建文件'" size="sm">
      <div class="modal-form-group">
        <label class="modal-label">文件名</label>
        <input
          v-model="newFileName"
          class="modal-input"
          placeholder="例如: script.py, notes.md"
          @keydown.enter="createNewFile"
        />
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showNewFileModal = false">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="primary" @click="createNewFile" :disabled="!newFileName.trim()">创建</HxButton>
      </template>
    </HxModal>

    <!-- Properties Modal -->
    <HxModal v-model="showPropsModal" :title="'文件属性'" size="sm">
      <div v-if="propsLoading" style="text-align:center;padding:16px;"><div class="spinner"></div></div>
      <div v-else-if="propsData" class="props-grid">
        <div class="props-row"><span class="props-label">名称</span><span class="props-value">{{ propsData.name }}</span></div>
        <div class="props-row"><span class="props-label">路径</span><span class="props-value props-path">{{ propsData.path }}</span></div>
        <div class="props-row"><span class="props-label">类型</span><span class="props-value">{{ propsData.type === 'dir' ? '文件夹' : '文件' }}</span></div>
        <div class="props-row"><span class="props-label">大小</span><span class="props-value">{{ formatSize(propsData.size) }}</span></div>
        <div class="props-row"><span class="props-label">修改时间</span><span class="props-value">{{ formatTime(propsData.modified) }}</span></div>
        <div class="props-row"><span class="props-label">权限</span><span class="props-value">{{ propsData.permissions }}</span></div>
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showPropsModal = false">关闭</HxButton>
      </template>
    </HxModal>

    <!-- Hidden file input -->
    <input ref="fileInputRef" type="file" multiple class="hidden-input" @change="onFileInput" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { HxModal, HxButton } from '@/components/ui'
import {
  filesList, filesRead, filesUpload, filesDownload, filesMkdir, filesRename, filesDelete,
  fileCopy, fileWrite, fileStat, type FileEntry,
} from '@/api'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const toast = useToast()

// State
const currentPath = ref('bundled/hermes-agent')
const entries = ref<FileEntry[]>([])
const loading = ref(false)
const error = ref('')
const selectedEntry = ref<FileEntry | null>(null)
const dragOver = ref(false)

// Preview
const showPreview = ref(false)
const previewFile = ref<FileEntry | null>(null)
const previewContent = ref('')
const previewLoading = ref(false)
const previewError = ref('')

// Mkdir
const showMkdirModal = ref(false)
const mkdirName = ref('')

// New File
const showNewFileModal = ref(false)
const newFileName = ref('')

// Properties
const showPropsModal = ref(false)
const propsLoading = ref(false)
const propsData = ref<FileEntry & { path: string } | null>(null)

// Rename
const showRenameModal = ref(false)
const renameValue = ref('')

// Delete
const showDeleteModal = ref(false)
const deleteTarget = ref<FileEntry | null>(null)

// File input
const fileInputRef = ref<HTMLInputElement | null>(null)

// Home path (resolved from server)
const homePath = ref('~')

// Breadcrumbs
const breadcrumbs = computed(() => {
  // Project Root
  if (currentPath.value === '.') {
    return [{ name: 'Project', path: '.' }]
  }
  // Home Root
  if (currentPath.value === '~' || currentPath.value === homePath.value) {
    return [{ name: '~', path: '~' }]
  }
  
  const segs: Array<{ name: string; path: string }> = []
  
  // Handle Project sub-paths (e.g. bundled/hermes-agent)
  // Also handles absolute paths under project root like /root/x7k9m2p4/bundled/...
  const projRoot = '/root/x7k9m2p4'
  if (!currentPath.value.startsWith('/')) {
    // Relative path from Project Root
    segs.push({ name: 'Project', path: '.' })
    const parts = currentPath.value.split('/').filter(Boolean)
    let buildPath = '.'
    for (const part of parts) {
      buildPath = buildPath === '.' ? part : `${buildPath}/${part}`
      segs.push({ name: part, path: buildPath })
    }
    return segs
  } else if (currentPath.value.startsWith(projRoot)) {
    // Absolute path under Project Root
    segs.push({ name: 'Project', path: '.' })
    const rel = currentPath.value.slice(projRoot.length + 1)
    const parts = rel.split('/').filter(Boolean)
    let buildPath = '.'
    for (const part of parts) {
      buildPath = buildPath === '.' ? part : `${buildPath}/${part}`
      segs.push({ name: part, path: buildPath })
    }
    return segs
  }
  
  // Handle Home sub-paths (e.g. ~/docs)
  segs.push({ name: '~', path: '~' })
  let rel = currentPath.value
  if (rel.startsWith(homePath.value)) {
    rel = rel.slice(homePath.value.length)
  }
  const parts = rel.split('/').filter(Boolean)
  let buildPath = homePath.value === '~' ? '~' : homePath.value
  for (const part of parts) {
    buildPath = buildPath === '~' ? `~/${part}` : `${buildPath}/${part}`
    segs.push({ name: part, path: buildPath })
  }
  return segs
})

// Load directory
async function loadDir(path: string) {
  loading.value = true
  error.value = ''
  selectedEntry.value = null
  try {
    const result = await filesList(path)
    currentPath.value = result.path
    entries.value = result.entries
    // Update homePath with actual resolved path
    if (path === '~' && !homePath.value.startsWith('/')) {
      homePath.value = result.path
    }
  } catch (e: any) {
    error.value = e.message || String(e)
  } finally {
    loading.value = false
  }
}

function refresh() {
  loadDir(currentPath.value)
}

function navigateBreadcrumb(idx: number) {
  const seg = breadcrumbs.value[idx]
  if (seg) {
    loadDir(seg.path)
  }
}

function navigateParent() {
  if (breadcrumbs.value.length > 1) {
    const parentIdx = breadcrumbs.value.length - 2
    navigateBreadcrumb(parentIdx)
  }
}

function onEntryClick(entry: FileEntry) {
  if (selectedEntry.value?.name === entry.name) {
    // Double-click behavior: open
    onEntryDblClick(entry)
  } else {
    selectedEntry.value = entry
  }
}

function onEntryDblClick(entry: FileEntry) {
  if (entry.type === 'dir') {
    const newPath = currentPath.value === '~'
      ? `~/${entry.name}`
      : `${currentPath.value}/${entry.name}`
    loadDir(newPath)
  } else {
    previewEntry(entry)
  }
}

function onEntryContext(e: MouseEvent, entry: FileEntry) {
  selectedEntry.value = entry
}

// Preview
async function previewEntry(entry: FileEntry) {
  const fullPath = currentPath.value === '~'
    ? `~/${entry.name}`
    : `${currentPath.value}/${entry.name}`
  previewFile.value = { ...entry, path: fullPath }
  showPreview.value = true
  previewLoading.value = true
  previewContent.value = ''
  previewError.value = ''
  try {
    const result = await filesRead(fullPath)
    previewContent.value = result.content
  } catch (e: any) {
    previewError.value = e.message || String(e)
  } finally {
    previewLoading.value = false
  }
}

// Upload
function triggerUpload() {
  fileInputRef.value?.click()
}

async function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  for (const file of Array.from(input.files)) {
    try {
      await filesUpload(currentPath.value, file)
      toast.show(t('files.uploadSuccess'), 'success')
    } catch (e: any) {
      toast.show(t('files.uploadError') + ': ' + (e.message || String(e)), 'error')
    }
  }
  input.value = ''
  refresh()
}

async function onDrop(e: DragEvent) {
  dragOver.value = false
  const files = e.dataTransfer?.files
  if (!files?.length) return
  for (const file of Array.from(files)) {
    try {
      await filesUpload(currentPath.value, file)
      toast.show(t('files.uploadSuccess'), 'success')
    } catch (e: any) {
      toast.show(t('files.uploadError') + ': ' + (e.message || String(e)), 'error')
    }
  }
  refresh()
}

// Mkdir
async function createFolder() {
  if (!mkdirName.value.trim()) return
  const path = currentPath.value === '~'
    ? `~/${mkdirName.value.trim()}`
    : `${currentPath.value}/${mkdirName.value.trim()}`
  try {
    await filesMkdir(path)
    toast.show(t('files.createSuccess'), 'success')
    showMkdirModal.value = false
    mkdirName.value = ''
    refresh()
  } catch (e: any) {
    toast.show(t('files.createError') + ': ' + (e.message || String(e)), 'error')
  }
}

// New File
async function createNewFile() {
  if (!newFileName.value.trim()) return
  const path = currentPath.value === '~'
    ? `~/${newFileName.value.trim()}`
    : `${currentPath.value}/${newFileName.value.trim()}`
  try {
    await fileWrite(path, '')
    toast.show('文件已创建', 'success')
    showNewFileModal.value = false
    newFileName.value = ''
    refresh()
  } catch (e: any) {
    toast.show('创建文件失败: ' + (e.message || String(e)), 'error')
  }
}

// Properties
async function showProperties() {
  if (!selectedEntry.value) return
  const fullPath = currentPath.value === '~'
    ? `~/${selectedEntry.value.name}`
    : `${currentPath.value}/${selectedEntry.value.name}`
  showPropsModal.value = true
  propsLoading.value = true
  propsData.value = null
  try {
    const stat = await fileStat(fullPath)
    propsData.value = {
      name: selectedEntry.value.name,
      path: fullPath.replace(/^~/, homePath.value),
      type: stat.is_dir ? 'dir' : selectedEntry.value.type,
      size: stat.size ?? selectedEntry.value.size,
      modified: stat.modified ?? selectedEntry.value.modified,
      permissions: stat.permissions ?? selectedEntry.value.permissions,
    }
  } catch (e: any) {
    // Fallback to entry data
    propsData.value = {
      name: selectedEntry.value.name,
      path: fullPath.replace(/^~/, homePath.value),
      type: selectedEntry.value.type,
      size: selectedEntry.value.size,
      modified: selectedEntry.value.modified,
      permissions: selectedEntry.value.permissions,
    }
  } finally {
    propsLoading.value = false
  }
}

// Rename
async function renameEntry() {
  if (!selectedEntry.value || !renameValue.value.trim()) return
  const fullPath = currentPath.value === '~'
    ? `~/${selectedEntry.value.name}`
    : `${currentPath.value}/${selectedEntry.value.name}`
  try {
    await filesRename(fullPath, renameValue.value.trim())
    toast.show(t('files.renameSuccess'), 'success')
    showRenameModal.value = false
    renameValue.value = ''
    selectedEntry.value = null
    refresh()
  } catch (e: any) {
    toast.show(t('files.renameError') + ': ' + (e.message || String(e)), 'error')
  }
}

// Delete
function confirmDeleteEntry() {
  if (!selectedEntry.value) return
  deleteTarget.value = selectedEntry.value
  showDeleteModal.value = true
}

async function deleteEntry() {
  if (!deleteTarget.value) return
  const fullPath = currentPath.value === '~'
    ? `~/${deleteTarget.value.name}`
    : `${currentPath.value}/${deleteTarget.value.name}`
  try {
    await filesDelete(fullPath)
    toast.show(t('files.deleteSuccess'), 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    selectedEntry.value = null
    refresh()
  } catch (e: any) {
    toast.show(t('files.deleteError') + ': ' + (e.message || String(e)), 'error')
  }
}

// Copy
const showCopyModal = ref(false)
const copyDestName = ref('')

async function handleCopy() {
  if (!selectedEntry.value || selectedEntry.value.type === 'dir') return
  const srcPath = currentPath.value === '~'
    ? `~/${selectedEntry.value.name}`
    : `${currentPath.value}/${selectedEntry.value.name}`
  // Default: copy to same name with _copy suffix
  const baseName = selectedEntry.value.name
  const dotIdx = baseName.lastIndexOf('.')
  const name = dotIdx > 0 ? baseName.substring(0, dotIdx) : baseName
  const ext = dotIdx > 0 ? baseName.substring(dotIdx) : ''
  copyDestName.value = `${name}_copy${ext}`
  showCopyModal.value = true
}

async function confirmCopy() {
  if (!selectedEntry.value || !copyDestName.value.trim()) return
  const srcPath = currentPath.value === '~'
    ? `~/${selectedEntry.value.name}`
    : `${currentPath.value}/${selectedEntry.value.name}`
  const dstPath = currentPath.value === '~'
    ? `~/${copyDestName.value.trim()}`
    : `${currentPath.value}/${copyDestName.value.trim()}`
  try {
    await fileCopy(srcPath, dstPath)
    toast.show('文件已复制', 'success')
    showCopyModal.value = false
    copyDestName.value = ''
    selectedEntry.value = null
    refresh()
  } catch (e: any) {
    toast.show('复制失败: ' + (e.message || String(e)), 'error')
  }
}

// Download
async function downloadSelected() {
  if (!selectedEntry.value || selectedEntry.value.type === 'dir') return
  const fullPath = currentPath.value === '~'
    ? `~/${selectedEntry.value.name}`
    : `${currentPath.value}/${selectedEntry.value.name}`
  await downloadFile(fullPath)
}

async function downloadFile(filePath: string) {
  try {
    await filesDownload(filePath)
  } catch (e: any) {
    toast.show(t('files.downloadError') + ': ' + (e.message || String(e)), 'error')
  }
}

// Formatting helpers
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = [t('files.bytes'), t('files.kilobytes'), t('files.megabytes'), t('files.gigabytes')]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + ' ' + units[i]
}

function formatTime(iso: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

// Init
onMounted(() => {
  loadDir(currentPath.value)
})
</script>

<style scoped>
.files-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  gap: 16px;
  overflow: hidden;
}

.files-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;
}

.files-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
}

.files-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm, 8px);
  background: var(--bg-elevated, rgba(255,255,255,0.06));
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  white-space: nowrap;
}

.toolbar-btn:hover {
  background: var(--bg-surface, rgba(255,255,255,0.1));
  color: var(--text-primary);
  border-color: var(--border-light, rgba(255,255,255,0.15));
}

.toolbar-btn.primary {
  background: var(--accent, #00d4ff);
  color: #000;
  border-color: transparent;
  font-weight: 600;
}

.toolbar-btn.primary:hover {
  filter: brightness(1.15);
}

.toolbar-btn.danger {
  color: var(--error, #ff453a);
  border-color: rgba(255, 69, 58, 0.3);
}

.toolbar-btn.danger:hover {
  background: rgba(255, 69, 58, 0.15);
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  border-radius: var(--radius-sm, 8px);
  flex-shrink: 0;
  overflow-x: auto;
  font-size: 13px;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 13px;
  transition: all 0.15s;
  white-space: nowrap;
}

.breadcrumb-item:hover {
  color: var(--accent, #00d4ff);
  background: rgba(0, 212, 255, 0.08);
}

.breadcrumb-item.active {
  color: var(--text-primary);
  font-weight: 600;
  cursor: default;
}

.breadcrumb-item.active:hover {
  background: none;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: '/';
  color: var(--text-secondary);
  opacity: 0.5;
  margin-right: 2px;
}

/* Content area */
.files-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  min-height: 0;
}

/* Drop zone overlay */
.dropzone-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  background: rgba(0, 212, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 2px dashed var(--accent, #00d4ff);
  border-radius: var(--radius-md, 12px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--accent, #00d4ff);
}

.dropzone-content p {
  font-size: 16px;
  font-weight: 600;
}

/* Loading / Error / Empty states */
.files-loading,
.files-error,
.files-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 16px;
  color: var(--text-secondary);
}

.files-empty svg {
  opacity: 0.3;
}

.files-error {
  color: var(--error, #ff453a);
}

.retry-btn {
  padding: 6px 16px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-base);
  background: var(--bg-elevated);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 13px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border-base);
  border-top-color: var(--accent, #00d4ff);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* File table */
.files-table-wrap {
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
  background: var(--bg-elevated, rgba(255,255,255,0.03));
  backdrop-filter: blur(16px) saturate(1.4);
}

.files-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.files-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

.files-table th {
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-surface, rgba(255,255,255,0.04));
  border-bottom: 1px solid var(--border-base);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.files-table td {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  color: var(--text-primary);
}

.col-icon {
  width: 32px;
  text-align: center;
}

.col-name {
  min-width: 200px;
  word-break: break-all;
}

.col-size {
  width: 90px;
  text-align: right;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.col-modified {
  width: 180px;
  color: var(--text-secondary);
  font-size: 12px;
}

.col-perms {
  width: 100px;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
}

.file-row {
  cursor: pointer;
  transition: background 0.15s;
}

.file-row:hover {
  background: rgba(0, 212, 255, 0.05);
}

.file-row.selected {
  background: rgba(0, 212, 255, 0.1);
}

.file-row.selected .col-name {
  color: var(--accent, #00d4ff);
}

.file-row.is-dir .col-name {
  font-weight: 600;
}

.parent-row {
  color: var(--text-secondary);
}

.parent-row:hover {
  color: var(--text-primary);
}

/* Preview modal */
.preview-content {
  min-height: 200px;
  max-height: 60vh;
  overflow: auto;
}

.preview-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.preview-error {
  color: var(--error, #ff453a);
  padding: 16px;
  text-align: center;
}

.preview-code {
  background: var(--bg-surface, rgba(0,0,0,0.3));
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm, 8px);
  padding: 16px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-primary);
  margin: 0;
}

/* Form elements in modals */
.form-row {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm, 8px);
  background: var(--bg-elevated, rgba(255,255,255,0.06));
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--accent, #00d4ff);
}

.form-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.delete-warning {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.delete-warning strong {
  color: var(--error, #ff453a);
}

.hidden-input {
  display: none;
}

/* Glass utility */
.glass {
  background: var(--bg-elevated, rgba(255,255,255,0.06));
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid var(--border-base);
}

/* Properties Modal */
.props-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
}

.props-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.props-label {
  min-width: 64px;
  font-size: 12px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.props-value {
  font-size: 13px;
  color: var(--text-primary);
  word-break: break-all;
}

.props-path {
  font-family: var(--font-mono, 'Menlo, Monaco, Consolas, monospace');
  font-size: 12px;
}
</style>
