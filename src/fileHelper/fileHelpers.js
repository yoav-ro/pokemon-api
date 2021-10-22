const fs = require('fs');
const path = require('path');
const webpack = require('../constants/webpack');

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

function deletePokemon(username, pokemonId) {
  const pokePath = path.resolve(getUserPath(username), `${pokemonId}.json`);
  fs.unlinkSync(pokePath);
}

function getAllPokemon(username) {
  const pokePath = getUserPath(username);
  const pokemon = [];
  const files = fs.readdirSync(pokePath);
  files.forEach((pokemonJSON) => {
    const jsonPath = path.resolve(pokePath, pokemonJSON);
    pokemon.push(getObjectFromJSON(jsonPath));
  });
  return pokemon;
}

function getObjectFromJSON(path) {
  const data = fs.readFileSync(path, 'utf8');
  return JSON.parse(data);
}

function getUserPath(username) {
  if (webpack) return path.resolve(__dirname, `./users/${username}/`);
  else return path.resolve(__dirname, `../users/${username}/`);
}

function createUsersDir() {
  let dir;
  if (webpack) dir = path.resolve(__dirname, `./users`);
  else dir = path.resolve(__dirname, `../users`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

module.exports = {
  createUserFile,
  userExists,
  pokemonExists,
  savePokemon,
  deletePokemon,
  getAllPokemon,
  createUsersDir,
};
