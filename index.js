const winston = require('winston');
const express = require('express');
const app = express();

require('./statup/routes')(app);
require('./database/mongodb')();
require('./statup/config')();
require('./statup/logging')();
require('./statup/prod')(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {winston.info(`Listening port ${port}`)});

module.exports = server;