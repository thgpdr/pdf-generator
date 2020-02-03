const app = require('./app');

const port = 3005;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
