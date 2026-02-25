
export const getAllPokemon = () => {
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Fetch failed. ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {

            const formattedPokemon = data.results.map((pokemon) => {
                const urlParts = pokemon.url.split("/");
                const id = urlParts[urlParts.length - 2];

                return {
                    name: pokemon.name,
                    id: id
                };
            });

            return { data: formattedPokemon, error: null };
        })
        .catch((error) => {
            return { data: null, error };
        });
};



function renderSingleItem(pokemon) {
    console.log('render single item')
    const container = document.getElementById("single-item-container");

    container.innerHTML = "";

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = ""; // Add space

    const h2 = document.createElement('h2');
    h2.textContent = pokemon.name;

    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    img.alt = `${pokemon.name}`;

    const heightP = document.createElement('p');
    heightP.textContent = "Height: " + pokemon.height

    const weightP = document.createElement('p');
    weightP.textContent = "Weight: " + pokemon.weight

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(heightP);
    card.appendChild(weightP);

    container.appendChild(card);
}

function renderPokemonList(pokemonArray) {
    const pokemonList = document.querySelector("#pokemon-list");
    pokemonList.innerHTML = "";

    pokemonArray.forEach((pokemon) => {
        const li = document.createElement("li");
        li.classList.add("pokemon-item");
        li.dataset.id = pokemon.id;

        // Text that helps identify the item
        const label = document.createElement("span");
        label.textContent = `#${pokemon.id} - ${pokemon.name}`;

        // Favorite toggle button
        const favBtn = document.createElement("button");
        favBtn.type = "button";
        favBtn.classList.add("fav-btn");
        favBtn.dataset.id = pokemon.id;

        // Show filled star if favorite
        const fav = isFavorite(pokemon.id);
        favBtn.textContent = fav ? "⭐" : "☆";
        favBtn.setAttribute(
            "aria-label",
            fav ? "Remove from favorites" : "Add to favorites"
        );

        li.appendChild(label);
        li.appendChild(favBtn);

        pokemonList.appendChild(li);
    });
}

const pokemonList = document.querySelector("#pokemon-list");

pokemonList?.addEventListener("click", async (event) => {
    // If the star button was clicked, toggle favorite
    const favBtn = event.target.closest(".fav-btn");
    if (favBtn) {
        event.stopPropagation();

        const id = favBtn.dataset.id;
        toggleFavorite(id);

        const fav = isFavorite(id);
        favBtn.textContent = fav ? "⭐" : "☆";
        favBtn.setAttribute(
            "aria-label",
            fav ? "Remove from favorites" : "Add to favorites"
        );

        return;
    }

    // Otherwise, treat as a normal list item click -> fetch details
    const clickedItem = event.target.closest(".pokemon-item");
    if (!clickedItem) return;

    const id = clickedItem.dataset.id;

    const result = await getPokemonById(id);

    if (result.error) {
        console.warn(result.error);
        return;
    }

    renderSingleItem(result.data);
});

const form = document.getElementById("pokemon-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("pokemon-name");
    const levelInput = document.getElementById("pokemon-level");

    const name = nameInput.value;
    const level = levelInput.value;

    const formData = {
        name,
        level,
    };

    console.log(formData); // For now, just log it

    form.reset(); //Clear the form
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const result = await getAllPokemon();

        if (!result || !result.data) {
            console.warn("No Pokémon data returned");
            return;
        }

        if (result.error) {
            console.warn(result.error);
            return;
        }

        renderPokemonList(result.data);
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
    }
});
