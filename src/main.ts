import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupMock } from './mock'

// 仅当开启 Mock 时挂载本地数据适配器，业务层完全无感
if (import.meta.env.VITE_USE_MOCK === 'true') {
  setupMock()
}

createApp(App).use(createPinia()).mount('#app')
