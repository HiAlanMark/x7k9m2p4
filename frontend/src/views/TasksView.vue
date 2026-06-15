<template>
  <div class="tasks-view" @scroll="onTasksScroll" ref="tasksRef" :class="{ 'tasks-scrolled': tasksScrolled }">
    <!-- Header -->
    <div class="tasks-header">
      <div class="header-left">
        <h1 class="tasks-title">{{ t('tasks.title') }}</h1>
        <span class="store-count" v-if="allTasks.length > 0">{{ allTasks.length }} {{ t('tasks.taskCount') }}</span>
      </div>
    </div>

    <!-- Create modal -->
    <HxModal v-model="showCreate" :icon="'plus'" :title="t('tasks.createCron')" width="520px">
      <div class="form-row">
        <label class="form-label">{{ t('tasks.taskName') }}</label>
        <HxInput v-model="newTask.name" :placeholder="t('tasks.taskNamePlaceholder')" />
      </div>
      <div class="form-row">
        <label class="form-label">{{ t('tasks.executionPlan') }}</label>
        <HxInput v-model="newTask.schedule" :placeholder="t('tasks.schedulePlaceholder')" />
        <p class="form-hint">{{ t('tasks.scheduleHint') }}</p>
      </div>
      <div class="form-row">
        <label class="form-label">{{ t('tasks.prompt') }}</label>
        <HxTextarea v-model="newTask.prompt" :placeholder="t('tasks.prompt')" :rows="3" />
      </div>
      <div class="form-row">
        <label class="form-label">{{ t('tasks.skillsOptional') }}</label>
        <HxInput v-model="skillsSearch" :placeholder="t('tasks.skillsSearchPlaceholder')" @focus="fetchAvailableSkills()" />
        <div v-if="filteredSkills.length > 0" class="skills-suggest">
          <button
            v-for="sk in filteredSkills"
            :key="sk.slug"
            :class="['skill-chip', { selected: isSkillSelected(sk.slug) }]"
            @click="toggleSkill(sk.slug)"
          >
            {{ sk.name }}
            <span class="chip-cat">{{ sk.category }}</span>
          </button>
        </div>
        <p v-if="newTask.skills" class="form-hint">{{ t('tasks.selected') }}: {{ newTask.skills }}</p>
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="showCreate = false">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="primary" @click="createTask">{{ t('common.create') }}</HxButton>
      </template>
    </HxModal>

    <!-- Edit modal -->
    <HxModal v-model="editVisible" :icon="'edit'" :title="t('tasks.editTask')" width="520px">
      <div class="form-row">
        <label class="form-label">{{ t('tasks.taskName') }}</label>
        <HxInput v-model="editForm.name" />
      </div>
      <div class="form-row">
        <label class="form-label">{{ t('tasks.executionPlan') }}</label>
        <HxInput v-model="editForm.schedule" />
        <p class="form-hint">{{ t('tasks.scheduleHint') }}</p>
      </div>
      <div class="form-row">
        <label class="form-label">{{ t('tasks.prompt') }}</label>
        <HxTextarea v-model="editForm.prompt" :rows="3" />
      </div>
      <div class="form-row">
        <label class="form-label">{{ t('tasks.skillsOptional') }}</label>
        <HxInput v-model="editSkillsSearch" :placeholder="t('tasks.skillsSearchPlaceholder')" @focus="fetchAvailableSkills()" />
        <div v-if="filteredEditSkills.length > 0" class="skills-suggest">
          <button
            v-for="sk in filteredEditSkills"
            :key="sk.slug"
            :class="['skill-chip', { selected: isEditSkillSelected(sk.slug) }]"
            @click="toggleEditSkill(sk.slug)"
          >
            {{ sk.name }}
            <span class="chip-cat">{{ sk.category }}</span>
          </button>
        </div>
        <p v-if="editSkills" class="form-hint">{{ t('tasks.selected') }}: {{ editSkills }}</p>
      </div>
      <template #footer>
        <HxButton variant="ghost" @click="editingTask = null">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="primary" @click="saveEdit">{{ t('tasks.saveChanges') }}</HxButton>
      </template>
    </HxModal>

    <!-- Delete confirm modal -->
    <HxModal v-model="deleteVisible" :icon="'trash'" icon-color="var(--error)" icon-bg="rgba(255,69,58,0.1)" :title="t('tasks.deleteTask')" width="440px">
      <p class="section-text">{{ t('tasks.deleteConfirmPrefix') }} <strong>{{ deleteTarget?.name }}</strong> {{ t('tasks.deleteConfirmSuffix') }}</p>
      <template #footer>
        <HxButton variant="ghost" @click="deleteTarget = null">{{ t('common.cancel') }}</HxButton>
        <HxButton variant="danger" @click="confirmDeleteTask">{{ t('common.confirm') }}</HxButton>
      </template>
    </HxModal>

    <!-- Tabs -->
    <div class="tabs-row">
      <div class="main-tabs">
        <button :class="['main-tab', { active: activeTab === 'cron' }]" @click="activeTab = 'cron'">
          {{ t('tasks.cron') }}
          <span class="tab-count">{{ cronTasks.length }}</span>
        </button>
        <button :class="['main-tab', { active: activeTab === 'running' }]" @click="activeTab = 'running'">
          {{ t('tasks.executing') }}
          <span :class="['tab-count', { live: runningTasks.length > 0 }]">{{ runningTasks.length }}</span>
        </button>
        <button :class="['main-tab', { active: activeTab === 'history' }]" @click="activeTab = 'history'">
          {{ t('tasks.executionHistory') }}
          <span class="tab-count">{{ historyTasks.length }}</span>
        </button>
        <button :class="['main-tab', { active: activeTab === 'stats' }]" @click="activeTab = 'stats'; loadSkillsStats()">
          工具统计
        </button>
        <button :class="['main-tab', { active: activeTab === 'cron-history' }]" @click="activeTab = 'cron-history'; loadCronHistory()">
          运行历史
        </button>
      </div>
      <HxButton variant="primary" size="sm" @click="toggleCreate">
        + {{ t('tasks.createNew') }}
      </HxButton>
    </div>

    <!-- Cron tasks list -->
    <template v-if="activeTab === 'cron'">
      <HxEmpty v-if="cronTasks.length === 0">
        <template #default>
          <div class="empty-text">{{ t('tasks.emptyCron') }}</div>
          <div class="empty-hint">{{ t('tasks.emptyCronHint') }}</div>
        </template>
      </HxEmpty>
      <div v-else class="task-list">
        <div v-for="task in cronTasks" :key="task.id" class="task-card" :class="{ paused: task.status === 'paused' }">
          <div class="task-header">
            <div class="task-header-left">
              <span :class="['task-dot', task.status]"></span>
              <span class="task-name">{{ task.name }}</span>
              <span class="task-schedule">{{ task.schedule }}</span>
              <HxBadge :variant="task.status === 'active' ? 'success' : task.status === 'paused' ? 'warning' : 'info'" size="sm">{{ statusLabel(task.status) }}</HxBadge>
            </div>
            <div class="task-header-right">
              <span class="task-meta" v-if="task.nextRun">{{ t('tasks.nextRun') }}: {{ formatTime(task.nextRun) }}</span>
              <span class="task-meta" v-if="task.lastRun">{{ t('tasks.lastRun') }}: {{ formatTime(task.lastRun) }}</span>
            </div>
          </div>
          <div class="task-prompt" v-if="task.prompt">{{ task.prompt }}</div>
          <div v-if="task.skills && task.skills.length" class="task-skills">
            <span v-for="s in (Array.isArray(task.skills) ? task.skills : task.skills.split(','))" :key="s" class="skill-tag">{{ typeof s === 'string' ? s.trim() : s }}</span>
          </div>
          <div class="task-footer">
            <div class="task-actions">
              <HxButton variant="ghost" size="sm" @click="editTask(task)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <span>编辑</span>
              </HxButton>
              <HxButton v-if="task.status === 'active'" variant="ghost" size="sm" @click="pauseTask(task)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                <span>暂停</span>
              </HxButton>
              <HxButton v-if="task.status === 'paused'" variant="ghost" size="sm" @click="resumeTask(task)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                <span>恢复</span>
              </HxButton>
              <HxButton variant="ghost" size="sm" @click="runTask(task)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                <span>执行</span>
              </HxButton>
              <HxButton variant="danger" size="sm" @click="deleteTask(task)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                <span>删除</span>
              </HxButton>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Running tasks -->
    <template v-if="activeTab === 'running'">
      <HxEmpty v-if="runningTasks.length === 0">
        <template #default>
          <div class="empty-text">没有正在运行的任务</div>
        </template>
      </HxEmpty>
      <div v-else class="task-list">
        <div v-for="task in runningTasks" :key="task.id" class="task-card running">
          <div class="task-header">
            <div class="task-header-left">
              <span class="task-dot running"></span>
              <span class="task-name">{{ task.name }}</span>
              <span class="task-schedule">{{ task.schedule }}</span>
              <HxBadge variant="success" size="sm">运行中</HxBadge>
            </div>
            <div class="task-header-right">
              <span class="task-meta" v-if="task.nextRun">下次: {{ formatTime(task.nextRun) }}</span>
            </div>
          </div>
          <div class="task-prompt" v-if="task.prompt">{{ task.prompt }}</div>
          <div v-if="task.skills && task.skills.length" class="task-skills">
            <span v-for="s in (Array.isArray(task.skills) ? task.skills : task.skills.split(','))" :key="s" class="skill-tag">{{ typeof s === 'string' ? s.trim() : s }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- History -->
    <template v-if="activeTab === 'history'">
      <HxEmpty v-if="historyTasks.length === 0">
        <template #default>
          <div class="empty-text">暂无执行记录</div>
        </template>
      </HxEmpty>
      <div v-else class="task-list">
        <div v-for="task in historyTasks" :key="task.id" class="task-card history" :class="task.result">
          <div class="task-header">
            <div class="task-header-left">
              <span :class="['result-dot', task.result]"></span>
              <span class="task-name">{{ task.name }}</span>
            </div>
            <div class="task-header-right">
              <span class="task-time">{{ formatTime(task.finishedAt) }}</span>
              <HxBadge :variant="task.result === 'success' ? 'success' : 'error'" size="sm">{{ task.result === 'success' ? '成功' : '失败' }}</HxBadge>
            </div>
          </div>
          <div v-if="task.output" class="task-output">
            <div class="task-output-header">
              <span class="task-output-label">输出</span>
            </div>
            <pre class="task-output-body">{{ task.output.substring(0, 800) }}{{ task.output.length > 800 ? '...' : '' }}</pre>
          </div>
        </div>
      </div>
    </template>

    <!-- Tool usage stats -->
    <template v-if="activeTab === 'stats'">
      <HxCard>
        <template #header>
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span>工具调用统计</span>
            <HxButton size="sm" variant="ghost" @click="loadSkillsStats" :loading="statsLoading">刷新</HxButton>
          </div>
        </template>
        <div v-if="statsLoading" style="text-align: center; padding: 24px; color: var(--text-tertiary);">加载中...</div>
        <div v-else-if="skillsStats.length === 0" style="text-align: center; padding: 24px; color: var(--text-tertiary);">暂无工具调用数据</div>
        <table v-else class="data-table" style="margin-top: 8px;">
          <thead>
            <tr>
              <th>工具名</th>
              <th>调用次数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in skillsStats" :key="s.tool_name">
              <td class="cell-mono">{{ s.tool_name }}</td>
              <td>{{ s.count }}</td>
            </tr>
          </tbody>
        </table>
      </HxCard>
    </template>

    <!-- Cron run history from backend -->
    <template v-if="activeTab === 'cron-history'">
      <HxCard>
        <template #header>
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span>Cron 运行历史</span>
            <HxButton size="sm" variant="ghost" @click="loadCronHistory" :loading="cronHistoryLoading">刷新</HxButton>
          </div>
        </template>
        <div v-if="cronHistoryLoading" style="text-align: center; padding: 24px; color: var(--text-tertiary);">加载中...</div>
        <div v-else-if="cronHistoryList.length === 0" style="text-align: center; padding: 24px; color: var(--text-tertiary);">暂无 Cron 运行记录</div>
        <table v-else class="data-table" style="margin-top: 8px;">
          <thead>
            <tr>
              <th>任务名</th>
              <th>调度</th>
              <th>上次运行</th>
              <th>下次运行</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in cronHistoryList" :key="h.id">
              <td class="cell-mono">{{ h.name }}</td>
              <td><code>{{ h.schedule }}</code></td>
              <td>{{ h.last_run ? formatDate(h.last_run) : '—' }}</td>
              <td>{{ h.next_run ? formatDate(h.next_run) : '—' }}</td>
              <td>
                <HxBadge :variant="h.last_status === 'success' ? 'success' : h.last_status === 'error' ? 'error' : 'info'" size="sm">
                  {{ h.last_status || 'pending' }}
                </HxBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </HxCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { hermesCronList, hermesCronCreate, hermesCronPause, hermesCronResume, hermesCronRemove, hermesCronRun, hermesCronUpdate, agentFetch, cronHistory as apiCronHistory, skillsUsageStats as apiSkillsUsageStats, type SkillUsageStat } from '../api'
import { HxButton, HxInput, HxTextarea, HxCard, HxBadge, HxSpinner, HxEmpty, HxModal } from '../components/ui'
import { useToast } from '../composables/useToast'

const { t } = useI18n()
const toast = useToast()

// Scroll mask
const tasksRef = ref<HTMLElement | null>(null)
const tasksScrolled = ref(false)
function onTasksScroll() {
  tasksScrolled.value = (tasksRef.value?.scrollTop || 0) > 10
}

interface CronTask {
  id: string
  name: string
  schedule: string
  prompt: string
  skills?: string
  status: 'active' | 'paused' | 'running'
  lastRun?: string
  nextRun?: string
  runCount?: number
}

interface RunningTask {
  id: string
  name: string
  prompt: string
  startedAt: string
  output?: string
}

interface HistoryTask {
  id: string
  name: string
  finishedAt: string
  result: 'success' | 'failed'
  output?: string
  duration?: string
  trigger?: string
}

const activeTab = ref<'cron' | 'running' | 'history' | 'stats' | 'cron-history'>('cron')
const showCreate = ref(false)
function toggleCreate() { showCreate.value = !showCreate.value }
const newTask = ref({ name: '', schedule: '', prompt: '', skills: '' })
const editingTask = ref<CronTask | null>(null)
const editForm = ref({ name: '', schedule: '', prompt: '' })
const editSkills = ref('')
const editVisible = computed({
  get: () => editingTask.value !== null,
  set: (v: boolean) => { if (!v) editingTask.value = null }
})

// 可选的技能列表
const availableSkills = ref<{slug: string; name: string; category: string}[]>([])
const skillsSearch = ref('')

async function fetchAvailableSkills() {
  try {
    const r = await agentFetch('/v1/agent/skills')
    const data = await r.json()
    availableSkills.value = (data.skills || []).map((s: any) => ({
      slug: s.slug,
      name: s.name || s.slug,
      category: s.category || '',
    }))
  } catch (e) { console.warn('[TasksView] Failed to load installed skills:', e) }
}

function toggleSkill(slug: string) {
  const current = newTask.value.skills.split(',').map(s => s.trim()).filter(Boolean)
  const idx = current.indexOf(slug)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(slug)
  }
  newTask.value.skills = current.join(', ')
}

