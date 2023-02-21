const express = require('express');
const app = express();
const PORT = 3000;
const {client} = require('./connectToDb.js');
const {getQuestions, getAnswers} = require('../controllers/getRequests.js');
const {postQuestion, postAnswer} = require('../controllers/postRequests.js');
const {helpfulAnswer, helpfulQuestion, reportAnswer, reportQuestion} =
  require('../controllers/putRequests.js');

const {formatPhotosArrayServer} = require('../controllers/helperFunctions.js');
const request = require('request')

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  console.log('User has landed!');
  res.send('hi');
})

app.get('/loaderio-2d3782bad4f2b16af6678893db334fe7.txt', (req, res) => {
  res.sendFile('./loaderio-2d3782bad4f2b16af6678893db334fe7.txt');
})

const servers = ['http://3.17.204.141:3000'];
let serverCount = 0;
const handler = (req, res) => {
  let _req = request({url: servers[serverCount] + req.url}).on('error', error => {
    res.status(500).send(error.message);
  })
  req.pipe(_req).pipe(res);
  serverCount = (serverCount + 1) % servers.length;
}

app.get('*', handler).post('*', handler);
app.listen(PORT, () => {
  console.log(`Server up, listening to port ${PORT}`);
});