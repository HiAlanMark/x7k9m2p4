<template>
  <div class="tasks-view">
    <!-- Header -->
    <div class="tasks-header">
      <div class="header-left">
        <h1 class="tasks-title">任务中心</h1>
        <HxBadge variant="info" size="sm">{{ allTasks.length }} 个任务</HxBadge>
      </div>
      <HxButton variant="primary" @click="showCreate = !showCreate">
        <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 42.666667C253.312 42.666667 42.666667 253.312 42.666667 512s210.645333 469.333333 469.333333 469.333333 469.333333-210.645333 469.333333-469.333333S770.688 42.666667 512 42.666667z m0 85.333333c212.565333 0 384 171.434667 384 384s-171.434667 384-384 384-384-171.434667-384-384 171.434667-384 384-384z"/> <path d="M341.333333 469.333333a42.666667 42.666667 0 0 0-42.666666 42.666667 42.666667 42.666667 0 0 0 42.666666 42.666667h341.333334a42.666667 42.666667 0 0 0 42.666666-42.666667 42.666667 42.666667 0 0 0-42.666666-42.666667z"/> <path d="M512 298.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v341.333334a42.666667 42.666667 0 0 0 42.666667 42.666666 42.666667 42.666667 0 0 0 42.666667-42.666666V341.333333a42.666667 42.666667 0 0 0-42.666667-42.666666z"/></svg>
        新建定时任务
      </HxButton>
    </div>

    <!-- Create form -->
    <HxCard v-if="showCreate" class="create-card">
      <template #header>
        <HxBadge variant="success" size="sm">NEW</HxBadge>
        <span>创建定时任务</span>
      </template>
      <div class="card-body">
        <div class="form-row">
          <label class="form-label">任务名称</label>
          <HxInput v-model="newTask.name" placeholder="例如: 每日数据报告" />
        </div>
        <div class="form-row">
          <label class="form-label">执行计划</label>
          <HxInput v-model="newTask.schedule" placeholder="30m / every 2h / 0 9 * * * / ISO时间" />
          <p class="form-hint">支持: 30m, every 2h, cron表达式(0 9 * * *), ISO时间戳</p>
        </div>
        <div class="form-row">
          <label class="form-label">提示词</label>
          <HxTextarea v-model="newTask.prompt" placeholder="任务要执行的提示词内容" :rows="3" />
        </div>
        <div class="form-row">
          <label class="form-label">技能 (可选)</label>
          <HxInput v-model="newTask.skills" placeholder="skill-a, skill-b (逗号分隔)" />
        </div>
        <div class="form-actions">
          <HxButton variant="primary" @click="createTask">创建</HxButton>
          <HxButton variant="ghost" @click="showCreate = false">取消</HxButton>
        </div>
      </div>
    </HxCard>

    <!-- Edit form (inline) -->
    <HxCard v-if="editingTask" class="create-card">
      <template #header>
        <HxBadge variant="warning" size="sm">EDIT</HxBadge>
        <span>编辑任务 · {{ editingTask.id.substring(0, 8) }}</span>
      </template>
      <div class="card-body">
        <div class="form-row">
          <label class="form-label">任务名称</label>
          <HxInput v-model="editForm.name" />
        </div>
        <div class="form-row">
          <label class="form-label">执行计划</label>
          <HxInput v-model="editForm.schedule" />
          <p class="form-hint">支持: 30m, every 2h, cron表达式(0 9 * * *), ISO时间戳</p>
        </div>
        <div class="form-row">
          <label class="form-label">提示词</label>
          <HxTextarea v-model="editForm.prompt" :rows="3" />
        </div>
        <div class="form-actions">
          <HxButton variant="primary" @click="saveEdit">保存修改</HxButton>
          <HxButton variant="ghost" @click="editingTask = null">取消</HxButton>
        </div>
      </div>
    </HxCard>

    <!-- Tabs -->
    <div class="tabs">
      <div class="tab-chips">
        <HxButton :variant="activeTab === 'cron' ? 'primary' : 'ghost'" size="sm" @click="activeTab = 'cron'">
          定时任务
          <HxBadge variant="info" size="sm" class="tab-count">{{ cronTasks.length }}</HxBadge>
        </HxButton>
        <HxButton :variant="activeTab === 'running' ? 'primary' : 'ghost'" size="sm" @click="activeTab = 'running'">
          运行中
          <HxBadge :variant="runningTasks.length > 0 ? 'success' : 'info'" size="sm" class="tab-count">{{ runningTasks.length }}</HxBadge>
        </HxButton>
        <HxButton :variant="activeTab === 'history' ? 'primary' : 'ghost'" size="sm" @click="activeTab = 'history'">
          执行历史
          <HxBadge variant="info" size="sm" class="tab-count">{{ historyTasks.length }}</HxBadge>
        </HxButton>
      </div>
    </div>

    <!-- Cron tasks list -->
    <template v-if="activeTab === 'cron'">
      <HxEmpty v-if="cronTasks.length === 0">
        <template #default>
          <div class="empty-text">暂无定时任务</div>
          <div class="empty-hint">点击「新建定时任务」创建你的第一个自动化任务</div>
        </template>
      </HxEmpty>
      <div v-else class="task-list">
        <div v-for="task in cronTasks" :key="task.id" class="task-card" :class="{ paused: task.status === 'paused' }">
          <div class="task-top">
            <span :class="['task-dot', task.status]"></span>
            <span class="task-name">{{ task.name }}</span>
            <span class="task-schedule">{{ task.schedule }}</span>
            <HxBadge :variant="task.status === 'active' ? 'success' : task.status === 'paused' ? 'warning' : 'info'" size="sm">{{ statusLabel(task.status) }}</HxBadge>
          </div>
          <div class="task-prompt">{{ task.prompt }}</div>
          <div v-if="task.skills" class="task-skills">
            <HxBadge v-for="s in task.skills.split(',')" :key="s" variant="secondary" size="sm">{{ s.trim() }}</HxBadge>
          </div>
          <div class="task-bottom">
            <span class="task-meta" v-if="task.lastRun">上次: {{ formatTime(task.lastRun) }}</span>
            <span class="task-meta" v-if="task.nextRun">下次: {{ formatTime(task.nextRun) }}</span>
            <span class="task-meta">运行 {{ task.runCount || 0 }} 次</span>
            <div class="task-actions">
              <HxButton variant="ghost" size="sm" @click="editTask(task)" title="编辑">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </HxButton>
              <HxButton v-if="task.status === 'active'" variant="ghost" size="sm" @click="pauseTask(task)" title="暂停">
                <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M640 85.333333c-46.506667 0-85.333333 38.826667-85.333333 85.333334v682.666666c0 46.506667 38.826667 85.333333 85.333333 85.333334h128c46.506667 0 85.333333-38.826667 85.333333-85.333334V170.666667c0-46.506667-38.826667-85.333333-85.333333-85.333334z m-384 0c-46.506667 0-85.333333 38.826667-85.333333 85.333334v682.666666c0 46.506667 38.826667 85.333333 85.333333 85.333334h128c46.506667 0 85.333333-38.826667 85.333333-85.333334V170.666667c0-46.506667-38.826667-85.333333-85.333333-85.333334z"/></svg>
              </HxButton>
              <HxButton v-if="task.status === 'paused'" variant="ghost" size="sm" @click="resumeTask(task)" title="恢复">
                <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M297.813333 85.845333C231.936 87.424 170.666667 140.8 170.666667 213.333333v597.333334c0 96.725333 108.928 159.36 192.512 110.592l512-298.666667c83.029333-48.384 82.986667-172.970667-0.085334-221.269333l-512-298.666667c-18.858667-11.008-39.552-16.768-65.28-16.810667z"/></svg>
              </HxButton>
              <HxButton variant="ghost" size="sm" @click="runTask(task)" title="立即执行">
                <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 42.666667C253.312 42.666667 42.666667 253.312 42.666667 512s210.645333 469.333333 469.333333 469.333333 469.333333-210.645333 469.333333-469.333333S770.688 42.666667 512 42.666667z m0 85.333333c212.053333 0 384 171.946667 384 384s-171.946667 384-384 384S128 724.053333 128 512s171.946667-384 384-384z"/><path d="M427.264 299.349333c-44.202667 0.853333-86.058667 36.608-85.930667 84.906667v255.573333c-0.128 64.298667 74.24 106.453333 129.322667 73.258667l213.077333-127.744c53.888-32.128 53.888-114.56 0-146.688l-213.077333-127.786667c-12.8-7.68-27.52-11.52-43.392-11.52z"/></svg>
              </HxButton>
              <HxButton variant="danger" size="sm" @click="deleteTask(task)" title="删除">
                <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 42.666667C253.312 42.666667 42.666667 253.312 42.666667 512s210.645333 469.333333 469.333333 469.333333 469.333333-210.645333 469.333333-469.333333S770.688 42.666667 512 42.666667z m0 85.333333c212.565333 0 384 171.434667 384 384s-171.434667 384-384 384-384-171.434667-384-384 171.434667-384 384-384z"/> <path d="M640 341.333333a42.666667 42.666667 0 0 0-30.165333 12.501334l-256 256a42.666667 42.666667 0 0 0 0 60.330666 42.666667 42.666667 0 0 0 60.330666 0l256-256a42.666667 42.666667 0 0 0 0-60.330666A42.666667 42.666667 0 0 0 640 341.333333z"/> <path d="M384 341.333333a42.666667 42.666667 0 0 0-30.165333 12.501334 42.666667 42.666667 0 0 0 0 60.330666l256 256a42.666667 42.666667 0 0 0 60.330666 0 42.666667 42.666667 0 0 0 0-60.330666l-256-256A42.666667 42.666667 0 0 0 384 341.333333z"/></svg>
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
          <div class="task-top">
            <HxSpinner size="sm" />
            <span class="task-name">{{ task.name }}</span>
            <span class="task-elapsed">{{ formatElapsed(task.startedAt) }}</span>
          </div>
          <div class="task-prompt">{{ task.prompt }}</div>
          <div v-if="task.output" class="task-output">
            <pre>{{ task.output }}</pre>
          </div>
          <div class="task-bottom">
            <span class="task-meta">开始于 {{ formatTime(task.startedAt) }}</span>
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
          <div class="task-top">
            <span :class="['result-dot', task.result]"></span>
            <span class="task-name">{{ task.name }}</span>
            <span class="task-time">{{ formatTime(task.finishedAt) }}</span>
            <HxBadge :variant="task.result === 'success' ? 'success' : 'danger'" size="sm">{{ task.result === 'success' ? '成功' : '失败' }}</HxBadge>
          </div>
          <div v-if="task.output" class="task-output">
            <pre>{{ task.output.substring(0, 500) }}{{ task.output.length > 500 ? '...' : '' }}</pre>
          </div>
          <div class="task-bottom">
            <span class="task-meta">耗时 {{ task.duration || '-' }}</span>
            <span class="task-meta" v-if="task.trigger">触发: {{ task.trigger }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { hermesCronList, hermesCronCreate, hermesCronPause, hermesCronResume, hermesCronRemove, hermesCronRun, hermesCronUpdate } from '../api'
import { HxButton, HxInput, HxTextarea, HxCard, HxBadge, HxSpinner, HxEmpty } from '../components/ui'
import { useToast } from '../composables/useToast'

const toast = useToast()

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

const activeTab = ref<'cron' | 'running' | 'history'>('cron')
const showCreate = ref(false)
const newTask = ref({ name: '', schedule: '', prompt: '', skills: '' })
const editingTask = ref<CronTask | null>(null)
const editForm = ref({ name: '', schedule: '', prompt: '' })

// 从真实 Hermes cron API 加载任务
const cronTasks = ref<CronTask[]>([])
const runningTasks = ref<RunningTask[]>([])
const historyTasks = ref<HistoryTask[]>([])
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
      skills: j.skills ? j.skills.join(', ') : '',
      status: j.enabled === false ? 'paused' : 'active',
      lastRun: j.last_run,
      nextRun: j.next_run,
      runCount: j.run_count || 0,
    }))
  } catch { /* agent not running */ }
  loading.value = false
}

