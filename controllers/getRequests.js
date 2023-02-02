// I am assuming that we will pass the database from the server to these
//   controllers, since they will be the same for the questions and
//   answers folder.
let format = require('pg-format');
const {
  getQuestionsFromDB,
  getAnswersFromDB,
  getPhotosFromDB,
  getAnswersFromDBAnswersRequest,
  getPhotosFromDBAnswersRequest
} = require('./asyncFunctions.js');

let getQuestions = (db, productId, page, count = 5) => {
  if (productId === undefined) {
    throw new Error('TypeError: ProductID must be included');
  }
  if (typeof parseInt(productId) !== 'number' || parseFloat(productId) !== parseInt(productId)) {
    throw new Error('ProductId must be an integer');
  }

  return getQuestionsFromDB(db, productId, page, count)
    .then(result => {
      if (result.length === 0) {
        return [result, {rows:[]}];
      } else {
        return Promise.all([
          result,
          getAnswersFromDB(db, result)
        ]);
      }
    })
    .then(results => {
      if (results[1].rows.length === 0) {
        return [...results, {rows:[]}];
      } else {
        return Promise.all([
          results[0],
          results[1],
          getPhotosFromDB(db, results[1].rows)
        ]);
      }
    })
    .then(results => {
      let product_answer = {};

      results[1].rows.map((val, idx) => {
        if (product_answer[val.question_id] === undefined) {
          product_answer[val.question_id] = [idx];
        } else {
          product_answer[val.question_id].push(idx);
        }
      });

      let foundQuestions = Object.keys(product_answer);

      let thisThing = JSON.parse(JSON.stringify(results[0]));

      for (let i = 0; i < thisThing.length; i++) {
        let question_id = thisThing[i]['question_id'];
        thisThing[i].answers = {};
        if (foundQuestions.includes(question_id.toString())) {
          let answerIdx = product_answer[question_id.toString()];
          for (let j = 0 ; j < answerIdx.length; j++) {
            let answerId = results[1].rows[answerIdx[j]].answer_id;
            let transformObject = (obj) => {
              // Transforming the answer object information
              obj.id = obj.answer_id;
              obj.answerer_name = obj.name;
              obj.date = new Date(parseInt(obj.date)).toISOString();
              obj.photos = [];
              results[2].rows.map(val => {
                if (val.answer_id === obj.id.toString()) {
                  obj.photos.push(val.url);
                }
              });

              // Deleting irrelevant key value pairs
              delete obj.answer_id;
              delete obj.name;
              delete obj.question_id;
            }

            // Transforming the question object to have the right shape
            transformObject(results[1].rows[answerIdx[j]]);

            // Assigning the answers object to the question object
            thisThing[i]['answers'][answerId] = results[1].rows[answerIdx[j]];
          }
        }
      }
      return thisThing;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

let getAnswers = (db, questionId, page = 0, count = 5) => {
  if (questionId === undefined) {
    throw new Error('TypeError: QuestionId must be included');
  }

  if (typeof parseInt(questionId) !== 'number' || parseFloat(questionId) !== parseInt(questionId)) {
    throw new Error('questionId must be an integer');
  }

  return getAnswersFromDBAnswersRequest(db, questionId, page, count)
    .then(result => {
      if (result.rows.length === 0) {
        return [result.rows, {rows:[]}]
      }

      return Promise.all([
        result.rows,
        getPhotosFromDBAnswersRequest(db, result.rows)
      ]);
    })
    .then(results => {
      let answersIdx = results[0].map(val => {
        val.photos = [];
        return val.answer_id;
      });
      for (let i = 0; i < results[1].rows.length ; i++) {
        let answerId = results[1].rows[i].answer_id;
        let currentPhoto = results[1].rows[i];
        let currentAnswerIdx = answersIdx.indexOf(parseInt(answerId));

        currentPhoto.id = currentPhoto.photo_id;
        delete currentPhoto.answer_id;
        delete currentPhoto.photo_id;
        results[0][currentAnswerIdx]['photos'].push(currentPhoto);
      }

      return results[0];
    })
    .catch(err => (err));
}

module.exports = {
  getQuestions: getQuestions,
  getAnswers: getAnswers
}