function isSkillSelected(slug: string): boolean {
  return newTask.value.skills.split(',').map(s => s.trim()).includes(slug)
}

const filteredSkills = computed(() => {
  if (!skillsSearch.value) return availableSkills.value.slice(0, 15)
  const q = skillsSearch.value.toLowerCase()
  return availableSkills.value.filter(s =>
    s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
  ).slice(0, 15)
})

// Edit modal skills
const editSkillsSearch = ref('')
const filteredEditSkills = computed(() => {
  if (!editSkillsSearch.value) return availableSkills.value.slice(0, 15)
  const q = editSkillsSearch.value.toLowerCase()
  return availableSkills.value.filter(s =>
    s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
  ).slice(0, 15)
})
function toggleEditSkill(slug: string) {
  const current = editSkills.value.split(',').map(s => s.trim()).filter(Boolean)
  const idx = current.indexOf(slug)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(slug)
  }
  editSkills.value = current.join(', ')
}
function isEditSkillSelected(slug: string): boolean {
  return editSkills.value.split(',').map(s => s.trim()).includes(slug)
}

// 从真实 Hermes cron API 加载任务
const cronTasks = ref<CronTask[]>([])

// ── Skills usage stats ──
const skillsStats = ref<SkillUsageStat[]>([])
const statsLoading = ref(false)

