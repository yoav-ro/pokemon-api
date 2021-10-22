const express = require('express');
const cors = require('cors');
const pokemonRouter = require('./routers/pokemonRouter');
const errorHandler = require('./middleware/errorHandler');
const userHandler = require('./middleware/userHandler');
const server = express();
const port = 8080;

server.use(cors());
server.use(express.json());
server.use(userHandler);
server.use('/pokemon', pokemonRouter); //Pokemon router

server.use(errorHandler);
// start the server
server.listen(port, function () {
  console.log(`Server Listening on port ${port}`);
});
