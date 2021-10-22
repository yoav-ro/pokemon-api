const errorCodes = require("../constants/errorCodes");

function errorHandler(err, request, response, next) {
    switch (err.message){
        case errorCodes.pokemonIdNotFound:
            response.status(404).json({ message: "Pokemon not found by id"});
            break;
        case errorCodes.pokemonNameNotFound:
            response.status(404).json({ message: "Pokemon not found by name"});
            break;
        default:
            response.status(500).json({ message: "An internal server error has occured"});
    }
    
}

module.exports = errorHandler;