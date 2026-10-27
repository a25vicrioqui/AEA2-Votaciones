# AEA2 - Votacions en temps real

## Descripció

Aquest projecte consisteix en una aplicació de votacions en temps real amb un client web i un servidor WebSocket. Els clients connectats reben els vots actualitzats en viu i poden registrar un vot en una de les opcions disponibles. Les dades es guarden al fitxer `servidor/votos.json` i es comparteixen entre tots els clients connectats.

## Tecnologies utilitzades

- Vue 3
- Vite
- Pinia
- Vuetify
- Chart.js
- Node.js
- WebSocket (`ws`)
- Docker Compose

La part client es troba a `client/` i la part servidor a `servidor/`.

## Estructura de carpetes

```text
AEA2-Votaciones/
├── client/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.mts
│   ├── tsconfig.json
│   └── index.html
├── servidor/
│   ├── server.js
│   ├── votos.json
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Funcionalitats implementades

- Pantalla de login i gestió de la informació d'usuari amb Pinia.
- Pantalla de votacions amb 4 opcions: Bulbasaur, Charmander, Squirtle i Pikachu.
- Connexió WebSocket entre client i servidor.
- Enviament i recepció de dades en temps real.
- Actualització de la llista de vots en tots els clients connectats.
- Persistència dels resultats en `servidor/votos.json`.
- Gràfica de barres amb Chart.js per mostrar els resultats.
- Contenidorització del client i del servidor amb Docker.

## Executar el client i el servidor localment

### 1. Instal·lar dependències

Des de la carpeta del client:

```bash
cd client
npm install
```

Des de la carpeta del servidor:

```bash
cd servidor
npm install
```

### 2. Arrencar el client

```bash
cd client
npm run dev
```

Aquest projecte usa Vite i el client es pot servir localment amb el port per defecte de Vite.

### 3. Arrencar el servidor

```bash
cd servidor
npm start
```

O bé:

```bash
cd servidor
node server.js
```

El servidor WebSocket escolta al port `8080` i envia els vots actualitzats a cada client connectat.

## Arrencar el projecte amb Docker Compose

Des de la carpeta arrel del projecte:

```bash
docker compose up --build
```

Aquest fitxer de configuració defineix dos serveis:

- `frontend`: construït a partir de `client/Dockerfile`, exposat al port `3000`
- `backend`: construït a partir de `servidor/Dockerfile`, exposat al port `8080`

La configuració real del projecte és la següent:

```yaml
services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build:
      context: ./servidor
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
```

## Executar l'aplicació amb Electron

En aquest repositori actual no hi ha un projecte Electron definit ni un `package.json` a una carpeta `electron/`. A la estructura real disponible, l'aplicació es desplega com a client web Vite i servidor WebSocket Node.js, i la manera documentada de fer-ho funcionar és mitjançant el client local o Docker Compose.

## Notes finals

- El servidor guarda els vots en `servidor/votos.json`.
- La configuració del client es basa en WebSocket i el servidor envia un missatge del tipus `votos` amb l'array de resultats.
- La lògica de votació està implementada a `servidor/server.js` i la sincronització a `client/src/pages/VotacionsScreen.vue`.
