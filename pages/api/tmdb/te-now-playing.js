export const config = { api: { bodyParser: false } };
export const dynamic = "force-dynamic";

const V3 = process.env.TMDB_API_KEY;
const V4 = process.env.TMDB_ACCESS_TOKEN;

function authOpts() {
  return V4
    ? { headers: { Authorization: `Bearer ${V4}`, accept: "application/json" }, cache: "no-store" }
    : { cache: "no-store" };
}

function addKey(url) {
  if (!V4 && V3) url.searchParams.set("api_key", V3);
  return url;
}

function uniqBy(arr, key = "id") {
  const seen = new Set();
  return arr.filter(x => (seen.has(x[key]) ? false : (seen.add(x[key]), true)));
}

function toISO(d) { return d.toISOString().slice(0, 10); }

export default async function handler(req, res) {
  if (!V3 && !V4) {
    return res.status(500).json({ error: "TMDB key missing" });
  }

  const today = new Date();
  const plus90 = new Date(today); plus90.setDate(today.getDate() + 90);
  const minus30 = new Date(today); minus30.setDate(today.getDate() - 30);

  try {
    // 1) NOW PLAYING (India) → filter Telugu client-side
    const np = new URL("https://api.themoviedb.org/3/movie/now_playing");
    np.searchParams.set("region", "IN");
    np.searchParams.set("page", "1");
    addKey(np);

    const rNow = await fetch(np, authOpts());
    const jNow = await rNow.json();
    const nowPlayingTe = Array.isArray(jNow.results)
      ? jNow.results.filter(m => m.original_language === "te")
      : [];

    // 2) UPCOMING (next 90d), strictly Telugu, theatrical releases in India
    const up = new URL("https://api.themoviedb.org/3/discover/movie");
    up.searchParams.set("with_original_language", "te");
    up.searchParams.set("primary_release_date.gte", toISO(today));
    up.searchParams.set("primary_release_date.lte", toISO(plus90));
    up.searchParams.set("with_release_type", "2|3"); // theatrical
    up.searchParams.set("region", "IN");
    up.searchParams.set("sort_by", "primary_release_date.asc");
    up.searchParams.set("page", "1");
    addKey(up);

    const rUp = await fetch(up, authOpts());
    const jUp = await rUp.json();
    const upcomingTe = Array.isArray(jUp.results) ? jUp.results : [];

    // 3) RECENT releases (last 30d) to capture very new titles
    const recent = new URL("https://api.themoviedb.org/3/discover/movie");
    recent.searchParams.set("with_original_language", "te");
    recent.searchParams.set("primary_release_date.gte", toISO(minus30));
    recent.searchParams.set("primary_release_date.lte", toISO(today));
    recent.searchParams.set("with_release_type", "2|3");
    recent.searchParams.set("region", "IN");
    recent.searchParams.set("sort_by", "primary_release_date.desc");
    recent.searchParams.set("page", "1");
    addKey(recent);

    const rRecent = await fetch(recent, authOpts());
    const jRecent = await rRecent.json();
    const recentTe = Array.isArray(jRecent.results) ? jRecent.results : [];

    // Combine with priority: now playing → upcoming → recent
    const merged = uniqBy(
      [...nowPlayingTe, ...upcomingTe, ...recentTe],
      "id"
    ).slice(0, 30);

    // If everything failed, fall back to trending Telugu so the UI never looks empty
    if (!merged.length) {
      const tr = new URL("https://api.themoviedb.org/3/trending/movie/week");
      addKey(tr);
      const rTr = await fetch(tr, authOpts());
      const jTr = await rTr.json();
      const fallback = Array.isArray(jTr.results)
        ? jTr.results.filter(m => m.original_language === "te")
        : [];
      return res.status(200).json({ results: fallback.slice(0, 30) });
    }

    return res.status(200).json({ results: merged });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
