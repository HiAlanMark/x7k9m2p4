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
    { path: '/usage', component: () => import('./views/UsageView.vue') },
    { path: '/settings', component: () => import('./views/SettingsView.vue') },
    { path: '/profiles', component: () => import('./views/ProfilesView.vue') },
    { path: '/channels', component: () => import('./views/ChannelsView.vue') },
    { path: '/files', component: () => import('./views/FilesView.vue') },
    { path: '/group-chat', component: () => import('./views/GroupChatView.vue') },
    { path: '/coding-agents', component: () => import('./views/CodingAgentsView.vue') },
  ],
})

export default router
