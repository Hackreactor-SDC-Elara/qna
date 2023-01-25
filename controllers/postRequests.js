// Example question post requres-
// INSERT INTO questions VALUES (DEFAULT,
// 71705,
// 'This is an attempt for my first insert question',
// 0,
// B'0',
// 1,
// 1674669353);

let postQuestion = (db, body, name, email, productId) => {
  // We will need to get the userID - this is where 205 currently is
  let insertUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, $2);';

  return db.query(insertUserQuery, [name, email])
    .then(results => {
      console.log(results);
      return results;
    })
  // let postQuestionQuery = 'INSERT INTO questions VALUES (DEFAULT, $1, $2, 0, B\'0\', 205, $3);';

  // return db.query(query, [])
  //   .then(results => (results))
  //   .catch(err => (err));
}

module.exports = {
  postQuestion: postQuestion,
}