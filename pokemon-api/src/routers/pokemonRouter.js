const express = require('express');
const Pokedex = require('pokedex-promise-v2');
const errorCodes = require('../constants/errorCodes');

const router = express.Router();
const P = new Pokedex();


router.get('/get/:id', async (request, response, next) => {
  try {
    const pokemonID = request.params.id;
    const pokemonData = await getPokemonData(pokemonID);
    response.json(pokemonData);
  } catch (error) {
    console.log("Couldnt get pokemon by id");
    console.log(errorCodes.pokemonIdNotFound);
    throwCallbackError(errorCodes.pokemonIdNotFound, next)
  }
});

router.get('/query', async (request, response, next) => {
  try {
    const pokemonName = request.query.query;
    const pokemonData = await getPokemonData(pokemonName);
    response.json(pokemonData);
  } catch (error) {
    console.log("Couldn't get pokemon by name");
    throwCallbackError(errorCodes.pokemonNameNotFound, next)
  }
});

async function getPokemonData(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const pokemonRawData = await P.getPokemonByName(query);
      const pokemonData = {
        name: pokemonRawData.name,
        height: pokemonRawData.height,
        weight: pokemonRawData.weight,
        types: getTypes(pokemonRawData.types),
        front_pic: pokemonRawData.sprites['front_default'],
        back_pic: pokemonRawData.sprites['back_default'],
        abilities: getAbilities(pokemonRawData.abilities),
      };
      resolve(pokemonData);
    } catch (error) {
      reject(error);
    }
  });
}

function getTypes(types) {
  const newTypes = [];
  types.forEach((type) => {
    newTypes.push(type.type.name);
  });
  return newTypes;
}

function getAbilities(abilities){
    const newAbilities = [];
    abilities.forEach(abil => {
        newAbilities.push(abil.ability.name);
    })
    return newAbilities;
}

//Throw callback error so it can be caught by express
function throwCallbackError(error, next){
    try{
        throw new Error(error);
    }catch(err){
        next(err);
    }
}

module.exports = router;
