const KODIK_BASE_URL = 'https://kodikapi.com';
const KODIK_TOKEN = '1a181b998ddb87ae564c7c31afca5df4';

async function testList() {
    const ids = ['5114', '9253']; // FMAB, Steins;Gate
    const url = new URL(`${KODIK_BASE_URL}/list`);
    url.searchParams.append('token', KODIK_TOKEN);
    url.searchParams.append('shikimori_id', ids.join(','));

    console.log(`Fetching Kodik (/list): ${url.toString()}`);
    const res = await fetch(url.toString());
    const data = await res.json();
    console.log(`Total Results: ${data.total}`);
    if (data.results) {
        console.log(`Results IDs: ${data.results.map(r => r.shikimori_id).join(',')}`);
    } else {
        console.log('No results field in response');
    }
}

testList();
