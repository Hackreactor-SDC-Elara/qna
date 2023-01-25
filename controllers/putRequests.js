let helpfulAnswer = (db, answer_id) => {
  let query = 'UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = $1';

  console.log('Here we are!', answer_id)
  return db.query(query, [answer_id])
    .then(results => {
      console.log('resuts: ', results)
      return results;
    })
    .catch(err => {
      console.log('rerr: ', err)
      return err;
    });
}

module.exports = {
  helpfulAnswer: helpfulAnswer,
}