let format = require('pg-format');

let getQuestionsFromDB = (db, productId, page, count) => {
  return new Promise ((resolve, reject) => {

//     let query = 'SELECT q.question_id, q.body as question_body, q.date, q.helpfulness as question_helpfulness, q.reported, u.name as asker_name \
// FROM questions q INNER JOIN users u ON u.user_id = q.user_id \
// WHERE q.product_id in ($1) ORDER BY helpfulness DESC LIMIT $2';

// let query = "SELECT q.question_id, q.body as question_body, q.date as question_date, q.helpfulness as question_helpfulness, q.reported, \
// (SELECT u.name FROM users u WHERE u.user_id = q.user_id), \
// json_AGG(JSON_BUILD_OBJECT('id', a.answer_id, 'body', a.body, 'date', a.date, 'answerer_name', (SELECT u.name FROM users u WHERE u.user_id = a.user_id), 'helpfulness', a.helpfulness)) \
// as answers \
// FROM questions q \
// INNER JOIN answers a ON a.question_id = q.question_id \
// WHERE q.product_id IN ($1) \
// GROUP BY q.question_id \
// ORDER BY q.helpfulness \
// DESC LIMIT $2";
console.log(count)
let query = "SELECT q.question_id, q.body as question_body, q.date as question_date, q.helpfulness as question_helpfulness, q.reported, \
(SELECT u.name FROM users u WHERE u.user_id = q.user_id), \
json_AGG(JSON_BUILD_OBJECT('id', a.answer_id, 'body', a.body, 'date', a.date, 'answerer_name', (SELECT u.name FROM users u WHERE u.user_id = a.user_id), 'helpfulness', a.helpfulness, 'photos', JSON_BUILD_OBJECT('url', p.url))) \
as answers \
FROM questions q \
INNER JOIN answers a ON a.question_id = q.question_id \
INNER JOIN photos p ON p.answer_id = a.answer_id \
WHERE q.product_id IN ($1) \
GROUP BY q.question_id \
ORDER BY q.helpfulness DESC \
LIMIT $2";
    db.query(query, [productId, count])
      .then(result => {
        resolve(result.rows);
      })
      .catch(err=> {
        reject(err);
      })
  })
};

let getAnswersFromDB = (db, questions) => {
  let answersQuery = 'SELECT a.answer_id, a.body, a.date, a.helpfulness, u.name, a.question_id \
FROM answers a \
INNER JOIN users u ON u.user_id = a.user_id \
WHERE a.question_id IN (%s)';

  let resultArray = questions.map(val => (val.question_id));

  return new Promise((resolve, reject) => {
    db.query(format(answersQuery, resultArray.join(',')))
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        reject(err);
      })
  })
};

let getPhotosFromDB = (db, answers) => {
  return new Promise ((resolve, reject) => {
    let photosQuery = 'SELECT p.url, p.answer_id FROM photos p WHERE p.answer_id IN (%s)';
    let answersArray = answers.map(val => (val)).join(',');
    db.query(format(photosQuery, answersArray))
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        reject(err);
      });
  })
};

let getAnswersFromDBAnswersRequest = (db, questionId, page, count) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT a.answer_id, u.name, a.body, a.date, a.helpfulness \
  FROM answers a \
  INNER JOIN users u \
  ON u.user_id = a.user_id and a.question_id in ($1) \
  ORDER BY helpfulness DESC limit $2';
    db.query(query, [questionId, count])
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        resolve(err);
      })
  })
}

let getPhotosFromDBAnswersRequest = (db, answerIds) => {
  return new Promise ((resolve, reject) => {
    let photosQuery = 'SELECT p.url, p.photo_id, p.answer_id \
    FROM photos p \
    WHERE p.answer_id IN (%s)';
    let answerIdsArr = answerIds.map(val => (val.answer_id));

    db.query(format(photosQuery, answerIdsArr))
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      })
  })
}

module.exports = {
  getQuestionsFromDB: getQuestionsFromDB,
  getAnswersFromDB: getAnswersFromDB,
  getPhotosFromDB: getPhotosFromDB,
  getAnswersFromDBAnswersRequest: getAnswersFromDBAnswersRequest,
  getPhotosFromDBAnswersRequest: getPhotosFromDBAnswersRequest
}