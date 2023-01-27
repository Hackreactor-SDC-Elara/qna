// Example question post requres-
// INSERT INTO questions VALUES (DEFAULT,
// 71705,
// 'This is an attempt for my first insert question',
// 0,
// B'0',
// 1,
// 1674669353);

let postQuestion = (db, body, name, email, productId) => {
  // We will need to get the userID - this is where 205 currently is
  let insertUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, $2);';

  return db.query(insertUserQuery, [name, email])
    .then(results => {
      return results;
    })
    .catch(err => (err))
    .then(() => {
      let postQuestionQuery = 'INSERT INTO questions (question_id, product_id, body, date, helpfulness, reported, user_id) \
VALUES (DEFAULT, $1, $2, $5, 0, B\'0\', (SELECT user_id FROM users WHERE name = $3 and email = $4)) RETURNING question_id;';
      let currDate = new Date();
      return db.query(postQuestionQuery, [productId, body, name, email, Math.round(currDate.getTime() / 1000)])
        .then(results => (results))
        .catch(err => (err));
    });
}

let postAnswer = (db, questionId, body, name, email, photos) => {
  let insertUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, $2);';

  return db.query(insertUserQuery, [name, email])
    .then(results => {
      return results;
    })
    .catch(err => (err))
    .then(() => {
      let answerBody = 'INSERT INTO answers (answer_id, question_id, body, date, user_id, helpfulness, reported)\
VALUES (DEFAULT, $1, $2, $5, (SELECT user_id FROM users WHERE name=$3 and email=$4), 0, B\'0\') RETURNING answer_id';

      let currDate = new Date();
      return db.query(answerBody, [questionId, body, name, email, Math.round(currDate.getTime() / 1000)])
    })
    .then(results => {
      return results;
    })
    .catch(err => {
      console.log(err);
      return err;
    })
}
module.exports = {
  postQuestion: postQuestion,
  postAnswer: postAnswer
}