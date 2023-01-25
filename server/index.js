const express = require('express');
const app = express();
const PORT = 3001;
const {client} = require('./connectToDb.js');
const {getQuestions} = require('../controllers/interactingWithQuestionsDb.js');

app.get('/', (req, res) => {
  console.log('User has landed!');
  res.send('hi');

})

// GET '/qa/questions' => requires product_id, page, count
//   Should return 200 if it was completed
app.get('/qa/questions', async (req, res) => {
  req.query.page = req.query.page ?? 1;
  console.log('User has requested question information with the following parameters: ', req.query);
  getQuestions(client, req.query.product_id, req.query.page, req.query.count)
    .then(information => res.status(200).send(information))
    .catch(err => res.status(400).send(err));
});

// GET '/qa/questions/:question_id/answers' => requires question_id, page, and count
//   Shoudl return 200 if it was completed
app.get('/qa/questions/:question_id/answers', (req, res) => {
  req.query.page = req.query.page ?? 1;
  console.log('User has requested answer information with the following parameters: ', req.query);
  res.send(req.query);
});

// POST '/qa/questions' => requires body, name, email, and product_id
//   Should return 201 if successful
app.post('/qa/questions', (req, res) => {
  console.log('User has tried to post a new question: ', req.query);
  res.send(req.query);
});

// POST '/qa/questions/:question_id/answers' => requires body, name, email, and photos(opt)
//   Should return 201 if successful
app.post('/qa/questions/:question_id/answers', (req, res) => {
  console.log('User has tried to answer a question: ', req.query);
  res.send(req.query);
});

// PUT requires question_id
//   Should return 204 if successful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  console.log('User has tried to mark a question helpful: ', req.query);
  res.send(req.query);
});

// PUT requires question_id
//   Should return 204 if successful
app.put('/qa/questions/:question_id/report', (req, res) => {
  console.log('User has tried to report a question: ', req.query);
  res.send(req.query);
});

// PUT requires question_id
//   Should return 204 if successful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  console.log('User has tried to mark an answer helpful: ', req.query);
  res.send(req.query);
});

// PUT requires question_id
//   Should return 204 if successful
app.put('/qa/answers/:answer_id/report', (req, res) => {
  console.log('User has tried to report an answer: ', req.query);
  res.send(req.query);
});

app.listen(PORT, () => {
  console.log(`Server up, listening to port ${PORT}`);
});