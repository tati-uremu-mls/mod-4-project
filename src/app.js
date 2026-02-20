import { getAllPokemon, getPokemonById } from "./api.js";
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
        li.textContent = `#${pokemon.id} - ${pokemon.name}`;

        pokemonList.appendChild(li);
    });
}

const pokemonList = document.querySelector("#pokemon-list");

pokemonList.addEventListener("click", async (event) => {
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

<<<<<<< HEAD
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
=======
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const result = await getAllPokemon();

        if (result.error) {
            console.warn(result.error);
            return;
        }

        renderPokemonList(result.data);
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
    }
});
>>>>>>> main
