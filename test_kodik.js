fetch('https://kodikapi.com/search?token=1a181b998ddb87ae564c7c31afca5df4&shikimori_id=52991')
    .then(res => res.json())
    .then(data => {
        if (data.results) {
            console.log("Found", data.results.length, "results");
            console.log("Translations:");
            data.results.forEach(r => console.log(r.translation));
        } else {
            console.log("No results", data);
        }
    })
    .catch(console.error);
