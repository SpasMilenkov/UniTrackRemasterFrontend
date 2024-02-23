import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import router from './router/index'

import Lara from './presets/lara' //import preset
const app = createApp(App)
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara,
})

app.use(router)
app.mount('#app')
