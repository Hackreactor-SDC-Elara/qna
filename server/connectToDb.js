const {Client} = require('pg');
require('dotenv');

const client = new Client ({
  database: 'sdc'
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