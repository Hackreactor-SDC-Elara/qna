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

      return Promise.all([
        result,
        db.query(format(answersQuery, resultArray.join(',')))
      ]);
    })
    .then(results => {
      let photosQuery = 'SELECT p.url, p.answer_id FROM photos p WHERE p.answer_id IN (%s)';

      return Promise.all([
        results[0],
        results[1],
        db.query(
          format(photosQuery, results[1].rows.map(val => (val.answer_id)).join(','))
        )
      ]);
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
              // Transforming the answer object information
              obj.id = obj.answer_id;
              obj.answerer_name = obj.name;
              obj.date = new Date(parseInt(obj.date)).toISOString();
              obj.photos = [];
              results[2].rows.map(val => {
                if (val.answer_id === obj.id.toString()) {
                  obj.photos.push(val.url);
                }
              });

              // Deleting irrelevant key value pairs
              delete obj.answer_id;
              delete obj.name;
              delete obj.question_id;
            }

            // Transforming the question object to have the right shape
            transformObject(results[1].rows[answerIdx[j]]);

            // Assigning the answers object to the question object
            thisThing[i]['answers'][answerId] = results[1].rows[answerIdx[j]];
          }
        }
      }
      return thisThing;
    })
    .catch(err => (err));
};

let getAnswers = (db, questionId, page = 0, count = 5) => {
  let query = 'SELECT a.answer_id, u.name, a.body, a.date, a.helpfulness \
FROM answers a \
INNER JOIN users u \
ON u.user_id = a.user_id and a.question_id = $1 \
ORDER BY helpfulness DESC limit $2';

  return db.query(query, [questionId, count])
    .then(result => {
      let photosQuery = 'SELECT p.url, p.photo_id, p.answer_id \
FROM photos p \
WHERE p.answer_id IN (%s)';

      return Promise.all([
        result.rows,
        db.query(format(photosQuery, result.rows.map(val => (val.answer_id))))
      ]);
    })
    .then(results => {
      let answersIdx = results[0].map(val => {
        val.photos = [];
        return val.answer_id;
      });
      for (let i = 0; i < results[1].rows.length ; i++) {
        let answerId = results[1].rows[i].answer_id;
        let currentPhoto = results[1].rows[i];
        let currentAnswerIdx = answersIdx.indexOf(parseInt(answerId));
        console.log('currentPhoto: ', currentPhoto)
        currentPhoto.id = currentPhoto.photo_id;
        delete currentPhoto.answer_id;
        delete currentPhoto.photo_id;
        results[0][currentAnswerIdx]['photos'].push(currentPhoto);
      }
      console.log(results[0])
      return results[0];
    })
    .catch(err => {
      console.log(err)
      return err
    });
}

module.exports = {
  getQuestions: getQuestions,
  getAnswers: getAnswers
}