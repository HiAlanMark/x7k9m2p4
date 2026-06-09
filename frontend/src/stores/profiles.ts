import { defineStore } from 'pinia'
import { ref } from 'vue'
import { agentJson, agentPost, agentFetch, getAuthToken } from '@/api'

export interface Profile {
  name: string
  is_active: boolean
  created_at: string
  sessions: number
}

export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref<Profile[]>([])
  const activeProfile = ref<string>('default')
  const loading = ref(false)
  const error = ref('')

  async function fetchProfiles() {
    loading.value = true
    error.value = ''
    try {
      const data = await agentJson('/v1/agent/profiles')
      profiles.value = data.profiles || []
      activeProfile.value = data.active || 'default'
    } catch (e: any) {
      error.value = e?.message || 'Failed to fetch profiles'
    } finally {
      loading.value = false
    }
  }

  async function createProfile(name: string): Promise<boolean> {
    error.value = ''
    try {
      const data = await agentPost('/v1/agent/profiles', { name })
      if (data.error) {
        error.value = data.error
        return false
      }
      await fetchProfiles()
      return true
    } catch (e: any) {
      error.value = e?.message || 'Failed to create profile'
      return false
    }
  }

  async function switchProfile(name: string): Promise<boolean> {
    error.value = ''
    try {
      const data = await agentPost('/v1/agent/profiles/switch', { name })
      if (data.error) {
        error.value = data.error
        return false
      }
      activeProfile.value = name
      await fetchProfiles()
      return true
    } catch (e: any) {
      error.value = e?.message || 'Failed to switch profile'
      return false
    }
  }

  async function deleteProfile(name: string): Promise<boolean> {
    error.value = ''
    try {
      const r = await agentFetch('/v1/agent/profiles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await r.json()
      if (data.error) {
        error.value = data.error
        return false
      }
      await fetchProfiles()
      return true
    } catch (e: any) {
      error.value = e?.message || 'Failed to delete profile'
      return false
    }
  }

  async function exportProfile(name: string): Promise<boolean> {
    error.value = ''
    try {
      const r = await agentFetch('/v1/agent/profiles/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!r.ok) {
        const err = await r.text().catch(() => '')
        error.value = err || 'Export failed'
        return false
      }
      // Download the file
      const blob = await r.blob()
      const buffer = await blob.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), '')
      const base64 = btoa(binary)
      const url = `data:application/gzip;base64,${base64}`
      const a = document.createElement('a')
      a.href = url
      a.download = `profile_${name}.tar.gz`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return true
    } catch (e: any) {
      error.value = e?.message || 'Failed to export profile'
      return false
    }
  }

  async function importProfile(file: File): Promise<string | null> {
    error.value = ''
    try {
      const formData = new FormData()
      formData.append('file', file)
      const r = await agentFetch('/v1/agent/profiles/import', {
        method: 'POST',
        body: formData,
      })
      const data = await r.json()
      if (data.error) {
        error.value = data.error
        return null
      }
      await fetchProfiles()
      return data.name || null
    } catch (e: any) {
      error.value = e?.message || 'Failed to import profile'
      return null
    }
  }

  return {
    profiles,
    activeProfile,
    loading,
    error,
    fetchProfiles,
    createProfile,
    switchProfile,
    deleteProfile,
    exportProfile,
    importProfile,
  }
})
