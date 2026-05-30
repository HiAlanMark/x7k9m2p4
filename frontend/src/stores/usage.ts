import { defineStore } from 'pinia'
import { ref } from 'vue'
import { agentJson } from '@/api'

export interface UsageSummary {
  total_input_tokens: number
  total_output_tokens: number
  total_tokens: number
  total_cost: number
  cache_hit_rate: number
  session_count: number
  daily_avg_sessions: number
  model_distribution: Record<string, number>
  daily: DailyUsage[]
  error?: string
}

export interface DailyUsage {
  date: string
  input_tokens: number
  output_tokens: number
  tokens: number
  cost: number
  sessions: number
}

export interface ModelUsage {
  name: string
  input_tokens: number
  output_tokens: number
  cost: number
  sessions: number
}

export const useUsageStore = defineStore('usage', () => {
  const usageSummary = ref<UsageSummary | null>(null)
  const usageModels = ref<ModelUsage[]>([])
  const loading = ref(false)
  const error = ref('')
  const period = ref<'7d' | '30d' | '90d' | '365d'>('30d')

  async function fetchSummary(p?: '7d' | '30d' | '90d' | '365d') {
    if (p) period.value = p
    loading.value = true
    error.value = ''
    try {
      const data = await agentJson(`/v1/agent/usage/summary?period=${period.value}`)
      usageSummary.value = data as UsageSummary
    } catch (e: any) {
      error.value = e?.message || 'Failed to load usage summary'
    } finally {
      loading.value = false
    }
  }

  async function fetchModels() {
    try {
      const data = await agentJson('/v1/agent/usage/models')
      usageModels.value = (data as any).models || []
    } catch (e: any) {
      console.warn('[UsageStore] fetchModels failed:', e)
    }
  }

  return {
    usageSummary,
    usageModels,
    loading,
    error,
    period,
    fetchSummary,
    fetchModels,
  }
})
