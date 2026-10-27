// Importamos Vue
import { createApp } from 'vue'

// Importamos Pinia
import { createPinia } from 'pinia'

// Importamos Vue Router
import router from './router'

// Importamos los plugins de Vuetify
import { registerPlugins } from '@/plugins'

// Importamos el componente principal
import App from './App.vue'

// Importamos los estilos
import 'unfonts.css'

// Creamos la aplicación Vue
const app = createApp(App)

// Creamos el almacén de Pinia
const pinia = createPinia()

// Registramos Pinia
app.use(pinia)

// Registramos Vue Router
app.use(router)

// Registramos Vuetify
registerPlugins(app)

// Iniciamos la aplicación
app.mount('#app')