const query = `
query IntrospectionQuery {
  __type(name: "CharacterRole") {
    name
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
}
`;

fetch('https://shikimori.one/api/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AniVaultApp'
    },
    body: JSON.stringify({ query })
})
    .then(res => res.json())
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(console.error);
