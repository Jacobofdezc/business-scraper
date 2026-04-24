# LeadMapa — Buscador de negocios sin web

Scraper de Google Maps que encuentra negocios por nicho y zona, filtra los que no tienen página web y exporta los datos a CSV.

---

## Stack

- **Frontend**: React + Vite (CSS puro, sin dependencias de UI)
- **Backend**: Node.js + Express
- **API**: Google Places API (New)
- **Deploy**: Docker + cualquier VPS, Railway, Render, Fly.io...

---

## 1. Obtener la clave de Google Places API

1. Ve a [console.cloud.google.com](https://console.cloud.google.com/)
2. Crea un proyecto nuevo (o usa uno existente)
3. En **APIs & Services → Library**, busca y activa **"Places API (New)"**
4. En **APIs & Services → Credentials**, crea una **API Key**
5. (Recomendado) Restringe la clave a tu IP o dominio de servidor

---

## 2. Instalación en local

### Backend

```bash
cd backend
cp .env.example .env
# Edita .env y añade tu GOOGLE_PLACES_API_KEY
npm install
npm run dev        # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

El proxy de Vite redirige `/api/*` → `http://localhost:3001` automáticamente.

---

## 3. Variables de entorno del backend

Copia `backend/.env.example` → `backend/.env` y rellena:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3001` |
| `FRONTEND_URL` | Origen CORS permitido | `https://tudominio.com` |
| `GOOGLE_PLACES_API_KEY` | Clave de Google Places | `AIzaSy...` |
| `MAX_RESULTS` | Resultados por búsqueda (máx. 60) | `20` |

---

## 4. Endpoints de la API

### `GET /api/places/search`

Busca negocios y devuelve JSON.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `q` | string | Tipo de negocio (`fontaneros`) |
| `location` | string | Ciudad o zona (`Madrid`) |
| `filter` | string | `all` \| `noweb` \| `hasweb` |

**Respuesta:**
```json
{
  "results": [
    {
      "id": "...",
      "nombre": "Fontanería García",
      "telefono": "612 345 678",
      "direccion": "Calle Mayor 12, Madrid",
      "valoracion": 4.2,
      "resenas": 47,
      "categoria": "Fontanería",
      "tiene_web": false,
      "web_url": "",
      "google_maps_url": "https://maps.google.com/..."
    }
  ],
  "stats": {
    "total": 20,
    "noWeb": 12,
    "hasWeb": 8,
    "avgRating": 4.1
  }
}
```

### `GET /api/places/export`

Mismos parámetros que `/search`. Devuelve un archivo `.csv` descargable (separador `;`, compatible con Excel en español).

---

## 5. Despliegue con Docker

```bash
# En la raíz del proyecto
cp backend/.env.example backend/.env
# Edita backend/.env con tu clave API

docker-compose up --build -d
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

---

## 6. Despliegue en Railway (recomendado para empezar)

### Backend en Railway

1. Crea cuenta en [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub repo**
3. Selecciona la carpeta `backend/` como root
4. En **Variables**, añade: `GOOGLE_PLACES_API_KEY`, `FRONTEND_URL` (tu dominio del frontend), `MAX_RESULTS`
5. Railway detecta el `Dockerfile` y despliega automáticamente

### Frontend en Vercel

1. Crea cuenta en [vercel.com](https://vercel.com)
2. **New Project → Import Git Repository**
3. Selecciona la carpeta `frontend/` como root
4. En **Environment Variables**, añade:
   - `VITE_API_URL` = URL del backend de Railway (ej: `https://tu-backend.railway.app`)
5. En `frontend/vite.config.js`, cambia el proxy target a la URL de Railway en producción

---

## 7. Despliegue en un VPS (DigitalOcean, Hetzner, etc.)

```bash
# En el servidor
git clone https://github.com/tuusuario/leadmapa.git
cd leadmapa
cp backend/.env.example backend/.env
nano backend/.env   # Añade tu clave API y dominio

# Arranca con Docker
docker-compose up -d --build

# Configura Nginx como reverse proxy (puerto 80/443)
# y certbot para SSL gratuito
```

---

## 8. Costes de Google Places API

- **Places API (New)** cobra por petición
- Búsqueda de texto: ~$0.017 por petición (20 resultados)
- Google da **$200 de crédito gratis al mes** (~11.700 búsquedas gratis)
- Para un uso normal (cientos de búsquedas/mes) es prácticamente gratuito

---

## Estructura del proyecto

```
business-scraper/
├── backend/
│   ├── server.js           # Entry point Express
│   ├── routes/
│   │   └── places.js       # Endpoints /search y /export
│   ├── services/
│   │   └── googlePlaces.js # Lógica Google Places API
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatsRow.jsx
│   │   │   ├── ResultsTable.jsx
│   │   │   └── Footer.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```