async function loadSkillsStats() {
  statsLoading.value = true
  try {
    const data = await apiSkillsUsageStats()
    skillsStats.value = data.stats || []
  } catch {
    // ignore
  } finally {
    statsLoading.value = false
  }
}
const runningTasks = computed(() => cronTasks.value.filter(t => t.status === 'active'))
const historyTasks = ref<HistoryTask[]>(loadHistory())

// ── Cron history from backend ──
interface CronHistoryEntry {
  id: string
  name: string
  schedule: string
  last_run: string | null
  next_run: string | null
  last_status: string | null
  last_output: string | null
}
const cronHistoryList = ref<CronHistoryEntry[]>([])
const cronHistoryLoading = ref(false)

async function loadCronHistory() {
  cronHistoryLoading.value = true
  try {
    const data = await apiCronHistory()
    cronHistoryList.value = data.history || []
  } catch {
    // ignore
  } finally {
    cronHistoryLoading.value = false
  }
}

function loadHistory(): HistoryTask[] {
  try {
    const raw = localStorage.getItem('hixns_task_history')
    return raw ? JSON.parse(raw) : []
  } catch (e) { console.warn('[TasksView] loadHistory parse failed:', e); return [] }
}

function saveHistory() {
  try {
    localStorage.setItem('hixns_task_history', JSON.stringify(historyTasks.value.slice(0, 50)))
  } catch (e) { console.warn('[TasksView] saveHistory failed:', e) }
}
const loading = ref(false)

