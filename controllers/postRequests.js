let postQuestion = (db, body, name, email, productId) => {
  let query = '';

  return db.query(query, [])
    .then(results => (results))
    .catch(err => (err));
}

module.exports = {
  postQuestion: postQuestion,
}