import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import './main.css'
import Vue3Toastify, {type ToastContainerOptions} from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import NissinTheme from './nissinTheme.ts'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
    theme: {
        preset: NissinTheme,
        options: {
            darkModeSelector: '.dark'
        }
    },
})
app.use(
    Vue3Toastify,
    {
        autoClose: 2000,
        position: "bottom-right",
    } as ToastContainerOptions
)
app.use(router)

app.mount('#app')
