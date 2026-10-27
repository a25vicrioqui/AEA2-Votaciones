```vue
<template>
  <div style="max-width: 900px; margin: 0 auto; padding: 25px 20px; text-align: center; font-family: Arial, sans-serif;">
    <h1 style="color: #2c3e50; margin-bottom: 10px;">Sistema de votaciones</h1>

    <p style="font-size: 17px;">Bienvenido, {{ store.loginInfo.username }}.</p>

    <p style="margin-bottom: 30px;">
      Estado de la conexión:
      <strong :style="{ color: conectado ? '#28a745' : '#dc3545' }">
        {{ conectado ? 'Conectado' : 'Desconectado' }}
      </strong>
    </p>

    <h2 style="color: #34495e; margin-bottom: 25px;">¿Cuál es tu opción favorita?</h2>

    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 35px;">
      <!-- Primera opción -->
      <BotoVotar
        nom="Bulbasaur"
        :vots="store.votos[0]"
        :imagen="bulbasaur"
        @votar="registrarVoto(0)"
      />

      <!-- Segunda opción -->
      <BotoVotar
        nom="Charmander"
        :vots="store.votos[1]"
        :imagen="charmander"
        @votar="registrarVoto(1)"
      />

      <!-- Tercera opción -->
      <BotoVotar
        nom="Squirtle"
        :vots="store.votos[2]"
        :imagen="squirtle"
        @votar="registrarVoto(2)"
      />

      <!-- Cuarta opción -->
      <BotoVotar
        nom="Pikachu"
        :vots="store.votos[3]"
        :imagen="pikachu"
        @votar="registrarVoto(3)"
      />
    </div>

    <h2 style="color: #34495e; margin-bottom: 20px;">Resultados de las votaciones</h2>

    <div style="height: 300px; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);">
      <canvas ref="graficoCanvas"></canvas>
    </div>

    <br />

    <button
      @click="cerrarSesion"
      style="margin-top: 15px; padding: 10px 22px; background-color: #e74c3c; color: white; border: none; border-radius: 6px; font-size: 15px; cursor: pointer;"
    >
      Cerrar sesión
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import BotoVotar from '@/components/BotoVotar.vue'

import bulbasaur from '@/assets/bulbasaur.png'
import charmander from '@/assets/charmander.png'
import squirtle from '@/assets/squirtle.png'
import pikachu from '@/assets/pikachu.png'

const router = useRouter()

const store = useAppStore() //para acceder a PINIAA

const conectado = ref(false)
const graficoCanvas = ref(null)

let socket = null
let grafico = null

const coloresBarres = [
  'rgba(76, 175, 80, 0.7)',
  'rgba(255, 87, 34, 0.7)',
  'rgba(33, 150, 243, 0.7)',
  'rgba(255, 193, 7, 0.7)',
]

function crearGrafico() {
  grafico = new Chart(graficoCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu'],
      datasets: [
        {
          label: 'Número de votos',
          data: [...store.votos],
          backgroundColor: coloresBarres,
          borderColor: coloresBarres,
          borderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  })
}

watch(
  () => store.votos,
  (nuevosVotos) => {
    if (grafico) {
      grafico.data.datasets[0].data = [...nuevosVotos]
      grafico.data.datasets[0].backgroundColor = coloresBarres
      grafico.data.datasets[0].borderColor = coloresBarres
      grafico.update()
    }
  },
  { deep: true }
)

onMounted(() => {
  crearGrafico()

  socket = new WebSocket('ws://localhost:8080')

  socket.onopen = () => {
    conectado.value = true
    console.log('Conexión WebSocket establecida')
  }

  socket.onmessage = (evento) => {
    try {
      const datos = JSON.parse(evento.data)

      if (datos.tipo === 'votos' && Array.isArray(datos.votos)) {
        store.setVotos(datos.votos)
      }
    } catch (error) {
      console.error('Error al procesar los datos recibidos:', error)
    }
  }

  socket.onerror = (error) => {
    console.error('Error en la conexión WebSocket:', error)
  }

  socket.onclose = () => {
    conectado.value = false
    console.log('Conexión WebSocket cerrada')
  }
})

function registrarVoto(indice) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('No se puede votar: no hay conexión con el servidor')
    return
  }

  socket.send(
    JSON.stringify({
      tipo: 'votar',
      indice: indice,
    })
  )
}

function cerrarSesion() {
  store.setLoginInfo({
    loggedIn: false,
    username: '',
    image: '',
  })

  router.push('/')
}

onUnmounted(() => {
  if (socket) {
    socket.close()
  }

  if (grafico) {
    grafico.destroy()
  }
})
</script>
```