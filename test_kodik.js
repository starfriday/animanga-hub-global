const KODIK_BASE_URL = 'https://kodikapi.com';
const KODIK_TOKEN = '1a181b998ddb87ae564c7c31afca5df4';

async function testBulk() {
    const ids = ['5114', '9253']; // FMAB, Steins;Gate
    const url = new URL(`${KODIK_BASE_URL}/search`);
    url.searchParams.append('token', KODIK_TOKEN);
    url.searchParams.append('shikimori_id', ids.join(','));

    console.log(`Fetching Kodik (Bulk): ${url.toString()}`);
    const res = await fetch(url.toString());
    const data = await res.json();
    console.log(`Response:`, JSON.stringify(data, null, 2));
}

testBulk();
