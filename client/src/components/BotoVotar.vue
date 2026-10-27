<template>
  <div>
    <h2>{{ nom }}</h2>

    <img :src="imagen" :alt="nom" width="150" />

    <p>Votos actuales: {{ vots }}</p>

    <button @click="votar">
      Votar
    </button>
  </div>
</template>

<script setup>
// Recibimos los datos de la pantalla principal
defineProps({
  nom: {
    type: String,
    required: true,
  },

  vots: {
    type: Number,
    required: true,
  },

  imagen: {
    type: String,
    required: true,
  },
})

// Definimos el evento que enviaremos al componente padre
const emit = defineEmits(['votar'])

// Avisamos al componente padre cuando alguien vota
function votar() {
  emit('votar')
}
</script>