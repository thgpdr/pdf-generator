const { Router } = require('express');

const getPDF = require('./getPdf');

const routes = new Router();

routes.get('/pdf', (req, res) => {
  getPDF().then(pdf => {
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
    res.send(pdf);
  })

  
  // res.json({ message: 'hello'});
})

module.exports = routes;