const allTasks = computed(() => [...cronTasks.value, ...runningTasks.value])

async function loadTasks() {
  loading.value = true
  try {
    const data = await hermesCronList()
    const jobs = Array.isArray(data.jobs) ? data.jobs : []
    cronTasks.value = jobs.map((j: any) => ({
      id: j.id || j.job_id || '',
      name: j.name || j.prompt?.substring(0, 30) || '未命名',
      schedule: j.schedule || '',
      prompt: j.prompt || '',
      skills: j.skills || '',
      status: j.status === 'paused' ? 'paused' : 'active',
      lastRun: j.last_run,
      nextRun: j.next_run,
      runCount: j.run_count || 0,
    }))
  } catch (e) { console.warn('[TasksView] Cron list failed (agent not running):', e) }
  loading.value = false
}

async function createTask() {
  if (!newTask.value.schedule || !newTask.value.prompt) {
    toast.error('参数不完整', '请填写执行计划和提示词')
    return
  }
  try {
    const result = await hermesCronCreate(newTask.value.schedule, newTask.value.prompt, newTask.value.name || undefined)
    if (result && (result as any).error) {
      toast.error('创建任务失败', (result as any).error)
      return
    }
    toast.success('任务创建成功', newTask.value.name || '定时任务')
    newTask.value = { name: '', schedule: '', prompt: '', skills: '' }
    showCreate.value = false
    await loadTasks()
  } catch (e: any) {
    toast.error('创建任务失败', e?.message || String(e))
  }
}

