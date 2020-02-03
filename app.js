const express = require('express');
const cors = require('cors');

const routes = require('./routes');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.router();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  router() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
