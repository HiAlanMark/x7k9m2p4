import { ref, onBeforeUnmount } from 'vue'
import { useBlueprintStore, type BlueprintRun } from '@/stores/blueprint'
import { useToast } from '@/composables/useToast'
import { agentFetch } from '@/api'
import type { Node } from '@vue-flow/core'

/**
 * Composable for managing blueprint run lifecycle via SSE.
 *
 * Extracts from BlueprintView:
 * - SSE run subscription (startRunSSE / stopRunSSE)
 * - selectedRun ref and syncNodeRunStatuses function
 * - Run state management (onRunBlueprint, onCancelRun, fetchRuns)
 */

export interface RunNodeStatusData {
  status?: string
  output?: string
  error?: string
}

export function useBlueprintRun(nodes: { value: Node[] }) {
  const bpStore = useBlueprintStore()
  const toast = useToast()

  const selectedRun = ref<BlueprintRun | null>(null)
  let runEventSource: EventSource | null = null
  let sseRunId: string | null = null

  /**
   * Sync node run statuses from the selected run into VueFlow node data.
   * This updates each node's data with _runStatus, _runOutput, _runError
   * so the UI can reflect per-node run status.
   */
  function syncNodeRunStatuses() {
    const run = selectedRun.value
    if (!run?.nodes) return
    for (const node of nodes.value) {
      const nd = run.nodes[node.id]
      if (nd) {
        node.data = { ...node.data, _runStatus: nd.status, _runOutput: nd.output, _runError: nd.error }
      } else {
        // Clear stale run data from nodes not in current run
        if (node.data._runStatus !== undefined) {
          const { _runStatus, _runOutput, _runError, ...rest } = node.data
          node.data = rest
        }
      }
    }
  }

  /**
   * Start SSE subscription for a specific blueprint run.
   * Provides real-time updates for node statuses and run completion.
   */
  function startRunSSE(bpId: string, runId: string) {
    stopRunSSE()
    sseRunId = runId
    const sseUrl = `/v1/agent/blueprints/runs/${runId}/sse`
    runEventSource = new EventSource(sseUrl)

    runEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'node_status') {
          // Update individual node status in the run
          const idx = bpStore.runs.findIndex(r => r.id === runId)
          if (idx >= 0) {
            const runNodes = bpStore.runs[idx].nodes || {}
            runNodes[data.node_id] = {
              ...(runNodes[data.node_id] || {}),
              status: data.status,
              output: data.output,
              error: data.error,
            }
            bpStore.runs[idx] = { ...bpStore.runs[idx], nodes: runNodes }
          }
          // Also update selectedRun if viewing this run
          if (selectedRun.value?.id === runId) {
            const selNodes = selectedRun.value.nodes || {}
            selNodes[data.node_id] = {
              ...(selNodes[data.node_id] || {}),
              status: data.status,
              output: data.output,
              error: data.error,
            }
            selectedRun.value = { ...selectedRun.value, nodes: selNodes }
            syncNodeRunStatuses()
          }
        } else if (data.type === 'run_completed' || data.type === 'run_failed' || data.type === 'run_cancelled') {
          // Terminal event — refresh run and stop SSE
          const status = data.type === 'run_completed' ? 'succeeded'
            : data.type === 'run_cancelled' ? 'cancelled' : 'failed'
          const idx = bpStore.runs.findIndex(r => r.id === runId)
          if (idx >= 0) {
            bpStore.runs[idx] = { ...bpStore.runs[idx], status, ...(data.result || {}) }
          }
          if (selectedRun.value?.id === runId) {
            selectedRun.value = { ...selectedRun.value, status, ...(data.result || {}) }
          }
          stopRunSSE()
          if (status === 'succeeded') toast.success('Blueprint run succeeded')
          else if (status === 'failed') toast.error(`Blueprint run failed${data.error ? ': ' + data.error : ''}`)
          else if (status === 'cancelled') toast.info('Blueprint run cancelled')
          // Refresh full runs list
          bpStore.fetchRuns(bpId)
        }
      } catch {
        // Ignore malformed SSE data
      }
    }

    runEventSource.onerror = () => {
      // SSE connection lost — fallback to one-shot poll then stop
      agentFetch(`/v1/agent/runs/${runId}`).then(r => r.json()).then(run => {
        const idx = bpStore.runs.findIndex(r => r.id === runId)
        if (idx >= 0) bpStore.runs[idx] = { ...bpStore.runs[idx], ...run }
        if (selectedRun.value?.id === runId) selectedRun.value = { ...selectedRun.value, ...run }
        if (['succeeded', 'failed', 'cancelled'].includes(run.status)) {
          stopRunSSE()
          if (run.status === 'succeeded') toast.success('Blueprint run succeeded')
          else if (run.status === 'failed') toast.error('Blueprint run failed')
        }
      }).catch(() => {}).finally(() => {
        // If still not terminal, retry SSE
        if (sseRunId === runId) {
          stopRunSSE()
          setTimeout(() => { if (sseRunId === runId) startRunSSE(bpId, runId) }, 3000)
        }
      })
    }
  }

  /**
   * Stop the current SSE subscription.
   */
  function stopRunSSE() {
    sseRunId = null
    if (runEventSource) {
      runEventSource.close()
      runEventSource = null
    }
  }

  /**
   * Run a blueprint by ID and start SSE for real-time updates.
   */
  async function onRunBlueprint(id: string) {
    if (!id) return
    const run = await bpStore.runBlueprint(id)
    if (run) {
      selectedRun.value = run
      syncNodeRunStatuses()
      toast.success('Blueprint run started')
      startRunSSE(id, run.id)
    } else if (bpStore.error) {
      toast.error(bpStore.error)
    }
  }

  /**
   * Cancel a running blueprint by ID.
   */
  async function onCancelRun(id: string) {
    await bpStore.cancelRun(id)
    stopRunSSE()
    toast.success('Run cancelled')
  }

  /**
   * Fetch runs for a specific blueprint and auto-select active run.
   */
  async function fetchRunsForBlueprint(bpId: string) {
    await bpStore.fetchRuns(bpId)
    const activeRun = bpStore.runs.find(r => r.blueprint_id === bpId && (r.status === 'running' || r.status === 'queued'))
    if (activeRun) {
      selectedRun.value = activeRun
      syncNodeRunStatuses()
    }
  }

  // Cleanup on unmount
  onBeforeUnmount(() => {
    stopRunSSE()
  })

  return {
    selectedRun,
    syncNodeRunStatuses,
    startRunSSE,
    stopRunSSE,
    onRunBlueprint,
    onCancelRun,
    fetchRunsForBlueprint,
  }
}