async function createTask() {
  if (!newTask.value.schedule || !newTask.value.prompt) {
    toast.error('参数不完整', '请填写执行计划和提示词')
    return
  }
  try {
    await hermesCronCreate(newTask.value.schedule, newTask.value.prompt, newTask.value.name || undefined)
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
    await hermesCronPause(task.id)
    toast.info('任务已暂停', task.name)
    await loadTasks()
  } catch (e: any) {
    toast.error('暂停失败', e?.message || String(e))
  }
}

async function resumeTask(task: CronTask) {
  try {
    await hermesCronResume(task.id)
    toast.success('任务已恢复', task.name)
    await loadTasks()
  } catch (e: any) {
    toast.error('恢复失败', e?.message || String(e))
  }
}

async function runTask(task: CronTask) {
  try {
    await hermesCronRun(task.id)
    toast.success('已触发执行', task.name)
    historyTasks.value.unshift({
      id: 'run-' + Date.now(),
      name: task.name,
      finishedAt: new Date().toISOString(),
      result: 'success',
      output: '已触发执行',
      trigger: '手动触发',
    })
    await loadTasks()
  } catch (e: any) {
    toast.error('执行失败', e?.message || String(e))
  }
}

async function deleteTask(task: CronTask) {
  try {
    await hermesCronRemove(task.id)
    toast.info('任务已删除', task.name)
    await loadTasks()
  } catch (e: any) {
    toast.error('删除失败', e?.message || String(e))
  }
}

