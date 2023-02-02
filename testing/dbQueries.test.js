let queryFunctions = require('../controllers/asyncFunctions.js');
const {client} = require('./connectToDBTest.js');


describe('Testing the db query times for all queries related to the get questions', () => {
  it('Should run within 50 ms: get question function', async () => {
    await queryFunctions.getQuestionsFromDB(client, '71705', 1, 20);
  });

  it('Should run within 50 ms: get answers function', async () => {
    await queryFunctions.getAnswersFromDB(client, [
      {question_id: '1'},
      {question_id: '3500000'},
      {question_id: '2000000'},
      {question_id: '2500000'},
      {question_id: '2600000'},
      ]
    );
  }, 7500);

  it('Should run within 50 ms: get photos function', async () => {
    await queryFunctions.getPhotosFromDB(client, [
      {answer_id: '6500000'},
      {answer_id: '6400000'},
      {answer_id: '6300000'},
      {answer_id: '6200000'},
      {answer_id: '6100000'},
    ]);
  });
});

describe('Testing the db query times for all queries related to the get get answers', () => {
  it('Should run within 50ms: get answers', async () => {
    await queryFunctions.getAnswersFromDBAnswersRequest(client, '71705', 1, 20);
  }, 7500);

  it('Should run within 50ms: get photos', async () => {
    await queryFunctions.getPhotosFromDBAnswersRequest(client, [
      {answer_id: 102930},
      {answer_id: 102931},
      {answer_id: 102932},
      {answer_id: 102933},
      {answer_id: 102934}
    ]);
  })
})

afterAll(() => {
  client.end();
})