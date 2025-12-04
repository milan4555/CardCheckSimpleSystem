import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import './main.css'
import Vue3Toastify, {type ToastContainerOptions} from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    }
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
