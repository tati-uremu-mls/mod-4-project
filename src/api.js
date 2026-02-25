const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export const getAllPokemon = async () => {
    try {
        const response = await fetch(`${BASE_URL}?limit=1000`);

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data = await response.json();

        const formattedPokemon = data.results.map((pokemon) => {
            const id = pokemon.url.split("/").filter(Boolean).pop();

            return {
                name: pokemon.name,
                id,
            };
        });

        return { data: formattedPokemon, error: null };

    } catch (error) {
        console.warn("Error fetching Pokémon list:", error);
        return { data: null, error };
    }
};

export const getPokemonById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data = await response.json();

        return { data, error: null };

    } catch (error) {
        console.warn("Error fetching Pokémon details:", error);
        return { data: null, error };
    }
};