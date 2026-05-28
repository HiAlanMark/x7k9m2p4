import { defineStore } from 'pinia'
import { ref } from 'vue'
import { agentFetch, agentJson, agentPost } from '@/api'

// ═══════════════════════════════════════════════
// Blueprint Store — 蓝图工作流管理
// ═══════════════════════════════════════════════

export interface SkillItem {
  name: string
  description: string
}

export interface BlueprintNode {
  id: string
  type: 'agent' | 'condition' | 'loop' | 'summary' | 'note' | 'manager' | 'manager_slot' | 'group'
  position: { x: number; y: number }
  data: Record<string, unknown>
}

export interface BlueprintEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface Blueprint {
  id: string
  name: string
  description: string
  nodes: BlueprintNode[]
  edges: BlueprintEdge[]
  created_at: string
  updated_at: string
}

export interface BlueprintRun {
  id: string
  blueprint_id: string
  blueprint_name?: string
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'waiting_approval'
  started_at: string
  finished_at?: string
  node_statuses?: Record<string, string>
  error?: string
}

export interface InboxItem {
  id: string
  type: 'approval' | 'proposal' | 'notification'
  title: string
  content: string
  blueprint_id?: string
  run_id?: string
  status: 'pending' | 'approved' | 'rejected' | 'read'
  created_at: string
}

