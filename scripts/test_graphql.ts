import { getFullAnimeDetailsGQL } from './src/services/shikimori';

async function test() {
    const query = `{
        animes(ids: "16498", limit: 1) {
            characterRoles {
                id
                rolesRu
                rolesEn
                character { id name russian }
                persons { id name russian poster { originalUrl } }
            }
        }
    }`;

    const response = await fetch('https://shikimori.one/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'AniVaultApp'
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

test();
