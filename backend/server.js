require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const placesRouter = require("./routes/places");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Seguridad ───────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET"],
  })
);

// Rate limiting: máx. 30 búsquedas por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas solicitudes. Inténtalo de nuevo en 15 minutos.",
  },
});
app.use("/api/", limiter);

app.use(express.json());

// ── Rutas ───────────────────────────────────────────────────
app.use("/api/places", placesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Error handler ───────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor." });
});

app.listen(PORT, () => {
  console.log(`✅  Servidor corriendo en http://localhost:${PORT}`);
  if (!process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY === "TU_CLAVE_AQUI") {
    console.warn("⚠️   GOOGLE_PLACES_API_KEY no configurada. Copia .env.example → .env y añade tu clave.");
  }
});
