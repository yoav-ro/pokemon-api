const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const pokemonRouter = require('./routers/pokemonRouter')
const server = express();
const port = 8080;

server.use("/pokemon", pokemonRouter); //Pokemon router

// start the server
server.listen(port, function() {
  console.log(`Server Listening on port ${port}`);
});

