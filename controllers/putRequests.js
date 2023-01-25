let helpfulAnswer = (db, answer_id) => {
  let query = 'UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = $1';
  return db.query(query, [answer_id])
    .then(results => (results))
    .catch(err => (err));
}

module.exports = {
  helpfulAnswer: helpfulAnswer,
}