async function pauseTask(task: CronTask) {
  try {
    const result = await hermesCronPause(task.id)
    if (result && (result as any).error) { toast.error('暂停失败', (result as any).error); return }
    toast.info('任务已暂停', task.name)
    await loadTasks()
  } catch (e: any) {
    toast.error('暂停失败', e?.message || String(e))
  }
}

async function resumeTask(task: CronTask) {
  try {
    const result = await hermesCronResume(task.id)
    if (result && (result as any).error) { toast.error('恢复失败', (result as any).error); return }
    toast.success('任务已恢复', task.name)
    await loadTasks()
  } catch (e: any) {
    toast.error('恢复失败', e?.message || String(e))
  }
}

async function runTask(task: CronTask) {
  try {
    const result = await hermesCronRun(task.id)
    if (result && (result as any).error) { toast.error('执行失败', (result as any).error); return }
    toast.success('已触发执行', task.name)
    const outputText = (result as any)?.output || '已触发执行，等待调度器执行...'
    historyTasks.value.unshift({
      id: 'run-' + Date.now(),
      name: task.name,
      finishedAt: new Date().toISOString(),
      result: 'success',
      output: outputText,
      trigger: '手动触发',
    })
    activeTab.value = 'history'
    saveHistory()
    await loadTasks()
  } catch (e: any) {
    toast.error('执行失败', e?.message || String(e))
  }
}

