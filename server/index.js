const express = require('express');
const app = express();
const PORT = 3000;
const {client} = require('./connectToDb.js');
const {getQuestions, getAnswers} = require('../controllers/getRequests.js');
const {postQuestion, postAnswer} = require('../controllers/postRequests.js');
const {helpfulAnswer, helpfulQuestion, reportAnswer, reportQuestion} =
  require('../controllers/putRequests.js');

const {formatPhotosArrayServer} = require('../controllers/helperFunctions.js');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('hi');
})

app.get('/loaderio-3727de9c2b38e300d3a91359ecc3afb1.txt', (req, res) => {
  res.sendFile('/home/ubuntu/qna/server/loaderio-3727de9c2b38e300d3a91359ecc3afb1.txt');
})

app.get('/loaderio-059b4cfd181734f0bf4f8c4b1fa5ebe1.txt', (req, res) => {
  res.sendFile('/home/ubuntu/qna/server/loaderio-059b4cfd181734f0bf4f8c4b1fa5ebe1.txt')
})
// GET '/qa/questions' => requires product_id, page, count
//   Should return 200 if it was completed
app.get('/qa/questions', (req, res) => {
  req.query.page = req.query.page ?? 1;
  let productId = req.query.product_id;
  // console.log('User has requested question information with the following parameters: ', req.query);
  let wrapperObj = {product_id: productId};
  getQuestions(client, productId, req.query.page, req.query.count)
    .then(results => {
      let questionObj = results.map((val) => {
        val.question_date = new Date(parseInt(val.question_date)).toISOString();
        val.reported = Boolean(parseInt(val.reported)) ? true : false;

        return {
          question_id: val.question_id,
          question_body: val.question_body,
          question_date: val.question_date,
          asker_name: val.asker_name,
          question_helpfulness: val.question_helpfulness,
          reported:  Boolean(parseInt(val.reported)),
          answers: val.answers
        }
      });
      wrapperObj.results = questionObj;
      res.status(200).send(wrapperObj);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err)
    });
});

// GET '/qa/questions/:question_id/answers' => requires question_id, page, and count
//   Shoudl return 200 if it was completed
app.get('/qa/questions/:question_id/answers', (req, res) => {
  req.query.page = req.query.page ?? 1;
  // console.log('User has requested answer information with the following parameters: ', req.query);
  getAnswers(client, req.params.question_id, req.query.page, req.query.count)
    .then(information => {
      let wrappedObj = {
        question: req.params.question_id,
        page: req.query.page,
        count: req.query.count
      };
      information = information.map(val => {
        val.date = new Date(parseInt(val.date)).toISOString();

        return val;
      });
      wrappedObj['results'] = information;
      res.status(200).send(wrappedObj)
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err)
    });
});

// POST '/qa/questions' => requires body, name, email, and product_id
//   Should return 201 if successful
// let postQuestion = (db, body, name, email, productId)
app.post('/qa/questions', (req, res) => {
  let body = req.query.body;
  let name = req.query.name;
  let email = req.query.email;
  let productId = parseInt(req.query.product_id);
  postQuestion(client, body, name, email, productId)
    .then(results => {
      res.status(201).send(results);
    })
    .catch(err => {
      res.status(400).send(err);
    })
});

// POST '/qa/questions/:question_id/answers' => requires body, name, email, and photos(opt)
//   Should return 201 if successful
app.post('/qa/questions/:question_id/answers', (req, res) => {
  let body = req.query.body;
  let name = req.query.name;
  let email = req.query.email;
  let questionId = req.params.question_id;
  let photos = formatPhotosArrayServer(req.query.photos);
  postAnswer(client, questionId, body, name, email, photos)
    .then(results => {
      res.status(201).send(results)
    })
    .catch(err => {
      res.status(400).send(err)
    });
});

// PUT requires question_id
//   Should return 204 if successful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  helpfulQuestion(client, req.params.question_id)
    .then(results => {
      res.status(204).send(results);
    })
    .catch(err => {
      res.status(400).send(err);
    })
});

// PUT requires question_id
//   Should return 204 if successful
app.put('/qa/questions/:question_id/report', (req, res) => {
  reportQuestion(client, req.params.question_id)
    .then(results => {
      res.status(204).send(results);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// PUT requires question_id
//   Should return 204 if successful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  helpfulAnswer(client, req.params.answer_id)
    .then(() => res.status(204).send())
    .catch(err => res.status(400).send(err));
});

// PUT requires question_id
//   Should return 204 if successful
app.put('/qa/answers/:answer_id/report', (req, res) => {
  reportAnswer(client, req.params.answer_id)
    .then(() => res.status(204).send())
    .catch(err => res.status(400).send(err));
});

app.listen(PORT, () => {
  console.log(`Server up, listening to port ${PORT}`);
});