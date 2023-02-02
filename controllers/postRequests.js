let format = require('pg-format');
let {formatPhotos} = require('./helperFunctions.js');

// let postQuestion = (db, body, name, email, productId) => {
//   // We will need to get the userID - this is where 205 currently is
//   let insertUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, $2);';
//   return db.query(insertUserQuery, [name, email])
//     .then(results => {
//       return results;
//     })
//     .catch(err => (err))
//     .then(() => {
//       let postQuestionQuery = 'INSERT INTO questions (question_id, product_id, body, date, helpfulness, reported, user_id) \
// VALUES (DEFAULT, $1, $2, $5, 0, B\'0\', (SELECT user_id FROM users WHERE name = $3 and email = $4)) RETURNING question_id;';
//       let currDate = new Date();
//       return db.query(postQuestionQuery, [productId, body, name, email, Math.round(currDate.getTime() / 1000)])
//         .then(results => (results))
//         .catch(err => (err));
//     });
// };

let postQuestion = async (db, body, name, email, productId) => {
  db = await db.connect();
  let finalRes;
  try {
    await db.query('BEGIN');
    // Check to see if the user is in the table
    let checkUserQuery = 'SELECT EXISTS (select * from users where name=$1 and email=$2)';
    let checkUser = await db.query(checkUserQuery, [name, email]);

    if (!checkUser.rows[0].exists) {
      let insertUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, $2);';
      const userInsertResult = await db.query(insertUserQuery, [name, email]);
    }

    // Add the quesiton to the table with the user
    let postQuestionQuery = 'INSERT INTO questions (question_id, product_id, body, date, helpfulness, reported, user_id) \
VALUES (DEFAULT, $1, $2, $5, 0, B\'0\', (SELECT user_id FROM users WHERE name = $3 and email = $4)) RETURNING question_id;';
    let currDate = new Date();
    const insertQuestionResult = await db.query(postQuestionQuery, [productId, body, name, email, Math.round(currDate.getTime() / 1000)]);

    // Commit all the changes to the database
    await db.query('COMMIT');
    finalRes = insertQuestionResult;
  } catch (e) {
    console.log('Here it is: ', e)
    await db.query('ROLLBACK');
    finalRes = e;
    throw e;
  } finally {
    db.release();
  }

  return finalRes;
};

// let postAnswer = (db, questionId, body, name, email, photos) => {
//   let insertUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, $2);';

//   return db.query(insertUserQuery, [name, email])
//     .then(results => {
//       return results;
//     })
//     .catch(err => (err))
//     .then(() => {
//       let answerBody = 'INSERT INTO answers (answer_id, question_id, body, date, user_id, helpfulness, reported)\
// VALUES (DEFAULT, $1, $2, $5, (SELECT user_id FROM users WHERE name=$3 and email=$4), 0, B\'0\') RETURNING answer_id';

//       let currDate = new Date();
//       return db.query(answerBody, [questionId, body, name, email, Math.round(currDate.getTime() / 1000)])
//     })
//     .catch(err => (err))
//     .then(results => {
//       if (results?.rows?.[0]?.answer_id === undefined) {
//         return results;
//       }
//       if (photos.length === 0) {
//         return results;
//       } else {
//         let photoString = formatPhotos(results.rows[0].answer_id, photos);
//         let photosQuery = 'INSERT INTO photos (answer_id, url) VALUES %s';
//         return db.query(format(photosQuery, photoString), []);
//       }
//     })
//     .then(results => (results))
//     .catch(err => (err))
// };

let postAnswer = async (db, questionId, body, name, email, photos) => {
  db = await db.connect();
  let finalResult;
  try {
    await db.query('BEGIN');

    let checkUserQuery = 'SELECT EXISTS (select * from users where name=$1 and email=$2)';
    let checkUser = await db.query(checkUserQuery, [name, email]);

    if (!checkUser.rows[0].exists) {
      let insertUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, $2);';
      const userInsertResult = await db.query(insertUserQuery, [name, email]);
    }

    let answerBody = 'INSERT INTO answers (answer_id, question_id, body, date, user_id, helpfulness, reported)\
    VALUES (DEFAULT, $1, $2, $5, (SELECT user_id FROM users WHERE name=$3 and email=$4), 0, B\'0\') RETURNING answer_id';
    let currDate = new Date();
    let insertAnswer = db.query(answerBody, [questionId, body, name, email, Math.round(currDate.getTime() / 1000)]);

    if (insertAnswer?.rows?.[0]?.answer_id === undefined || photos.length === 0) {
      finalResult = insertAnswer;
    } else {
      let photoString = formatPhotos(insertAnswer.rows[0].answer_id, photos);
      let photosQuery = 'INSERT INTO photos (answer_id, url) VALUES %s';
      let insertPhotos = await db.query(format(photosQuery, photoString), []);
      finalResult = insertPhotos;
    }

    await db.query('COMMIT');
  } catch(e) {
    await db.query('ROLLBACK');
    throw e;
  }finally {
    db.release();
    return finalResult;
  }
//   return db.query(insertUserQuery, [name, email])
//     .then(results => {
//       return results;
//     })
//     .catch(err => (err))
//     .then(() => {
//       let answerBody = 'INSERT INTO answers (answer_id, question_id, body, date, user_id, helpfulness, reported)\
// VALUES (DEFAULT, $1, $2, $5, (SELECT user_id FROM users WHERE name=$3 and email=$4), 0, B\'0\') RETURNING answer_id';

//       let currDate = new Date();
//       return db.query(answerBody, [questionId, body, name, email, Math.round(currDate.getTime() / 1000)])
//     })
//     .catch(err => (err))
//     .then(results => {
//       if (results?.rows?.[0]?.answer_id === undefined) {
//         return results;
//       }
//       if (photos.length === 0) {
//         return results;
//       } else {
//         let photoString = formatPhotos(results.rows[0].answer_id, photos);
//         let photosQuery = 'INSERT INTO photos (answer_id, url) VALUES %s';
//         return db.query(format(photosQuery, photoString), []);
//       }
//     })
//     .then(results => (results))
//     .catch(err => (err))
}

module.exports = {
  postQuestion: postQuestion,
  postAnswer: postAnswer
}