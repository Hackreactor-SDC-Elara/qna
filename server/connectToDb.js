const {Client} = require('pg');
const client = new Client ({
  database: 'test'
});

client.connect(err => {
  if (err) {
    console.log(`There was an error when trying to connect with the db ${err}`);
  } else {
    return client;
  }
})

module.exports = {
  client: client
}