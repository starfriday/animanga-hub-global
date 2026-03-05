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

fetch('https://shikimori.one/api/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AniVaultApp'
    },
    body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data.data.animes[0].characterRoles.slice(0, 2), null, 2)))
.catch(err => console.error(err));
