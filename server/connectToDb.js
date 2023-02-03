const {Pool} = require('pg');

const client = new Pool({
  database: 'sdc'
})

module.exports = {
  client: client
}