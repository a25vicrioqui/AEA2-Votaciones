// Importamos las bibliotecas necesarias
const WebSocket = require('ws')
const fs = require('fs')
const path = require('path')

// Puerto del servidor
const PORT = process.env.PORT || 8080

// Ruta del archivo donde guardaremos los votos
const RUTA_VOTOS = path.join(__dirname, 'votos.json')

// Comprobamos si existe el archivo de votos
if (!fs.existsSync(RUTA_VOTOS)) {
  // Si no existe, creamos uno con las cuatro opciones a cero
  fs.writeFileSync(
    RUTA_VOTOS,
    JSON.stringify([0, 0, 0, 0], null, 2)
  )
}

// Leemos los votos guardados
let votos = JSON.parse(
  fs.readFileSync(RUTA_VOTOS, 'utf8')
)

// Creamos el servidor WebSocket
const servidor = new WebSocket.Server({
  port: PORT,
})

// Enviamos los votos actualizados a todos los clientes conectados
function enviarVotos() {
  const mensaje = JSON.stringify({
    tipo: 'votos',
    votos: votos,
  })

  servidor.clients.forEach((cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(mensaje)
    }
  })
}

// Se ejecuta cuando un cliente se conecta
servidor.on('connection', (cliente) => {
  console.log('Nuevo cliente conectado')

  // Enviamos inmediatamente los votos actuales al cliente
  cliente.send(
    JSON.stringify({
      tipo: 'votos',
      votos: votos,
    })
  )

  // Escuchamos los mensajes que envía el cliente
  cliente.on('message', (mensaje) => {
    try {
      // Convertimos el mensaje recibido a un objeto JavaScript
      const datos = JSON.parse(mensaje.toString())

      // Comprobamos que sea un mensaje de voto
      if (datos.tipo === 'votar') {
        const indice = datos.indice

        // Comprobamos que el índice sea válido
        if (
          !Number.isInteger(indice) ||
          indice < 0 ||
          indice >= votos.length
        ) {
          console.log('Se ha recibido un voto no válido')
          return
        }

        // Incrementamos los votos de la opción seleccionada
        votos[indice]++

        // Guardamos los resultados en el archivo JSON
        fs.writeFileSync(
          RUTA_VOTOS,
          JSON.stringify(votos, null, 2)
        )

        console.log(`Voto registrado en la opción ${indice + 1}`)
        console.log('Votos actuales:', votos)

        // Enviamos los resultados actualizados a todos los clientes
        enviarVotos()
      }
    } catch (error) {
      console.error('Error al procesar el mensaje:', error.message)
    }
  })

  // Se ejecuta cuando el cliente se desconecta
  cliente.on('close', () => {
    console.log('Cliente desconectado')
  })
})

// Mensaje cuando el servidor empieza a funcionar
servidor.on('listening', () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`)
  console.log('Votos iniciales:', votos)
})