function editTask(task: CronTask) {
  editingTask.value = task
  editForm.value = {
    name: task.name,
    schedule: task.schedule,
    prompt: task.prompt,
  }
  showCreate.value = false  // 关闭创建表单
}

async function saveEdit() {
  if (!editingTask.value) return
  try {
    await hermesCronUpdate(editingTask.value.id, {
      name: editForm.value.name || undefined,
      schedule: editForm.value.schedule || undefined,
      prompt: editForm.value.prompt || undefined,
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
  color: var(--color-text-primary);
  letter-spacing: -0.3px;
}

.tasks-count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-create:hover { filter: brightness(1.1); box-shadow: 0 2px 8px rgba(10,132,255,0.25); transform: scale(1.04); }
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
  transition: all 0.3s var(--spring-smooth);
  overflow: hidden;
}

.card-header {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--glass-border);
  font-size: 13px; font-weight: 600; color: var(--color-text-primary);
}

.card-header-tag {
  font-family: var(--font-mono); padding: 2px 6px; border-radius: 3px;
  font-size: 10px; font-weight: 600;
  background: var(--color-primary); color: #fff;
}

.card-body { padding: 16px 20px; }

.form-row { margin-bottom: 12px; }
.form-row:last-child { margin-bottom: 0; }
.form-label {
  display: block; font-family: var(--font-mono); font-size: 12px;
  font-weight: 600; color: var(--color-text-secondary); margin-bottom: 5px;
}
.form-input {
  width: 100%; padding: 7px 10px;
  border: 1px solid var(--glass-border); border-radius: 8px;
  font-size: 13px; font-family: var(--font-mono);
  color: var(--color-text-primary); background: var(--color-bg-input);
  outline: none;
}
.form-input:focus { border-color: var(--color-border); box-shadow: none; }
.form-textarea {
  width: 100%; padding: 8px 10px;
  border: 1px solid var(--glass-border); border-radius: 8px;
  font-size: 13px; font-family: var(--font-mono);
  color: var(--color-text-primary); background: var(--color-bg-input);
  outline: none; resize: vertical; min-height: 60px;
}
.form-textarea:focus { border-color: var(--color-border); }
.form-hint { font-size: 11px; color: var(--color-text-tertiary); margin: 3px 0 0; }
.form-actions { display: flex; gap: 8px; margin-top: 14px; }

.btn-primary {
  padding: 6px 16px; background: var(--color-primary); border: none; border-radius: var(--radius-btn);
  color: #fff; font-size: 12px; font-weight: 600; font-family: var(--font-mono);
  cursor: pointer; transition: all 0.2s var(--spring-bounce);
}
.btn-primary:hover { filter: brightness(1.1); transform: scale(1.03); }
.btn-primary:active { transform: scale(0.96); }
.btn-secondary {
  padding: 6px 16px; background: transparent; border: 1px solid var(--color-border);
  border-radius: 8px; color: var(--color-text-secondary); font-size: 12px;
  font-family: var(--font-mono); cursor: pointer;
}

/* Tabs */
.tabs {
  display: flex; gap: 4px; margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border); padding-bottom: 0;
}
.tab {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; background: transparent; border: none; border-bottom: 2px solid transparent;
  color: var(--color-text-secondary); font-family: var(--font-mono); font-size: 12px;
  cursor: pointer; transition: all 0.12s; margin-bottom: -1px;
}
.tab:hover { color: var(--color-text-primary); }
.tab.active { color: var(--color-text-primary); border-bottom-color: var(--color-primary); font-weight: 600; }
.tab-count {
  font-size: 10px; background: var(--color-bg-input); padding: 1px 6px;
  border-radius: 8px; color: var(--color-text-tertiary);
}
.tab-count.live { background: var(--color-primary); color: #fff; animation: pulse 2s ease infinite; }

@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

/* Empty state */
.empty-state {
  text-align: center; padding: 60px 20px;
}
.empty-icon { margin-bottom: 12px; color: var(--color-text-tertiary); }
.empty-text { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 6px; }
.empty-hint { font-size: 12px; color: var(--color-text-tertiary); }

/* Task List — VueBits */
.task-list { display: flex; flex-direction: column; gap: var(--space-2); }

.task-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--border-base);
  border-radius: var(--radius-xl);
  box-shadow: var(--glass-inset), var(--shadow-sm);
  transition: all var(--fast);
  padding: var(--space-4);
}

