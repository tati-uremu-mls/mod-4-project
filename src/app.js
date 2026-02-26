import "./style.css";
import { getAllPokemon, getPokemonById } from "./api.js";

let allPokemonData = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ---------------------------
// RENDER A SINGLE POKEMON DETAILS
// ---------------------------
function renderSingleItem(pokemon) {
    const container = document.getElementById("single-item-container");
    container.innerHTML = "";

    const li = document.createElement("li");
    li.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = pokemon.name;

    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;

    const heightP = document.createElement("p");
    heightP.textContent = `Height: ${pokemon.height}`;

    const weightP = document.createElement("p");
    weightP.textContent = `Weight: ${pokemon.weight}`;

    li.append(h2, img, heightP, weightP);
    container.appendChild(li);
}

// ---------------------------
// RENDER POKEMON LIST
// ---------------------------
export const renderPokemonList = (pokemonArray) => {
    const pokemonList = document.getElementById("pokemon-list");
    pokemonList.innerHTML = "";

    pokemonArray.forEach((pokemon) => {
        const li = document.createElement("li");
        li.classList.add("pokemon-item");
        li.dataset.id = pokemon.id;

        const imageDiv = document.createElement("div");
        imageDiv.classList.add("card-image");

        const img = document.createElement("img");
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
        img.alt = pokemon.name;

        imageDiv.appendChild(img);

        const name = document.createElement("h3");
        name.textContent = pokemon.name;

        // ⭐ Favorite button
        const favBtn = document.createElement("button");
        favBtn.textContent = "⭐";
        favBtn.classList.add("fav-btn");
        favBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent opening details
            if (!favorites.find(p => p.id === pokemon.id)) {
                favorites.push(pokemon);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                renderFavorites(); // immediate UI update
            }
            if (favorites.find(p => p.id === pokemon.id)) {
                favBtn.style.opacity = "0.5";
            }
        });

        li.append(imageDiv, name, favBtn);
        pokemonList.appendChild(li);
    });
}

// ---------------------------
// FAVORITES LOGIC
// ---------------------------
const viewFavoritesBtn = document.getElementById("view-favorites-btn");
const backToPokedexBtn = document.getElementById("back-to-pokedex-btn");
const favoritesSection = document.getElementById("favorites-section");
const mainPokedexSection = document.getElementById("all-pokemon-section");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesDetailEl = document.getElementById("favorites-detail");

function renderFavorites() {
    favoritesListEl.innerHTML = "";
    favorites.forEach((pokemon) => {
        const li = document.createElement("li");
        li.innerHTML = `
  <div style="display:flex; align-items:center; gap:10px;">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" width="40" />
    <span>${pokemon.name}</span>
  </div>
`;
        li.addEventListener("click", async () => {
            const result = await getPokemonById(pokemon.id);
            if (result.error) return console.warn(result.error);
            showFavoriteDetail(result.data);
        });
        favoritesListEl.appendChild(li);
    });
}

function showFavoriteDetail(pokemon) {
    favoritesDetailEl.innerHTML = `
        <h2>${pokemon.name}</h2>
        <p>ID: ${pokemon.id}</p>
        <p>Level: ${pokemon.level || "N/A"}</p>
         <img src="${pokemon.sprites.other["official-artwork"].front_default}" width="200"/>
    <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
    `;
}

// ---------------------------
// VIEW TOGGLE
// ---------------------------
viewFavoritesBtn.addEventListener("click", () => {
    mainPokedexSection.style.display = "none";
    favoritesSection.style.display = "grid";
    viewFavoritesBtn.style.display = "none";
    backToPokedexBtn.style.display = "inline-block";
    renderFavorites();
});

backToPokedexBtn.addEventListener("click", () => {
    favoritesSection.style.display = "none";
    mainPokedexSection.style.display = "block";
    viewFavoritesBtn.style.display = "inline-block";
    backToPokedexBtn.style.display = "none";
});

// ---------------------------
// DOM CONTENT LOADED
// ---------------------------
document.addEventListener("DOMContentLoaded", async () => {
    const pokemonList = document.getElementById("pokemon-list");
    const searchInput = document.getElementById("pokemon-search");

    // Click Event (Event Delegation)
    pokemonList.addEventListener("click", async (event) => {
        const clickedItem = event.target.closest(".pokemon-item");
        if (!clickedItem) return;

        const id = clickedItem.dataset.id;
        const result = await getPokemonById(id);
        if (result.error) return console.warn(result.error);

        renderSingleItem(result.data);
    });

    // Fetch All Pokémon

    async function init() {
        try {
            const result = await getAllPokemon();

            if (result.error) {
                console.warn(result.error);
                return;
            }

            allPokemonData = result.data;
            renderPokemonList(allPokemonData); // THIS MUST RUN
        } catch (error) {
            console.error("Error fetching Pokémon:", error);
        }
    }

    init();

    // Live Search
    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        const filteredPokemon = allPokemonData.filter(p =>
            p.name.toLowerCase().includes(query)
        );
        renderPokemonList(filteredPokemon);
    });
});

