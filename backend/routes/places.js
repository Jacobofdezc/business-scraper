const express = require("express");
const router = express.Router();
const { searchBusinesses } = require("../services/googlePlaces");

/**
 * GET /api/places/search?q=fontaneros&location=Madrid&filter=noweb
 *
 * Parámetros:
 *   q         — tipo de negocio (obligatorio)
 *   location  — ciudad o zona (obligatorio)
 *   filter    — "all" | "noweb" | "hasweb" (opcional, default: "all")
 *
 * Respuesta:
 *   { results: [...], total: N, noWeb: N, hasWeb: N, avgRating: N }
 */
router.get("/search", async (req, res, next) => {
  try {
    const { q, location, filter = "all" } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ error: "El parámetro 'q' (nicho) es obligatorio." });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ error: "El parámetro 'location' (zona) es obligatorio." });
    }

    const businesses = await searchBusinesses(q.trim(), location.trim());

    // Filtro opcional en servidor
    let results = businesses;
    if (filter === "noweb") results = businesses.filter((b) => !b.tiene_web);
    if (filter === "hasweb") results = businesses.filter((b) => b.tiene_web);

    // Stats siempre sobre el total, no el filtrado
    const noWeb = businesses.filter((b) => !b.tiene_web).length;
    const hasWeb = businesses.filter((b) => b.tiene_web).length;
    const ratedOnes = businesses.filter((b) => b.valoracion !== null);
    const avgRating =
      ratedOnes.length > 0
        ? parseFloat(
            (ratedOnes.reduce((s, b) => s + b.valoracion, 0) / ratedOnes.length).toFixed(1)
          )
        : null;

    res.json({
      results,
      stats: {
        total: businesses.length,
        noWeb,
        hasWeb,
        avgRating,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/places/export?q=fontaneros&location=Madrid&filter=noweb
 * Devuelve un CSV descargable con los resultados.
 */
router.get("/export", async (req, res, next) => {
  try {
    const { q, location, filter = "all" } = req.query;

    if (!q?.trim() || !location?.trim()) {
      return res.status(400).json({ error: "Faltan parámetros 'q' y 'location'." });
    }

    const businesses = await searchBusinesses(q.trim(), location.trim());

    let results = businesses;
    if (filter === "noweb") results = businesses.filter((b) => !b.tiene_web);
    if (filter === "hasweb") results = businesses.filter((b) => b.tiene_web);

    // Generar CSV manualmente (compatible con Excel en español — separador ;)
    const BOM = "\uFEFF";
    const headers = [
      "Nombre",
      "Teléfono",
      "Dirección",
      "Valoración",
      "Reseñas",
      "Categoría",
      "Tiene Web",
      "URL Web",
      "Google Maps",
    ];

    const rows = results.map((b) =>
      [
        `"${b.nombre.replace(/"/g, '""')}"`,
        `"${b.telefono}"`,
        `"${b.direccion.replace(/"/g, '""')}"`,
        b.valoracion ?? "",
        b.resenas,
        `"${b.categoria}"`,
        b.tiene_web ? "Sí" : "No",
        `"${b.web_url}"`,
        `"${b.google_maps_url}"`,
      ].join(";")
    );

    const csv = BOM + [headers.join(";"), ...rows].join("\n");
    const filename = `negocios_${q}_${location}_${Date.now()}.csv`
      .replace(/\s+/g, "_")
      .toLowerCase();

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
