export default async function handler(req, res) {
    const TMDB_KEY = process.env.TMDB_API_KEY;

    if (!TMDB_KEY) {
        return res.status(500).json({ data: [] });
    }

    const today = new Date();
    const past60 = new Date();
    past60.setDate(today.getDate() - 60);

    const toISO = (d) => d.toISOString().slice(0, 10);

    try {
        const url = new URL("https://api.themoviedb.org/3/discover/movie");
        url.searchParams.set("api_key", TMDB_KEY);
        url.searchParams.set("region", "IN");
        url.searchParams.set("sort_by", "release_date.desc");
        url.searchParams.set("primary_release_date.gte", toISO(past60));
        url.searchParams.set("primary_release_date.lte", toISO(today));

        const resp = await fetch(url.toString());
        const json = await resp.json();

        const results = (json.results || []).map((m) => ({
            id: m.id,
            title: m.title,
            poster: m.poster_path
                ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                : null,
            originalYear: m.release_date?.slice(0, 4),
            rereleaseDate: m.release_date,
            language: m.original_language,
        }));

        return res.status(200).json({ data: results });
    } catch (e) {
        return res.status(200).json({ data: [] });
    }
}
