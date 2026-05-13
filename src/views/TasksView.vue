<template>
  <div class="tasks-view">
    <!-- Header -->
    <div class="tasks-header">
      <div class="header-left">
        <h1 class="tasks-title">任务中心</h1>
        <span class="tasks-count">{{ allTasks.length }} 个任务</span>
      </div>
      <button class="btn-create" @click="showCreate = !showCreate">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        新建定时任务
      </button>
    </div>

    <!-- Create form -->
    <div v-if="showCreate" class="card create-card">
      <div class="card-header">
        <span class="card-header-tag">NEW</span>
        <span>创建定时任务</span>
      </div>
      <div class="card-body">
        <div class="form-row">
          <label class="form-label">任务名称</label>
          <input v-model="newTask.name" type="text" placeholder="例如: 每日数据报告" class="form-input" />
        </div>
        <div class="form-row">
          <label class="form-label">执行计划</label>
          <input v-model="newTask.schedule" type="text" placeholder="30m / every 2h / 0 9 * * * / ISO时间" class="form-input" />
          <p class="form-hint">支持: 30m, every 2h, cron表达式(0 9 * * *), ISO时间戳</p>
        </div>
        <div class="form-row">
          <label class="form-label">提示词</label>
          <textarea v-model="newTask.prompt" class="form-textarea" rows="3" placeholder="任务要执行的提示词内容"></textarea>
        </div>
        <div class="form-row">
          <label class="form-label">技能 (可选)</label>
          <input v-model="newTask.skills" type="text" placeholder="skill-a, skill-b (逗号分隔)" class="form-input" />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="createTask">创建</button>
          <button class="btn-secondary" @click="showCreate = false">取消</button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button :class="['tab', { active: activeTab === 'cron' }]" @click="activeTab = 'cron'">
        定时任务
        <span class="tab-count">{{ cronTasks.length }}</span>
      </button>
      <button :class="['tab', { active: activeTab === 'running' }]" @click="activeTab = 'running'">
        运行中
        <span class="tab-count" :class="{ live: runningTasks.length > 0 }">{{ runningTasks.length }}</span>
      </button>
      <button :class="['tab', { active: activeTab === 'history' }]" @click="activeTab = 'history'">
        执行历史
        <span class="tab-count">{{ historyTasks.length }}</span>
      </button>
    </div>

    <!-- Cron tasks list -->
    <template v-if="activeTab === 'cron'">
      <div v-if="cronTasks.length === 0" class="empty-state">
        <div class="empty-icon">⏱</div>
        <div class="empty-text">暂无定时任务</div>
        <div class="empty-hint">点击「新建定时任务」创建你的第一个自动化任务</div>
      </div>
      <div v-else class="task-list">
        <div v-for="task in cronTasks" :key="task.id" class="task-card" :class="{ paused: task.status === 'paused' }">
          <div class="task-top">
            <span :class="['task-dot', task.status]"></span>
            <span class="task-name">{{ task.name }}</span>
            <span class="task-schedule">{{ task.schedule }}</span>
            <span :class="['task-status-tag', task.status]">{{ statusLabel(task.status) }}</span>
          </div>
          <div class="task-prompt">{{ task.prompt }}</div>
          <div v-if="task.skills" class="task-skills">
            <span v-for="s in task.skills.split(',')" :key="s" class="skill-tag">{{ s.trim() }}</span>
          </div>
          <div class="task-bottom">
            <span class="task-meta" v-if="task.lastRun">上次: {{ formatTime(task.lastRun) }}</span>
            <span class="task-meta" v-if="task.nextRun">下次: {{ formatTime(task.nextRun) }}</span>
            <span class="task-meta">运行 {{ task.runCount || 0 }} 次</span>
            <div class="task-actions">
              <button v-if="task.status === 'active'" class="act-btn" @click="pauseTask(task)" title="暂停">⏸</button>
              <button v-if="task.status === 'paused'" class="act-btn" @click="resumeTask(task)" title="恢复">▶</button>
              <button class="act-btn" @click="runTask(task)" title="立即执行">⚡</button>
              <button class="act-btn danger" @click="deleteTask(task)" title="删除">✕</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Running tasks -->
    <template v-if="activeTab === 'running'">
      <div v-if="runningTasks.length === 0" class="empty-state">
        <div class="empty-icon">💤</div>
        <div class="empty-text">没有正在运行的任务</div>
      </div>
      <div v-else class="task-list">
        <div v-for="task in runningTasks" :key="task.id" class="task-card running">
          <div class="task-top">
            <span class="task-spinner"></span>
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
      <div v-if="historyTasks.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">暂无执行记录</div>
      </div>
      <div v-else class="task-list">
        <div v-for="task in historyTasks" :key="task.id" class="task-card history" :class="task.result">
          <div class="task-top">
            <span :class="['result-dot', task.result]"></span>
            <span class="task-name">{{ task.name }}</span>
            <span class="task-time">{{ formatTime(task.finishedAt) }}</span>
            <span :class="['result-tag', task.result]">{{ task.result === 'success' ? '成功' : '失败' }}</span>
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
import { ref, computed } from 'vue'

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

