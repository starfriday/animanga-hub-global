const SHIKIMORI_BASE_URL = 'https://shikimori.one/api';
const KODIK_BASE_URL = 'https://kodik-api.com';
const KODIK_TOKEN = '1a181b998ddb87ae564c7c31afca5df4';

async function debug() {
    const order = 'ranked';
    const url = new URL(`${SHIKIMORI_BASE_URL}/animes`);
    url.searchParams.append('limit', '20');
    url.searchParams.append('order', order);
    url.searchParams.append('status', 'ongoing,released');

    console.log(`Fetching Shikimori: ${url.toString()}`);
    const res = await fetch(url.toString(), {
        headers: { 'User-Agent': 'AniVaultApp/1.0' }
    });

    if (!res.ok) {
        console.error(`Shikimori error: ${res.status}`);
        return;
    }

    const rawAnimes = await res.json();
    console.log(`Shikimori returned ${rawAnimes.length} items`);

    if (rawAnimes.length > 0) {
        const ids = rawAnimes.map(a => a.id);
        console.log(`IDs: ${ids.join(',')}`);

        const kodikUrl = new URL(`${KODIK_BASE_URL}/search`);
        kodikUrl.searchParams.append('token', KODIK_TOKEN);
        kodikUrl.searchParams.append('shikimori_id', ids.join(','));

        console.log(`Fetching Kodik: ${kodikUrl.toString()}`);
        const kRes = await fetch(kodikUrl.toString());
        const kData = await kRes.json();

        console.log(`Kodik returned ${kData.results ? kData.results.length : 0} results`);
        const availableIds = new Set(kData.results?.map(r => String(r.shikimori_id)) || []);
        console.log(`Available IDs on Kodik: ${Array.from(availableIds).join(',')}`);

        const filtered = rawAnimes.filter(a => availableIds.has(String(a.id)));
        console.log(`Filtered count: ${filtered.length}`);
    }
}

debug();