.task-card:hover {
  border-color: var(--border-light);
  box-shadow: var(--glass-inset), var(--shadow-md);
  transform: translateY(-1px);
}

.task-card.paused { opacity: 0.6; }
.task-card.running { border-left: 3px solid var(--primary); }
.task-card.history.failed { border-left: 3px solid var(--error); }
.task-card.history.success { border-left: 3px solid var(--success); }

.task-top {
  display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);
}

.task-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.task-dot.active { background: var(--success); }
.task-dot.paused { background: var(--text-tertiary); }
.task-dot.running { background: var(--primary); animation: pulse 1.5s ease infinite; }

.task-spinner {
  width: 12px; height: 12px;
  border: 1.5px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.task-name {
  font-family: var(--font-mono); font-size: 13px; font-weight: 600;
  color: var(--color-text-primary); flex: 1;
}

.task-schedule {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--color-text-tertiary); background: var(--color-bg-input);
  padding: 2px 8px; border-radius: 4px;
}

.task-elapsed {
  font-family: var(--font-mono); font-size: 11px; color: var(--color-primary);
}

.task-time {
  font-family: var(--font-mono); font-size: 11px; color: var(--color-text-tertiary);
}

.task-status-tag {
  font-family: var(--font-mono); font-size: 10px; font-weight: 600;
  padding: 2px 6px; border-radius: 4px;
}
.task-status-tag.active { background: var(--color-bg-input); color: var(--color-success); }
.task-status-tag.paused { background: var(--color-bg-input); color: var(--color-text-tertiary); }

