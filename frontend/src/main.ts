import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'
import '@fontsource/comic-neue/400.css'
import '@fontsource/comic-neue/700.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './styles/variables.css'
import './styles/enhancements.css'
import './styles/comic-theme.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.component('DynamicScroller', DynamicScroller)
app.component('DynamicScrollerItem', DynamicScrollerItem)
app.mount('#app')
