let format = require('pg-format');

let getQuestionsFromDB = (db, productId, page, count) => {
  return new Promise ((resolve, reject) => {

    let query = 'SELECT q.question_id, q.body as question_body, q.date, q.helpfulness as question_helpfulness, q.reported, u.name as asker_name \
FROM questions q INNER JOIN users u ON u.user_id = q.user_id \
WHERE q.product_id in ($1) ORDER BY helpfulness DESC LIMIT $2';

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
  let answersQuery = 'SELECT a.body, a.answer_id, a.date, a.helpfulness, u.name, a.question_id \
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
    let answersArray = answers.map(val => (val.answer_id)).join(',');
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