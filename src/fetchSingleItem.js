export const getPokemonById = async (id) => {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        if (!response.ok) {
            throw new Error(`Fetch failed. ${response.status}`);
        }
        const data = await response.json();

        return {
            data: {
                name: data.name,
                sprites: data.sprites
            },
            error: null
        };

    } catch (error) {
        console.warn("Error fetching Pokémon:", error);

        return {
            data: null,
            error
        };
    }
};
