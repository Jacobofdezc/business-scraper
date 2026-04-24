const axios = require("axios");

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
const DETAILS_URL = "https://places.googleapis.com/v1/places";
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS) || 20;

/**
 * Busca negocios usando la Places API (New) de Google.
 * Hace paginación automática hasta MAX_RESULTS resultados.
 */
async function searchBusinesses(query, location) {
  if (!API_KEY || API_KEY === "TU_CLAVE_AQUI") {
    throw new Error("GOOGLE_PLACES_API_KEY no configurada en el archivo .env");
  }

  const textQuery = `${query} en ${location}`;
  let allPlaces = [];
  let pageToken = null;

  do {
    const body = {
      textQuery,
      languageCode: "es",
      maxResultCount: Math.min(20, MAX_RESULTS - allPlaces.length),
    };
    if (pageToken) body.pageToken = pageToken;

    const response = await axios.post(BASE_URL, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.nationalPhoneNumber",
          "places.internationalPhoneNumber",
          "places.websiteUri",
          "places.rating",
          "places.userRatingCount",
          "places.primaryTypeDisplayName",
          "places.businessStatus",
          "places.googleMapsUri",
          "nextPageToken",
        ].join(","),
      },
    });

    const data = response.data;
    const places = data.places || [];
    allPlaces = allPlaces.concat(places);
    pageToken = data.nextPageToken || null;

    // Respetamos el límite máximo
    if (allPlaces.length >= MAX_RESULTS) break;
    // Si Google no devuelve más páginas, paramos
    if (!pageToken) break;

    // La API requiere un pequeño delay entre páginas
    if (pageToken) await sleep(200);
  } while (allPlaces.length < MAX_RESULTS);

  return allPlaces.slice(0, MAX_RESULTS).map(normalizeBusiness);
}

/**
 * Normaliza un place de Google al formato interno de la app.
 */
function normalizeBusiness(place) {
  const hasWeb = !!place.websiteUri;
  return {
    id: place.id || "",
    nombre: place.displayName?.text || "Sin nombre",
    direccion: place.formattedAddress || "Sin dirección",
    telefono: place.nationalPhoneNumber || place.internationalPhoneNumber || "",
    valoracion: place.rating ? parseFloat(place.rating.toFixed(1)) : null,
    resenas: place.userRatingCount || 0,
    categoria: place.primaryTypeDisplayName?.text || "",
    tiene_web: hasWeb,
    web_url: hasWeb ? place.websiteUri : "",
    google_maps_url: place.googleMapsUri || "",
    estado: place.businessStatus || "OPERATIONAL",
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { searchBusinesses };
