const errorCodes = require('../constants/errorCodes');
const fileHelpers = require('../fileHelper/fileHelpers');

function userHandler(request, response, next) {
  let username = request.headers.username;
  //If username header is missing throw error
  if (!username) throw new Error(errorCodes.usernameHeaderMissing);
  if (!fileHelpers.userExists(username)) fileHelpers.createUserFile(username);
  next();
}

module.exports = userHandler;
