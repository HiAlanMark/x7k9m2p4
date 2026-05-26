// AI Provider Icons - Static imports for Vite bundling
// Downloaded from LobeHub Icons (https://lobehub.com/icons)
// Using static import so Vite resolves correct hashed paths at build time

import openai from './openai.png'
import anthropic from './anthropic.png'
import deepseek from './deepseek.png'
import google from './google.png'
import xai from './xai.png'
import openrouter from './openrouter.png'
import alibabacloud from './alibabacloud.png'
import groq from './groq.png'
import huggingface from './huggingface.png'
import minimax from './minimax.png'
import moonshot from './moonshot.png'
import zhipu from './zhipu.png'
import ollama from './ollama.png'
import vllm from './vllm.png'
import lmstudio from './lmstudio.png'
import together from './together.png'
import anyscale from './anyscale.png'
import perplexity from './perplexity.png'
import mistral from './mistral.png'
import cohere from './cohere.png'
import fireworks from './fireworks.png'
import replicate from './replicate.png'
import nvidia from './nvidia.png'
import ibm from './ibm.png'
import azure from './azure.png'
import bedrock from './bedrock.png'
import cloudflare from './cloudflare.png'
import cerebras from './cerebras.png'
import friendli from './friendli.png'
import novita from './novita.png'
import sambanova from './sambanova.png'

// icon key → Vite-resolved URL
export const providerIconUrls: Record<string, string> = {
  openai,
  anthropic,
  deepseek,
  google,
  xai,
  openrouter,
  alibabacloud,
  groq,
  huggingface,
  minimax,
  moonshot,
  zhipu,
  ollama,
  vllm,
  lmstudio,
  together,
  anyscale,
  perplexity,
  mistral,
  cohere,
  fireworks,
  replicate,
  nvidia,
  ibm,
  azure,
  bedrock,
  cloudflare,
  cerebras,
  friendli,
  novita,
  sambanova,
}

// 提供商名称 → icon key 映射（用于 SettingsView.vue 的 providerIconMap）
export const providerIconMap: Record<string, string> = {
  'OpenAI': openai,
  'Anthropic': anthropic,
  'DeepSeek': deepseek,
  'Google Gemini': google,
  'xAI / Grok': xai,
  'OpenRouter': openrouter,
  'Qwen (DashScope)': alibabacloud,
  'Groq': groq,
  'Hugging Face': huggingface,
  'MiniMax': minimax,
  'Kimi / Moonshot': moonshot,
  'Z.AI / GLM': zhipu,
  'Ollama (本地)': ollama,
  'vLLM': vllm,
  'LM Studio': lmstudio,
  'Together AI': together,
  'Anyscale': anyscale,
  'Perplexity': perplexity,
  'Mistral AI': mistral,
  'Cohere': cohere,
  'Fireworks AI': fireworks,
  'Replicate': replicate,
  'NVIDIA NIM': nvidia,
  'IBM Watsonx': ibm,
  'Azure OpenAI': azure,
  'Amazon Bedrock': bedrock,
  'Cloudflare AI': cloudflare,
  'Cerebras': cerebras,
  'FriendliAI': friendli,
  'Novita AI': novita,
  'SambaNova': sambanova,
}

// 提供商名称映射
export const providerNames: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  deepseek: 'DeepSeek',
  google: 'Google Gemini',
  xai: 'xAI / Grok',
  openrouter: 'OpenRouter',
  alibabacloud: 'Qwen (DashScope)',
  groq: 'Groq',
  huggingface: 'Hugging Face',
  minimax: 'MiniMax',
  moonshot: 'Kimi / Moonshot',
  zhipu: 'Z.AI / GLM',
  ollama: 'Ollama (本地)',
  vllm: 'vLLM',
  lmstudio: 'LM Studio',
  together: 'Together AI',
  anyscale: 'Anyscale',
  perplexity: 'Perplexity',
  mistral: 'Mistral AI',
  cohere: 'Cohere',
  fireworks: 'Fireworks AI',
  replicate: 'Replicate',
  nvidia: 'NVIDIA NIM',
  ibm: 'IBM Watsonx',
  azure: 'Azure OpenAI',
  bedrock: 'Amazon Bedrock',
  cloudflare: 'Cloudflare AI',
  cerebras: 'Cerebras',
  friendli: 'FriendliAI',
  novita: 'Novita AI',
  sambanova: 'SambaNova',
}
