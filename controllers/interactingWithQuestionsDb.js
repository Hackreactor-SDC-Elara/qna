// I am assuming that we will pass the database from the server to these
//   controllers, since they will be the same for the questions and
//   answers folder.

let getQuestions = async (db, productId, page, count = 5) => {
  let query = 'SELECT * FROM questions q INNER JOIN users u ON u.user_id = q.user_id and q.product_id = $1 limit $2'

  return db.query(query, [productId, count])
    .then(result => {
      return result.rows;
    })
    .catch(err => {
      return err;
    })
}

module.exports = {
  getQuestions: getQuestions,
}