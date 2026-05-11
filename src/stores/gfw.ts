import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GfwUser, GfwModel, ApiKeyInfo, DailyUsage, RechargePackage } from '@/types'
import * as api from '@/api'

export const useGfwStore = defineStore('gfw', () => {
  // State
  const isLoggedIn = ref(false)
  const user = ref<GfwUser | null>(null)
  const balance = ref(0)
  const models = ref<GfwModel[]>([])
  const apiKeys = ref<ApiKeyInfo[]>([])
  const dailyUsage = ref<DailyUsage[]>([])
  const rechargePackages = ref<RechargePackage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastRefreshed = ref<Date | null>(null)

  // Computed
  const totalTokens = computed(() => {
    return dailyUsage.value.reduce((sum, u) => sum + u.input_tokens + u.output_tokens, 0)
  })

  const totalCost = computed(() => {
    return dailyUsage.value.reduce((sum, u) => sum + u.total_cost, 0)
  })

  const featuredModels = computed(() => {
    return models.value.filter(m => m.is_featured && m.is_available)
  })

  const popularModels = computed(() => {
    return models.value.filter(m => m.is_featured).slice(0, 10)
  })

  // Actions
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const resp = await api.gfwLogin(email, password)
      user.value = resp.user
      isLoggedIn.value = true
      balance.value = resp.user.gcoin_balance
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function refreshToken() {
    try {
      const resp = await api.gfwRefreshToken()
      user.value = resp.user
      isLoggedIn.value = true
    } catch (e: unknown) {
      isLoggedIn.value = false
      user.value = null
      throw e
    }
  }

  async function fetchUserInfo() {
    try {
      const resp = await api.gfwGetUserInfo()
      user.value = resp.user
      balance.value = resp.user.gcoin_balance
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
    }
  }

  async function fetchBalance() {
    try {
      balance.value = await api.gfwGetBalance()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
    }
  }

  async function fetchModels() {
    if (models.value.length > 0) return // 缓存
    loading.value = true
    try {
      models.value = await api.gfwListModels()
      lastRefreshed.value = new Date()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  async function fetchApiKeys() {
    try {
      apiKeys.value = await api.gfwListApiKeys()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
    }
  }

  async function createApiKey(name: string, gcoinLimit?: number, rateLimit?: number) {
    loading.value = true
    try {
      const newKey = await api.gfwCreateApiKey(name, gcoinLimit, rateLimit)
      await fetchApiKeys()
      return newKey
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDailyUsage(days = 7) {
    try {
      dailyUsage.value = await api.gfwGetDailyUsage(days)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
    }
  }

  async function fetchRechargePackages() {
    try {
      rechargePackages.value = await api.gfwGetRechargePackages()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
    }
  }

  function getModelById(id: string): GfwModel | undefined {
    return models.value.find(m => m.id === id)
  }

  function logout() {
    isLoggedIn.value = false
    user.value = null
    balance.value = 0
  }

  return {
    isLoggedIn, user, balance, models, apiKeys, dailyUsage, rechargePackages,
    loading, error, lastRefreshed,
    totalTokens, totalCost, featuredModels, popularModels,
    login, refreshToken, fetchUserInfo, fetchBalance, fetchModels,
    fetchApiKeys, createApiKey, fetchDailyUsage, fetchRechargePackages,
    getModelById, logout,
  }
})
