import { ref, watch } from 'vue'
import { agentPost, agentJson } from '@/api'

const STORAGE_KEY = 'hixns_compression_threshold'
const AUTO_KEY = 'hixns_auto_compress'

const compressionThreshold = ref(Number(localStorage.getItem(STORAGE_KEY)) || 80000)
const autoCompress = ref(localStorage.getItem(AUTO_KEY) !== 'false')

watch(compressionThreshold, v => localStorage.setItem(STORAGE_KEY, String(v)))
watch(autoCompress, v => localStorage.setItem(AUTO_KEY, String(v)))

function estimateTokens(text: string): number {
  let tokens = 0
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    tokens += code > 0x7f ? 0.67 : 0.25 // CJK ≈1.5 chars/token, EN ≈4 chars/token
  }
  return Math.ceil(tokens)
}

async function compressSession(sessionId: string, maxTokens?: number) {
  try {
    const res = await agentPost('/v1/agent/chat/compress', {
      session_id: sessionId,
      max_tokens: maxTokens || compressionThreshold.value,
    })
    return res
  } catch (e: any) {
    console.error('Context compression failed:', e)
    return { compressed: false, error: e?.message || String(e) }
  }
}

export function useContextCompression() {
  return {
    compressionThreshold,
    autoCompress,
    estimateTokens,
    compressSession,
  }
}