export const useBlueprintStore = defineStore('blueprint', () => {
  // ── State ────────────────────────────────────
  const blueprints = ref<Blueprint[]>([])
  const currentBlueprint = ref<Blueprint | null>(null)
  const runs = ref<BlueprintRun[]>([])
  const currentRun = ref<BlueprintRun | null>(null)
  const inbox = ref<InboxItem[]>([])
  const loading = ref(false)
  const error = ref('')
  const skills = ref<SkillItem[]>([])

  // ── Skills ────────────────────────────────────
  async function fetchSkills() {
    try {
      const data = await agentJson('/v1/agent/skills')
      skills.value = Array.isArray(data) ? data : (data?.skills || data?.data || [])
    } catch (e: any) {
      // Skills fetch failure is non-critical; leave skills empty
    }
  }

  // ── Blueprint CRUD ───────────────────────────
  async function fetchBlueprints() {
    loading.value = true
    error.value = ''
    try {
      const data = await agentJson('/v1/agent/blueprints')
      blueprints.value = Array.isArray(data) ? data : (data?.blueprints || data?.data || [])
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch blueprints'
    } finally {
      loading.value = false
    }
  }

  async function createBlueprint(name: string, description: string) {
    loading.value = true
    error.value = ''
    try {
      const bp = await agentPost('/v1/agent/blueprints/create', { name, description })
      const created = bp?.data || bp
      blueprints.value.unshift(created)
      return created
    } catch (e: any) {
      error.value = e?.message || 'Failed to create blueprint'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateBlueprint(id: string, data: Partial<Blueprint>) {
    loading.value = true
    error.value = ''
    try {
      const result = await agentPost('/v1/agent/blueprints/update', { id, ...data })
      const updated = result?.data || result
      const idx = blueprints.value.findIndex(b => b.id === id)
      if (idx >= 0) blueprints.value[idx] = { ...blueprints.value[idx], ...updated }
      if (currentBlueprint.value?.id === id) {
        currentBlueprint.value = { ...currentBlueprint.value, ...updated }
      }
      return updated
    } catch (e: any) {
      error.value = e?.message || 'Failed to update blueprint'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteBlueprint(id: string) {
    loading.value = true
    error.value = ''
    try {
      await agentPost('/v1/agent/blueprints/delete', { id })
      blueprints.value = blueprints.value.filter(b => b.id !== id)
      if (currentBlueprint.value?.id === id) {
        currentBlueprint.value = null
      }
    } catch (e: any) {
      error.value = e?.message || 'Failed to delete blueprint'
    } finally {
      loading.value = false
    }
  }

  // ── Blueprint Runs ───────────────────────────
  async function fetchAllRuns() {
    loading.value = true
    error.value = ''
    try {
      const data = await agentJson('/v1/agent/runs')
      runs.value = Array.isArray(data) ? data : (data?.runs || data?.data || [])
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch runs'
    } finally {
      loading.value = false
    }
  }

  async function fetchRuns(bpId: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await agentJson(`/v1/agent/blueprints/${bpId}/runs`)
      runs.value = Array.isArray(data) ? data : (data?.runs || data?.data || [])
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch runs'
    } finally {
      loading.value = false
    }
  }

  async function runBlueprint(id: string) {
    loading.value = true
    error.value = ''
    try {
      const result = await agentPost('/v1/agent/blueprints/run', { id })
      const run = result?.data || result
      currentRun.value = run
      runs.value.unshift(run)
      return run
    } catch (e: any) {
      error.value = e?.message || 'Failed to run blueprint'
      return null
    } finally {
      loading.value = false
    }
  }

  async function cancelRun(id: string) {
    loading.value = true
    error.value = ''
    try {
      await agentPost('/v1/agent/blueprints/runs/cancel', { id })
      const run = runs.value.find(r => r.id === id)
      if (run) run.status = 'cancelled'
      if (currentRun.value?.id === id) currentRun.value.status = 'cancelled'
    } catch (e: any) {
      error.value = e?.message || 'Failed to cancel run'
    } finally {
      loading.value = false
    }
  }

  // ── Inbox ────────────────────────────────────
  async function fetchInbox() {
    loading.value = true
    error.value = ''
    try {
      const data = await agentJson('/v1/agent/inbox')
      inbox.value = Array.isArray(data) ? data : (data?.items || data?.data || [])
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch inbox'
    } finally {
      loading.value = false
    }
  }

  async function approveInbox(id: string) {
    try {
      await agentPost(`/v1/agent/inbox/${id}/approve`, {})
      const item = inbox.value.find(i => i.id === id)
      if (item) item.status = 'approved'
    } catch (e: any) {
      error.value = e?.message || 'Failed to approve'
    }
  }

  async function rejectInbox(id: string) {
    try {
      await agentPost(`/v1/agent/inbox/${id}/reject`, {})
      const item = inbox.value.find(i => i.id === id)
      if (item) item.status = 'rejected'
    } catch (e: any) {
      error.value = e?.message || 'Failed to reject'
    }
  }

  async function replyInbox(id: string, text: string) {
    try {
      await agentPost(`/v1/agent/inbox/${id}/reply`, { reply: text })
      const item = inbox.value.find(i => i.id === id)
      if (item) item.status = 'approved'
    } catch (e: any) {
      error.value = e?.message || 'Failed to reply'
    }
  }

  async function markInboxRead(id: string) {
    try {
      await agentPost(`/v1/agent/inbox/${id}/read`, {})
      const item = inbox.value.find(i => i.id === id)
      if (item) item.status = 'read'
    } catch (e: any) {
      error.value = e?.message || 'Failed to mark as read'
    }
  }

  async function createInboxItem(item: { type: string; title: string; description?: string; blueprint_id?: string; run_id?: string }) {
    try {
      const result = await agentPost('/v1/agent/inbox/create', item)
      const created = result?.data || result
      inbox.value.unshift(created)
      return created
    } catch (e: any) {
      error.value = e?.message || 'Failed to create inbox item'
      return null
    }
  }

  // ── Import / Export ──────────────────────────
  async function exportBlueprint(id: string) {
    try {
      const r = await agentFetch(`/v1/agent/blueprints/${id}/export`)
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `blueprint-${id}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e?.message || 'Failed to export blueprint'
    }
  }

  async function importBlueprint(file: File) {
    loading.value = true
    error.value = ''
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const result = await agentPost('/v1/agent/blueprints/import', data)
      const bp = result?.data || result
      blueprints.value.unshift(bp)
      return bp
    } catch (e: any) {
      error.value = e?.message || 'Failed to import blueprint'
      return null
    } finally {
      loading.value = false
    }
  }

  // ── Select / Deselect ────────────────────────
  function selectBlueprint(bp: Blueprint | null) {
    currentBlueprint.value = bp
  }

  function selectRun(run: BlueprintRun | null) {
    currentRun.value = run
  }

  return {
    // State
    blueprints, currentBlueprint, runs, currentRun, inbox,
    loading, error, skills,
    // Blueprint CRUD
    fetchBlueprints, createBlueprint, updateBlueprint, deleteBlueprint,
    // Runs
    fetchAllRuns, fetchRuns, runBlueprint, cancelRun,
    // Inbox
    fetchInbox, approveInbox, rejectInbox, replyInbox, markInboxRead, createInboxItem,
    // Import / Export
    exportBlueprint, importBlueprint,
    // Selection
    selectBlueprint, selectRun,
    // Skills
    fetchSkills,
  }
})