const deleteTarget = ref<CronTask | null>(null)
const deleteVisible = computed({
  get: () => deleteTarget.value !== null,
  set: (v: boolean) => { if (!v) deleteTarget.value = null }
})

async function deleteTask(task: CronTask) {
  deleteTarget.value = task
}

async function confirmDeleteTask() {
  const task = deleteTarget.value
  if (!task) return
  try {
    const result = await hermesCronRemove(task.id)
    if (result && (result as any).error) { toast.error('删除失败', (result as any).error); deleteTarget.value = null; return }
    toast.info('任务已删除', task.name)
    await loadTasks()
  } catch (e: any) {
    toast.error('删除失败', e?.message || String(e))
  } finally {
    deleteTarget.value = null
  }
}

function editTask(task: CronTask) {
  editingTask.value = task
  editForm.value = {
    name: task.name,
    schedule: task.schedule,
    prompt: task.prompt || '',
  }
  editSkills.value = task.skills || ''
  showCreate.value = false  // 关闭创建表单
}

async function saveEdit() {
  if (!editingTask.value) return
  try {
    await hermesCronUpdate(editingTask.value.id, {
      name: editForm.value.name || undefined,
      schedule: editForm.value.schedule || undefined,
      prompt: editForm.value.prompt || undefined,
      skills: editSkills.value || undefined,
    })
    toast.success('任务已更新', editForm.value.name || editingTask.value.name)
    editingTask.value = null
    await loadTasks()
  } catch (e: any) {
    toast.error('更新任务失败', e?.message || String(e))
  }
}

onMounted(() => { loadTasks() })

function statusLabel(status: string): string {
  switch (status) {
    case 'active': return '运行中'
    case 'paused': return '已暂停'
    case 'running': return '执行中'
    default: return status
  }
}

function formatDate(iso?: string): string {
  return formatTime(iso)
}

function formatTime(iso?: string): string {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function formatElapsed(iso?: string): string {
  if (!iso) return ''
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return `${sec}s`
  return `${Math.floor(sec / 60)}m ${sec % 60}s`
}
</script>

<style scoped>
.tasks-view {
  height: 100%;
  overflow-y: auto;
  background: transparent;
  padding: 24px 32px 32px;
}

.tasks-view.tasks-scrolled {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0px, black 120px, black 100%);
  mask-image: linear-gradient(to bottom, transparent 0px, black 120px, black 100%);
}

.tasks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-left { display: flex; align-items: baseline; gap: 10px; }

.tasks-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.store-count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: var(--text-inverse);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.btn-create:hover { filter: brightness(1.1); box-shadow: 0 2px 8px color-mix(in srgb, var(--info) 25%, transparent); transform: scale(1.04); }
.btn-create:active { transform: scale(0.95); }

/* Create form */
.create-card { margin-bottom: 20px; }

