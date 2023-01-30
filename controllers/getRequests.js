// I am assuming that we will pass the database from the server to these
//   controllers, since they will be the same for the questions and
//   answers folder.
let format = require('pg-format');

let getQuestions = (db, productId, page, count = 5) => {
  let query = 'SELECT q.question_id, q.body, q.date, q.helpfulness, q.reported, u.name \
FROM questions q INNER JOIN users u ON u.user_id = q.user_id \
WHERE q.product_id = $1 LIMIT $2';

  return db.query(query, [productId, count])
    .then(result => (result.rows))
    .then(result => {
      let answersQuery = 'SELECT a.answer_id, a.body, a.date, a.helpfulness, u.name, p.url, a.question_id \
FROM answers a \
INNER JOIN users u ON u.user_id = a.user_id \
INNER JOIN photos p ON p.answer_id = a.answer_id \
WHERE a.question_id IN (%s)';

      let resultArray = result.map(val => (val.question_id));

      return Promise.all([result, db.query(format(answersQuery, resultArray.join(',')))]);
    })
    .then(results => {
      // console.log(results[1].rows);
      // console.log(results[0])

      let product_answer = {};

      results[1].rows.map((val, idx) => {
        if (product_answer[val.question_id] === undefined) {
          product_answer[val.question_id] = [idx];
        } else {
          product_answer[val.question_id].push(idx);
        }
      });

      let foundQuestions = Object.keys(product_answer);

      let thisThing = JSON.parse(JSON.stringify(results[0]));

      console.log(foundQuestions);
      for (let i = 0; i < thisThing.length; i++) {
        let question_id = thisThing[i]['question_id'];
        thisThing[i].answers = {};
        if (foundQuestions.includes(question_id.toString())) {
          console.log('here')
          let answerIdx = product_answer[question_id.toString()];
          thisThing[i]['answers'] = results[1].rows[answerIdx[0]];
        }
      }
      return thisThing;
    })
    .catch(err => {
      console.log(err);
      return err})

};

let getAnswers = (db, questionId, page, count = 5) => {
  let query = 'SELECT * FROM answers a INNER JOIN users u \
ON u.user_id = a.user_id and a.question_id = $1 ORDER BY \
helpfulness DESC limit $2';

  return db.query(query, [questionId, count])
    .then(result => (result.rows))
    .catch(err => (err));
}

module.exports = {
  getQuestions: getQuestions,
  getAnswers: getAnswers
}