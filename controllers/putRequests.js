let helpfulAnswer = (db, answer_id) => {
  let query = 'UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = $1';
  return db.query(query, [answer_id])
    .then(results => (results))
    .catch(err => (err));
};

let helpfulQuestion = (db, question_id) => {
  let query = 'UPDATE questions SET helpfulness = helpfulness + 1 WHERE question_id = $1';
  return db.query(query, [question_id])
    .then(results => (results))
    .catch(err => (err));
};

let reportAnswer = (db, answer_id) => {

};

let reportQuestion = (db, question_id) => {

};

module.exports = {
  helpfulAnswer: helpfulAnswer,
  helpfulQuestion: helpfulQuestion,
  reportAnswer: reportAnswer,
  reportQuestion: reportQuestion
}