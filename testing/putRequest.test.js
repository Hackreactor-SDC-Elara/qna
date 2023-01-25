let {helpfulAnswer} = require('../controllers/putRequests.js');
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

afterAll(() => {
  client.end();
})