// 从 localStorage 加载任务
const cronTasks = ref<CronTask[]>(loadTasks())
const runningTasks = ref<RunningTask[]>([])
const historyTasks = ref<HistoryTask[]>(loadHistory())

const allTasks = computed(() => [...cronTasks.value, ...runningTasks.value])

function loadTasks(): CronTask[] {
  try {
    const raw = localStorage.getItem('hixns_cron_tasks')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function loadHistory(): HistoryTask[] {
  try {
    const raw = localStorage.getItem('hixns_task_history')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveTasks() {
  localStorage.setItem('hixns_cron_tasks', JSON.stringify(cronTasks.value))
}

function saveHistory() {
  localStorage.setItem('hixns_task_history', JSON.stringify(historyTasks.value.slice(0, 100)))
}

function createTask() {
  if (!newTask.value.name || !newTask.value.schedule || !newTask.value.prompt) return
  const task: CronTask = {
    id: 'cron-' + Date.now(),
    name: newTask.value.name,
    schedule: newTask.value.schedule,
    prompt: newTask.value.prompt,
    skills: newTask.value.skills || undefined,
    status: 'active',
    runCount: 0,
  }
  cronTasks.value.unshift(task)
  saveTasks()
  newTask.value = { name: '', schedule: '', prompt: '', skills: '' }
  showCreate.value = false
}

function pauseTask(task: CronTask) {
  task.status = 'paused'
  saveTasks()
}

function resumeTask(task: CronTask) {
  task.status = 'active'
  saveTasks()
}

function runTask(task: CronTask) {
  const running: RunningTask = {
    id: 'run-' + Date.now(),
    name: task.name,
    prompt: task.prompt,
    startedAt: new Date().toISOString(),
  }
  runningTasks.value.unshift(running)
  task.runCount = (task.runCount || 0) + 1
  task.lastRun = new Date().toISOString()
  saveTasks()

  // 模拟执行完成（实际应通过 Agent API）
  setTimeout(() => {
    const idx = runningTasks.value.findIndex(r => r.id === running.id)
    if (idx >= 0) runningTasks.value.splice(idx, 1)
    historyTasks.value.unshift({
      id: running.id,
      name: task.name,
      finishedAt: new Date().toISOString(),
      result: 'success',
      output: '任务已提交到 Agent 执行',
      duration: '0s',
      trigger: '手动触发',
    })
    saveHistory()
  }, 2000)
}

function deleteTask(task: CronTask) {
  const idx = cronTasks.value.findIndex(t => t.id === task.id)
  if (idx >= 0) {
    cronTasks.value.splice(idx, 1)
    saveTasks()
  }
}

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

.btn-create:hover { filter: brightness(1.1); box-shadow: 0 2px 8px rgba(10,132,255,0.25); }

/* Create form */
.create-card { margin-bottom: 20px; }

.card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(16px) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: 12px;
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
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(10,132,255,0.08); }
.form-textarea {
  width: 100%; padding: 8px 10px;
  border: 1px solid var(--glass-border); border-radius: 8px;
  font-size: 13px; font-family: var(--font-mono);
  color: var(--color-text-primary); background: var(--color-bg-input);
  outline: none; resize: vertical; min-height: 60px;
}
.form-textarea:focus { border-color: var(--color-primary); }
.form-hint { font-size: 11px; color: var(--color-text-tertiary); margin: 3px 0 0; }
.form-actions { display: flex; gap: 8px; margin-top: 14px; }

.btn-primary {
  padding: 6px 16px; background: var(--color-primary); border: none; border-radius: 8px;
  color: #fff; font-size: 12px; font-weight: 600; font-family: var(--font-mono);
  cursor: pointer;
}
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
.empty-icon { font-size: 32px; margin-bottom: 12px; }
.empty-text { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 6px; }
.empty-hint { font-size: 12px; color: var(--color-text-tertiary); }

/* Task list */
.task-list { display: flex; flex-direction: column; gap: 8px; }

.task-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 14px 16px;
  transition: border-color 0.12s;
}
.task-card:hover { border-color: var(--color-text-tertiary); }
.task-card.paused { opacity: 0.6; }
.task-card.running { border-left: 3px solid var(--color-primary); }
.task-card.history.failed { border-left: 3px solid var(--color-error); }
.task-card.history.success { border-left: 3px solid var(--color-success); }

.task-top {
  display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
}

.task-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.task-dot.active { background: var(--color-success); }
.task-dot.paused { background: var(--color-text-tertiary); }
.task-dot.running { background: var(--color-primary); animation: pulse 1.5s ease infinite; }

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
