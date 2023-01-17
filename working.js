const fs = require('fs');
const {parse} = require('csv-parse');
const {client} = require('./server/connectToDb.js');


// For reference, here is the data from the csvs
  // Answers.csv: [id, question_id, body, date_written, user_name, user_email, reported, helpful]

  // Questions.csv: id, product_id, body, date, user, user_email, reported, helpful

  // answers_photos: id, answer_id, url
// And my database looks like this:
  // Questions: id, product_id, body, date, name_id, helpfulness, reported
  // users: id, name, email
  // answers: id, question_id, body, date, name_id, helpfulness, reported
  // photos: id, answer_id, url

// So I will need to grab user info from the answers and questions
  // create a user if they do not already exist, and append the
  // use id to the question.answer query
  // Everything else if very straight forward!

  let newObj = fs.createWriteStream('./input_data/myTest.csv');
  fs.createReadStream('./input_data/answers.csv')
  .on('error', (err) => {
    console.log(`There was an error: `, err);
  })
  .pipe(parse({delimiter: ','}))
  .on('data', (row) => {
    // console.log(row);
    client.query(`SELECT * FROM users WHERE name=${row[4]} and email=${row[5]}`)
      .then(result => {
        console.log('User has been or not been found: ', result);

      })
    newObj.write(row.join(',') + '\n', 'utf-8')
  })