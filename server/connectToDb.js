const {Client} = require('pg');

const client = new Client ({
  user: '',
  host: 'localhost',
  database: 'sdc',
  password: '',
  port: 5432
});

client.connect((err) => {
  if (err) {
    console.log(`There was an error when trying to connect to the database ${err}`);
  } else {
    console.log('Successfully connected to the database');
    client.query('SELECT * FROM questions')
      .then(data => {
        console.log('Yo, here is some data!', data);
      })
  }
});

module.export = client