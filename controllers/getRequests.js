// I am assuming that we will pass the database from the server to these
//   controllers, since they will be the same for the questions and
//   answers folder.

let getQuestions = (db, productId, page, count = 5) => {
  let query = 'SELECT * FROM questions q INNER JOIN users u \
ON u.user_id = q.user_id and q.product_id = $1 ORDER BY \
helpfulness DESC limit $2'

  return db.query(query, [productId, count])
    .then(result => (result.rows))
    .catch(err => (err))
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