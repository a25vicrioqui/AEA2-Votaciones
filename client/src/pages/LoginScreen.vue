```vue
<template>
  <div class="login">
    <h1>Iniciar sesión</h1>
    <p>Introduce tus credenciales para acceder a las votaciones.</p>

    <form @submit.prevent="iniciarSesion">
      <label for="username">Usuario:</label>
      <input id="username" v-model="username" type="text" required />

      <label for="password">Contraseña:</label>
      <input id="password" v-model="password" type="password" required />

      <button type="submit">Entrar</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const store = useAppStore()

const username = ref('')
const password = ref('')
const error = ref('')

function iniciarSesion() {
  if (username.value === 'user' && password.value === '123') {
    store.setLoginInfo({
      loggedIn: true,
      username: username.value,
      image: '',
    })

    router.push('/votacions')
  } else {
    error.value = 'El usuario o la contraseña son incorrectos.'
  }
}
</script>

<style scoped>
.login {
  max-width: 350px;
  margin: 60px auto;
  padding: 25px;
  background-color: #eaf4ff;
  border: 1px solid #c5dcf5;
  border-radius: 10px;
}

h1 {
  text-align: center;
  color: #24476b;
}

.login p {
  text-align: center;
  color: #555;
}

label {
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #b5c9df;
  border-radius: 5px;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background-color: #315f91;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #24476b;
}

.error {
  color: red !important;
}
</style>
```