.card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  box-shadow: var(--glass-shadow-inset), var(--shadow-card);
  transition: background 0.3s var(--spring-smooth), border-color 0.3s var(--spring-smooth), box-shadow 0.3s var(--spring-smooth), transform 0.3s var(--spring-smooth);
  overflow: hidden;
}

.card-header {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--glass-border);
  font-size: 13px; font-weight: 600; color: var(--text-primary);
}

.card-header-tag {
  font-family: var(--font-mono); padding: 2px 6px; border-radius: 3px;
  font-size: 10px; font-weight: 600;
  background: var(--accent); color: var(--text-inverse);
}

.card-body { padding: 16px 20px; }

.form-row { margin-bottom: 12px; }
.form-row:last-child { margin-bottom: 0; }
.form-label {
  display: block; font-family: var(--font-mono); font-size: 12px;
  font-weight: 600; color: var(--text-secondary); margin-bottom: 5px;
}
.form-input {
  width: 100%; padding: 7px 10px;
  border: 1px solid var(--glass-border); border-radius: 8px;
  font-size: 13px; font-family: var(--font-mono);
  color: var(--text-primary); background: var(--glass-bg);
  outline: none;
}
.form-input:focus { border-color: var(--border-base); box-shadow: none; }
.form-textarea {
  width: 100%; padding: 8px 10px;
  border: 1px solid var(--glass-border); border-radius: 8px;
  font-size: 13px; font-family: var(--font-mono);
  color: var(--text-primary); background: var(--glass-bg);
  outline: none; resize: vertical; min-height: 60px;
}
.form-textarea:focus { border-color: var(--border-base); }
.form-hint { font-size: 11px; color: var(--text-tertiary); margin: 3px 0 0; }
.form-actions { display: flex; gap: 8px; margin-top: 14px; }

.btn-primary {
  padding: 6px 16px; background: var(--accent); border: none; border-radius: var(--radius-btn);
  color: var(--text-inverse); font-size: 12px; font-weight: 600; font-family: var(--font-mono);
  cursor: pointer; transition: background 0.2s var(--spring-bounce), transform 0.2s var(--spring-bounce);
}
.btn-primary:hover { filter: brightness(1.1); transform: scale(1.03); }
.btn-primary:active { transform: scale(0.96); }
.btn-secondary {
  padding: 6px 16px; background: transparent; border: 1px solid var(--border-base);
  border-radius: 8px; color: var(--text-secondary); font-size: 12px;
  font-family: var(--font-mono); cursor: pointer;
}

/* Tabs */
.tabs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.main-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border-base);
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
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}

.main-tab:hover { color: var(--text-primary); }

.main-tab.active {
  color: var(--text-primary);
  border-bottom-color: var(--text-primary);
  font-weight: 600;
}

.tab-count {
  font-family: var(--font-mono);
  font-size: 10px;
  background: var(--glass-bg);
  color: var(--text-tertiary);
  padding: 1px 5px;
  border-radius: 3px;
}

.main-tab.active .tab-count {
  background: var(--text-primary);
  color: var(--bg-base);
}

.tab-count.live { background: var(--accent); color: var(--text-inverse); animation: pulse 2s ease infinite; }

@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

/* Empty state */
.empty-state {
  text-align: center; padding: 60px 20px;
}
.empty-icon { margin-bottom: 12px; color: var(--text-tertiary); }
.empty-text { font-size: 14px; color: var(--text-secondary); margin-bottom: 6px; }
.empty-hint { font-size: 12px; color: var(--text-tertiary); }

/* Task List — VueBits */
.task-list { display: flex; flex-direction: column; gap: var(--space-3); }

.task-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-2xl);
  padding: var(--space-4);
  transition: background var(--fast), border-color var(--fast), box-shadow var(--fast);
}

