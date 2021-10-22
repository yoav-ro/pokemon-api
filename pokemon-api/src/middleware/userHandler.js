const fs = require('fs');
const path = require('path');
const errorCodes = require('../constants/errorCodes');
const webpack = false;

function userHandler(request, response, next) {
  let username = request.headers.username;
  //If username header is missing throw error
  if (!username) throw new Error(errorCodes.usernameHeaderMissing);
  username = formatUsername(username);
  if (!userExists(username)) createUserFile(username);
  next();
}

function formatUsername(username) {
  username = username.replace(' ', '-');
  username = username.replace('/', '');
  username = username.replace('\\', '');
  return username;
}

function userExists(username) {
  try {
    let userPath;
    if (webpack) userPath = path.resolve(__dirname, `./users/${username}/`);
    else userPath = path.resolve(__dirname, `../users/${username}/`);
    return fs.existsSync(userPath);
  } catch (e) {
    console.log(e);
    return false;
  }
}

function createUserFile(username) {
  let userPath;
  if (webpack) userPath = path.resolve(__dirname, `./users/${username}/`);
  else userPath = path.resolve(__dirname, `../users/${username}/`);
  fs.mkdirSync(userPath);
}

module.exports = userHandler;
