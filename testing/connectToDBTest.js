const {Pool} = require('pg');

const client = new Pool({
  database: 'test'
})

module.exports = {
  client: client
}