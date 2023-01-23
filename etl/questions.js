const fs = require('fs');
const {parse} = require('csv-parse');
const {client} = require('../server/connectToDb.js');


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
  let startTime = Date.now();
  let endTime;
  let text, dateStart, dateEnd;
  let findUser = (name, email) => {
    text = `SELECT * FROM users WHERE name=$1 and email =$2`;
    return client.query(text, [name, email])
      .then(res => {
        // console.log(res);
        return res.rows[0].user_id;
      })
      .catch(err => {
        return err;
      });
  }
  let counter = 1;
  let newObj = fs.createWriteStream('../input_data/question_transform.csv');

  // question_id SERIAL PRIMARY KEY,
  // product_id VARCHAR(7) NOT NULL,
  // body VARCHAR(1000) NOT NULL,
  // date DATE NOT NULL,
  // helpfulness SMALLINT NOT NULL,
  // reported BIT(1) NOT NULL,
  // user_id SMALLINT NOT NULL,

  newObj.write('question_id,product_id,body,date,helpfulness,reported,user_id\n');
  let stream = fs.createReadStream('../input_data/questions.csv')
  .pipe(parse({delimiter: ','}))
  .on('error', (err) => {
    console.log(`There was an error: `, err);
  })
  .on('data', async (row) => {
    // id,product_id,body,date_written,asker_name,asker_email,reported,helpful
    console.log('row data: ', row);
    dateStart = Date.now()
    stream.pause();
    let userId = await findUser(row[4], row[5]);
    console.log(userId);
    newObj.write(`${row[0]},${row[1]},${row[2]},${row[3]},${row[7]},${row[6]},${userId}`)
    counter++;
    stream.resume();
    dateEnd = Date.now()
    console.log(`The process has taken: ${dateEnd - dateStart} ms`);
  })
  .on('end', () => {
    endTime = Date.now();
    console.log(`Finished. Took ${endTime - startTime} ms`);
    return
  })