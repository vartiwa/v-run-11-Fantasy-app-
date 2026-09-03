// Server-side proxy for live cricket scores with safe fallback

export async function GET() {
  const apiKey = process.env.CRICKETDATA_API_KEY;

  if (!apiKey) {
    return Response.json({ matches: [] }, { status: 200 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" },
      }
    ).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      return Response.json({ matches: [] }, { status: 200 });
    }

    const data = await res.json();

    const matches = (data?.data || [])
      .filter((m) => m.matchStarted && !m.matchEnded)
      .slice(0, 5)
      .map((m) => ({
        id: m.id,
        name: m.name,
        status: m.status,
        teams: m.teams,
        score: m.score || [],
      }));

    return Response.json({ matches }, { status: 200 });
  } catch {
    return Response.json({ matches: [] }, { status: 200 });
  }
}