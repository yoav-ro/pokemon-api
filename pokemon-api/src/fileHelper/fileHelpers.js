const fs = require('fs');
const path = require('path');
const webpack = false;

function userExists(username) {
  try {
    let userPath = getUserPath(username);
    return fs.existsSync(userPath);
  } catch (e) {
    console.log(e);
    return false;
  }
}

function createUserFile(username) {
  let userPath = getUserPath(username);
  fs.mkdirSync(userPath);
}

function pokemonExists(username, pokemonId) {
  const userPath = getUserPath(username);
  return fs.existsSync(path.resolve(userPath, `${pokemonId}.json`));
}

function savePokemon(username, pokemonId, pokemonObject) {
  const pokePath = path.resolve(getUserPath(username), `${pokemonId}.json`);
  fs.writeFile(pokePath, JSON.stringify(pokemonObject), function (err) {});
}

function getUserPath(username) {
  if (webpack) return path.resolve(__dirname, `./users/${username}/`);
  else return path.resolve(__dirname, `../users/${username}/`);
}

module.exports = { createUserFile, userExists, pokemonExists, savePokemon };
