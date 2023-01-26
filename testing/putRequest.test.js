let {helpfulAnswer, helpfulQuestion, reportAnswer, reportQuestion} = require('../controllers/putRequests.js');
let {client} = require('./connectToDBTest.js');

describe('Answer helpfulness put requests should be functional', () => {
  // Happy path
  it('Should Increment the helpfulness of an answer.', async () => {
    let initialAnswer = await client.query('SELECT * FROM answers WHERE answer_id = 139874');
    await helpfulAnswer(client, '139874');
    let finalAnswer = await client.query('SELECT * FROM answers WHERE answer_id = 139874');

    expect(parseInt(initialAnswer.rows[0].helpfulness))
      .toBeLessThan(parseInt(finalAnswer.rows[0].helpfulness));

    expect(initialAnswer.rows[0].body)
      .toEqual(finalAnswer.rows[0].body);
  });

  // Sad path
  it('Should do nothing if no answer_id is supplied', async () => {
    let result = await helpfulAnswer(client);
    expect(result.rowCount).toBe(0);
  });
});

describe('Question helpfulness put requests should be functional', () => {
  // Happy path
  it('Should Increment the helpfulness of an question.', async () => {
    let initialQuestion = await client.query('SELECT * FROM questions WHERE question_id = 139874');
    await helpfulQuestion(client, '139874');
    let finalQuestion = await client.query('SELECT * FROM questions WHERE question_id = 139874');

    expect(parseInt(initialQuestion.rows[0].helpfulness))
      .toBeLessThan(parseInt(finalQuestion.rows[0].helpfulness));

    expect(initialQuestion.rows[0].body)
      .toEqual(finalQuestion.rows[0].body);
  });

  // Sad path
  it('Should do nothing if no question_id is supplied', async () => {
    let result = await helpfulQuestion(client);
    expect(result.rowCount).toBe(0);
  });
});

describe('Report an answer function should work', () => {
  beforeEach(async () => {
    await client.query('UPDATE answers SET reported = B\'0\' WHERE answer_id = 144999');
  });

  // Happy path
  it('Should change the answer_id reported value to 1', async () => {
    let answerId = 144999;
    let initialAnswer = await client.query('SELECT * FROM answers WHERE answer_id = $1', [answerId]);
    await reportAnswer(client, answerId)
    let finalAnswer = await client.query('SELECT * FROM answers WHERE answer_id = $1', [answerId]);

    expect(initialAnswer.rows[0].reported).toBe('0');
    expect(finalAnswer.rows[0].reported).toBe('1')
  });

  // Sad path
  it('Should do nothing if no answer_id is supplied', async () => {
    let result = await reportAnswer(client);
    expect(result.rowCount).toBe(0);
  });
});

describe('Report an answer function should work', () => {
  beforeEach(async () => {
    await client.query('UPDATE questions SET reported = B\'0\' WHERE question_id = 144999');
  });

  // Happy path
  it('Should change the answer_id reported value to 1', async () => {
    let questionId = 144999;
    let initialQuestion = await client.query('SELECT * FROM questions WHERE question_id = $1', [questionId]);
    await reportQuestion(client, questionId)
    let finalQuestion = await client.query('SELECT * FROM questions WHERE question_id = $1', [questionId]);

    expect(initialQuestion.rows[0].reported).toBe('0');
    expect(finalQuestion.rows[0].reported).toBe('1')
  });

  // Sad path
  it('Should do nothing if no answer_id is supplied', async () => {
    let result = await reportQuestion(client);
    expect(result.rowCount).toBe(0);
  });
});

afterAll(() => {
  client.end();
});