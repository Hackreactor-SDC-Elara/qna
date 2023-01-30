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
      let answersQuery = 'SELECT a.answer_id, a.body, a.date, a.helpfulness, u.name, a.question_id \
FROM answers a \
INNER JOIN users u ON u.user_id = a.user_id \
WHERE a.question_id IN (%s)';

      let resultArray = result.map(val => (val.question_id));

      return Promise.all([result, db.query(format(answersQuery, resultArray.join(',')))]);
    })
    .then(results => {
      let photosQuery = 'SELECT p.url, p.answer_id FROM photos p WHERE p.answer_id IN (%s)';

      return Promise.all([results[0], results[1], db.query(format(photosQuery, results[1].rows.map(val => (val.answer_id)).join(',')))])
    })
    .then(results => {
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

      for (let i = 0; i < thisThing.length; i++) {
        let question_id = thisThing[i]['question_id'];
        thisThing[i].answers = {};
        if (foundQuestions.includes(question_id.toString())) {
          let answerIdx = product_answer[question_id.toString()];
          for (let j = 0 ; j < answerIdx.length; j++) {
            let answerId = results[1].rows[answerIdx[j]].answer_id;
            let transformObject = (obj) => {
              obj.id = obj.answer_id;
              obj.answerer_name = obj.name;
              obj.photos = [];
              obj.date = new Date(parseInt(obj.date)).toISOString();
              results[2].rows.map(val => {
                if (val.answer_id === obj.id.toString()) {
                  obj.photos.push(val.url);
                }
              });
              delete obj.answer_id;
              delete obj.name;
              delete obj.question_id;
            }
            transformObject(results[1].rows[answerIdx[j]])
            thisThing[i]['answers'][answerId] = results[1].rows[answerIdx[j]];
          }
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