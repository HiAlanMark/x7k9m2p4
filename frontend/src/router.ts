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
    { path: '/files', component: () => import('./views/FilesView.vue') },
    { path: '/group-chat', component: () => import('./views/GroupChatView.vue') },
    // Settings 包含了 Profiles, Channels, Usage, CodingAgents
    { path: '/settings', component: () => import('./views/SettingsView.vue') },
    { path: '/profiles', redirect: '/settings' },
    { path: '/channels', redirect: '/settings' },
    { path: '/usage', redirect: '/settings' },
    { path: '/coding-agents', redirect: '/settings' },
  ],
})

export default router
