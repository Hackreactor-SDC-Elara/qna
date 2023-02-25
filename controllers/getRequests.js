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

let getQuestions = async (db, productId, page, count = 5) => {
  if (productId === undefined) {
    throw new Error('TypeError: ProductID must be included');
  }
  if (typeof parseInt(productId) !== 'number' || parseFloat(productId) !== parseInt(productId)) {
    throw new Error('ProductId must be an integer');
  }

  let finalResult;
  let questionResult = await getQuestionsFromDB(db, productId, page, count);

  // for (let i = 0 ; i < questionResult.length ; i++) {
  //   let answers = {};
  //   let answersList = questionResult[i].answers;
  //   for (let y = 0; y < answersList.length ; y++) {
  //     answersList[y].photos = [questionResult[i].answers[y].photos.url];
  //     while (answersList[y].id === answersList?.[y + 1]?.id) {
  //       let removed = answersList.splice(y+1, 1);
  //       answersList[y].photos.push(removed[0].photos.url);
  //     }
  //     answers[answersList[y].id] = answersList[y];
  //   }
  //   questionResult[i].answers = answers;
  // }



  return questionResult;
};

let getAnswers = async (db, questionId, page = 0, count = 5) => {
  if (questionId === undefined) {
    throw new Error('TypeError: QuestionId must be included');
  }

  if (typeof parseInt(questionId) !== 'number' || parseFloat(questionId) !== parseInt(questionId)) {
    throw new Error('questionId must be an integer');
  }
  let results = [];
  let finalResult;
    let answerResult = await getAnswersFromDBAnswersRequest(db, questionId, page, count);
    results.push(answerResult.rows);

    if (answerResult.rows.length === 0) {
      results.push({rows:[]});
    } else {
      let photoResult = await getPhotosFromDBAnswersRequest(db, results[0]);
      results.push(photoResult);
    }

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

    finalResult = results[0];

  return finalResult;
};


module.exports = {
  getQuestions: getQuestions,
  getAnswers: getAnswers
}