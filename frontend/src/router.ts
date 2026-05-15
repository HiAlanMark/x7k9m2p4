import { createRouter, createWebHistory } from 'vue-router'
import ChatView from './views/ChatView.vue'
import SkillStoreView from './views/SkillStoreView.vue'
import SettingsView from './views/SettingsView.vue'
import TasksView from './views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ChatView },
    { path: '/skills', component: SkillStoreView },
    { path: '/tasks', component: TasksView },
    { path: '/settings', component: SettingsView },
  ],
})

export default router
