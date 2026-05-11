import { createRouter, createWebHistory } from 'vue-router'
import ChatView from './views/ChatView.vue'
import SkillStoreView from './views/SkillStoreView.vue'
import SettingsView from './views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ChatView },
    { path: '/skills', component: SkillStoreView },
    { path: '/settings', component: SettingsView },
  ],
})

export default router
