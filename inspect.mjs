const query = `
query {
  __type(name: "PersonRole") {
    fields {
      name
      type {
        name
        kind
        ofType {
          name
          kind
        }
      }
    }
  }
}`;

fetch('https://shikimori.one/api/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AniVaultApp'
    },
    body: JSON.stringify({ query })
})
    .then(r => r.json())
    .then(d => console.log(JSON.stringify(d, null, 2)))
    .catch(console.error);
