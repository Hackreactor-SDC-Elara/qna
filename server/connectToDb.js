const {Pool} = require('pg');

const client = new Pool({
  database: 'sdc',
  host: '3.16.161.168',
  port: '5432',
  password: 'password',
  user: 'justin8912'
})

module.exports = {
  client: client
}