.result-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.result-dot.success { background: var(--color-success); }
.result-dot.failed { background: var(--color-error); }

.result-tag {
  font-family: var(--font-mono); font-size: 10px; font-weight: 600;
  padding: 2px 6px; border-radius: 4px;
}
.result-tag.success { background: var(--color-bg-input); color: var(--color-success); }
.result-tag.failed { background: var(--color-bg-input); color: var(--color-error); }

.task-prompt {
  font-size: 12px; color: var(--color-text-secondary); line-height: 1.5;
  margin-bottom: 6px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.task-skills { display: flex; gap: 4px; margin-bottom: 6px; }
.skill-tag {
  font-family: var(--font-mono); font-size: 10px;
  background: var(--color-primary-light); color: var(--color-primary);
  padding: 2px 6px; border-radius: 4px;
}

.task-output {
  margin: 6px 0;
}
.task-output pre {
  background: #0D1117; color: #8B949E;
  border: 1px solid #21262D; border-radius: 6px;
  padding: 8px 10px; font-family: var(--font-mono); font-size: 11px;
  line-height: 1.5; max-height: 120px; overflow: auto;
  white-space: pre-wrap; word-break: break-all;
}

.task-bottom {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}

.task-meta {
  font-family: var(--font-mono); font-size: 10px; color: var(--color-text-tertiary);
}

.task-actions {
  display: flex; gap: 4px; margin-left: auto;
}

.act-btn {
  width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid var(--color-border); border-radius: 6px;
  font-size: 11px; cursor: pointer; color: var(--color-text-secondary);
  transition: all 0.12s;
}
.act-btn:hover { border-color: var(--color-text-tertiary); color: var(--color-text-primary); background: var(--color-bg-input); }
.act-btn.danger:hover { border-color: var(--color-error); color: var(--color-error); }

/* Scrollbar */
.tasks-view::-webkit-scrollbar { width: 4px; }
.tasks-view::-webkit-scrollbar-track { background: transparent; }
.tasks-view::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }
</style>
