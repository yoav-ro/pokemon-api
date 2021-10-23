let username;

function getPokemon(pokemonName) {
    if (username) {
        if (pokemonName === "") {
            alert("Invalid input! No pokemon searched!")
            throw "No pokemon searched"
        }
        if (!isNaN(pokemonName)) {
            alert(`Invalid input! ${pokemonName} is not a pokemon!`)
            throw "Cant search a number"
        }
        document.getElementById("nameInput").value = pokemonName;
        resetElements("types", "pokemonByType");
        document.getElementById("catchBtn").style.visibility = "visible"

        document.body.classList.add("searched")
        getPokemonFromAPI(pokemonName);
    }
    else {
        alert("You must enter a user name!")
        throw ("Username wasnt set")
    }
}

function setUser(userName) {
    if (userName) {
        username = userName;
        const userInfo = document.getElementById("userInfo");
        userInfo.style.visibility = "visible"
        const btn = document.createElement("button");
        btn.textContent = "Click";
        userInfo.textContent = `Welcome ${userName}! To see all your pokemon: `
        btn.addEventListener("click", () => { getPokemonByUser(userName) })
        userInfo.append(btn)
    }
    else {
        alert("You must enter a user name!")
        throw ("Username wasnt set")
    }
}

function getPokemonByUser(userName) {
    const response = axios.get("http://localhost:3000/pokemon/", {
        headers: {
            username: userName,
        }
    })
    buildPokemonByUser(response)
}

function buildPokemonByUser(pokemonPromise) {
    pokemonPromise.then((pokemonData) => {
        const list = document.getElementById("pokemonByUser");
        list.textContent = `${username}'s pokemon: `
        for (let i = 0; i < pokemonData.data.length; i++) {
            const pokemonLi = document.createElement("li");
            pokemonLi.textContent = pokemonData.data[i].name;
            const releaseBtn = document.createElement("button")
            releaseBtn.textContent = "Release pokemon"
            releaseBtn.addEventListener("click", () => { releasePokemon(pokemonData.data[i].name, username) })
            pokemonLi.addEventListener("click", () => { getPokemon(pokemonData.data[i].name) })
            list.append(pokemonLi);
            list.append(releaseBtn);
        }
    })
}

function releasePokemon(pokemon, userName) {
    const response = axios.delete(`http://localhost:3000/pokemon/release/${pokemon}`, {
        headers: {
            username: userName,
        }
    })
}

//
function getPokemonFromAPI(pokemonName) {
    const pokemonPromise = getPokemonByNameAxios(pokemonName);
    checkPromise(pokemonPromise, pokemonName);
}

//If the promise is fullfieled, proceeds to play media and build the elements. Else, throws an error 
function checkPromise(pokemonPromise, pokemonName) {
    pokemonPromise.then((pokemonObj) => {
        playMedia(pokemonName);
        return buildPokemonEls(pokemonObj);
    })
        .catch((err) => {
            const errStr = `Pokemon "${pokemonName}" not found!`
            alert(errStr)
            throw err + " | " + errStr;
        })
}

//Plays the audio
function playMedia(pokemonName) {
    document.getElementById("who").play();
    setTimeout(() => { getPokemonAudio(pokemonName) }, 3500)
}

//Gets data from PokeAPI using Axios
async function getPokemonByNameAxios(pokemonName) {
    const response = axios.get(`http://localhost:3000/pokemon/get/${pokemonName}`, {
        headers: {
            username: username,
        }
    })

    return response.then((value) => {
        return value.data;
    })
}

//Recieves an object containing the pokemon's data and fills the html page accordingly
function buildPokemonEls(pokemonObj) {
    document.getElementById("name").textContent = "ITS " + pokemonObj.name.toUpperCase() + "!";
    document.getElementById("weight").textContent = "Weight: " + pokemonObj.weight;
    document.getElementById("height").textContent = "Height: " + pokemonObj.height;
    document.getElementById("catchBtn").addEventListener("click", () => { catchPokemon(pokemonObj.name) })
    createTypesList(pokemonObj);
    const pokeImg = document.getElementById("image");
    pokeImg.src = pokemonObj.front_pic;
    pokeImg.addEventListener("mouseover", () => {
        pokeImg.src = pokemonObj.back_pic;
    })
    pokeImg.addEventListener("mouseout", () => {
        pokeImg.src = pokemonObj.front_pic;
    })
}

async function catchPokemon(pokemonName) {
    const response = await fetch(`http://localhost:3000/pokemon/catch/${pokemonName}`, {
        method: "PUT",
        headers: {
            username: username
        }
    })
}

//Creates a list of the the types of the given pokemon
function createTypesList(pokemonObj) {
    const typesArr = pokemonObj.types;
    const typesList = document.getElementById("types");
    for (let i = 0; i < typesArr.length; i++) {
        const typeLi = document.createElement("li");
        typeLi.textContent = typesArr[i];
        typesList.append(typeLi)
    }
}

//Gets all the pokemons belonging to the given type usiong Axios
async function getPokemonByTypeAxios(typeUrl) {
    const response = axios.get(typeUrl);
    response.then((value) => {
        return pokemonByType(value.data.pokemon);
    })
}

//Builds a lists containing all the pokemon of a given type
function pokemonByType(typesObj) {
    const list = document.getElementById("pokemonByType");
    for (let i = 0; i < typesObj.length; i++) {
        const pokemonLi = document.createElement("li");
        pokemonLi.textContent = typesObj[i].pokemon.name;
        pokemonLi.addEventListener("click", () => { getPokemon(typesObj[i].pokemon.name) })
        list.append(pokemonLi)
    }
}

//Removes all child elements from all the given elements
function resetElements(...elementToReset) {
    for (el of elementToReset) {
        document.getElementById(`${el}`).innerHTML = "";
    }
}

//Plays the given text using text to speach
async function getPokemonAudio(pokemonName) {
    const toSpeak = new SpeechSynthesisUtterance("it is" + pokemonName);
    const voices = speechSynthesis.getVoices();
    toSpeak.voice = voices[1];
    speechSynthesis.speak(toSpeak);
}