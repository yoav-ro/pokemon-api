const express = require('express');
const cors = require('cors');
const pokemonRouter = require('./routers/pokemonRouter');
const userRouter = require('.//routers/userRouter');
const errorHandler = require('./middleware/errorHandler');
const userHandler = require('./middleware/userHandler');
const fileHelper = require('./fileHelper/fileHelpers');
const server = express();
const port = 8080;

//Create users dir if it does not exist
fileHelper.createUsersDir();

server.use(cors());
server.use(express.json());
server.use(userHandler);
server.use('/pokemon', pokemonRouter); //Pokemon router
server.use('/info', userRouter);

server.use(errorHandler);
// start the server
server.listen(port, function () {
  console.log(`Server Listening on port ${port}`);
});
