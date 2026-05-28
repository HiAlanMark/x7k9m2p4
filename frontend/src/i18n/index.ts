import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'

const saved = localStorage.getItem('hixns-language') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: saved,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    en: en,
  },
})

export default i18n

export function setLocale(lang: 'zh-CN' | 'en') {
  i18n.global.locale.value = lang
  localStorage.setItem('hixns-language', lang)
  document.documentElement.setAttribute('lang', lang === 'zh-CN' ? 'zh' : 'en')
}
