const express = require('express');
const app = express();
const PORT = 3000;
const {client} = require('./connectToDb.js');

app.get('/', (req, res) => {
  console.log('User has landed!');
  res.send('hi');
})

app.listen(PORT, () => {
  console.log(`Server up, listening to port ${PORT}`);
});