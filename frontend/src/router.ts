import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/ChatView.vue') },
    { path: '/blueprints', component: () => import('./views/BlueprintView.vue') },
    { path: '/inbox', component: () => import('./views/InboxView.vue') },
    { path: '/history', component: () => import('./views/HistoryView.vue') },
    { path: '/skills', component: () => import('./views/SkillStoreView.vue') },
    { path: '/tasks', component: () => import('./views/TasksView.vue') },
    { path: '/settings', component: () => import('./views/SettingsView.vue') },
  ],
})

export default router
