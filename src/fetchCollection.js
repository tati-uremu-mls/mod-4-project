const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export const getAllPokemon = async ({ limit = 1000, offset = 20 } = {}) => {
    try {
        const response = await fetch(`${BASE_URL}?offset=${offset}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data = await response.json();

        const formattedPokemon = data.results.map((pokemon) => {
            const id = pokemon.url.split("/").filter(Boolean).pop();
            return { name: pokemon.name, id };
        });

        return { data: formattedPokemon, error: null };
    } catch (error) {
        console.warn("Error fetching Pokémon list:", error);
        return { data: null, error };
    }
};


// fetch all pokemon within array from the url