.task-card:hover {
  border-color: var(--border-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.task-card.paused { opacity: 0.55; }
.task-card.running { border: 1px solid var(--accent); }
.task-card.history.success { border: 1px solid var(--success); }
.task-card.history.failed { border: 1px solid var(--error); }

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.task-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
  min-width: 0;
}

.task-header-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.task-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.task-dot.active { background: var(--success); }
.task-dot.paused { background: var(--text-tertiary); }
.task-dot.running { background: var(--accent); animation: pulse 1.5s ease infinite; }

.result-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.result-dot.success { background: var(--success); }
.result-dot.failed { background: var(--error); }

.task-spinner {
  width: 12px; height: 12px;
  border: 1.5px solid var(--border-base);
  border-top-color: var(--accent);
  border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.task-name {
  font-weight: 600; font-size: 13px;
  color: var(--text-primary); flex: 1;
}

.task-schedule {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--text-tertiary); background: var(--bg-elevated);
  padding: 2px 8px; border-radius: 4px;
}

.task-elapsed {
  font-family: var(--font-mono); font-size: 11px; color: var(--accent);
}

.task-time {
  font-family: var(--font-mono); font-size: 11px; color: var(--text-tertiary);
}

.task-output {
  margin: var(--space-3) 0 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-base);
  background: var(--bg-surface);
}

.task-output-header {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: var(--glass-weak);
  border-bottom: 1px solid var(--border-base);
}

.task-output-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-output-body {
  margin: 0;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.65;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
  overflow: auto;
  max-height: 200px;
}

.task-status-tag {
  font-family: var(--font-mono); font-size: 10px; font-weight: 600;
  padding: 2px 6px; border-radius: 4px;
}
.task-status-tag.active { background: var(--glass-bg); color: var(--success); }
.task-status-tag.paused { background: var(--glass-bg); color: var(--text-tertiary); }

.result-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.result-dot.success { background: var(--success); }
.result-dot.failed { background: var(--error); }

.result-tag {
  font-family: var(--font-mono); font-size: 10px; font-weight: 600;
  padding: 2px 6px; border-radius: 4px;
}
.result-tag.success { background: var(--glass-bg); color: var(--success); }
.result-tag.failed { background: var(--glass-bg); color: var(--error); }

.task-prompt {
  font-size: 12px; color: var(--text-secondary); line-height: 1.5;
  margin-bottom: 6px; margin-left: 15px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.task-skills { display: flex; gap: 4px; margin-bottom: 6px; margin-left: 15px; flex-wrap: wrap; }
.skill-tag {
  font-family: var(--font-mono); font-size: 10px;
  background: var(--bg-elevated); color: var(--text-secondary);
  padding: 2px 8px; border-radius: 4px;
  border: 1px solid var(--border-base);
}

.task-output {
  margin: 6px 0;
}
.task-output pre {
  background: var(--bg-surface); color: var(--text-tertiary);
  border: 1px solid var(--bg-elevated); border-radius: 6px;
  padding: 8px 10px; font-family: var(--font-mono); font-size: 11px;
  line-height: 1.5; max-height: 120px; overflow: auto;
  white-space: pre-wrap; word-break: break-all;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: var(--space-2);
  margin-top: var(--space-2);
  border-top: 1px solid var(--border-base);
}

.task-meta {
  font-family: var(--font-mono); font-size: 10px; color: var(--text-tertiary);
}

.task-actions {
  display: flex; gap: 2px;
}

.act-btn {
  width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid var(--border-base); border-radius: 6px;
  font-size: 11px; cursor: pointer; color: var(--text-secondary);
  transition: background 0.12s, color 0.12s;
}
.act-btn:hover { border-color: var(--text-tertiary); color: var(--text-primary); background: var(--glass-bg); }
.act-btn.danger:hover { border-color: var(--error); color: var(--error); }

/* Scrollbar */
.tasks-view::-webkit-scrollbar { width: 4px; }
.tasks-view::-webkit-scrollbar-track { background: transparent; }

.skills-suggest {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 160px;
  overflow-y: auto;
}

.skill-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-family: var(--font-family);
  background: var(--bg-elevated);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
}

.skill-chip:hover {
  border-color: var(--border-light);
  color: var(--text-primary);
}

.skill-chip.selected {
  background: var(--accent-glow);
  border-color: var(--accent);
  color: var(--accent);
}

.chip-cat {
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}
.tasks-view::-webkit-scrollbar-thumb { background: var(--border-base); border-radius: 2px; }
</style>
