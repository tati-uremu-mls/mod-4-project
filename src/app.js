function renderSingleItem(pokemon) {
    const container = document.getElementById("single-item-container");

    container.innerHTML = "";

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = "";

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