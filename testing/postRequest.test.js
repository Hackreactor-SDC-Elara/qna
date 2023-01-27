const {client} = require('./connectToDBTest.js');
const {postQuestion} = require('../controllers/postRequests.js');

describe('Post requests for questions should be functional', () => {
  it('Should put a post request in for a user that has not been created yet', async () => {
    let questionBody = 'This is a test using my functions';
    let userName = 'jstning';
    let email = 'email';
    let productId = '71765';
    let previousQuestionCount = await client.query('SELECT count(*) FROM questions WHERE product_id = $1', [productId]);
    let results = await postQuestion(client, questionBody, userName, email, productId);
    let finalQuestionCount = await client.query('SELECT count(*) FROM questions WHERE product_id = $1', [productId]);

    expect(results.rows[0].question_id).not.toBe(undefined);
    expect(results.rowCount).toBe(1);
    expect(parseInt(previousQuestionCount.rows[0].count)).toBeLessThan(parseInt(finalQuestionCount.rows[0].count));

    // reset the inserts that just happened
    await client.query('DELETE FROM questions WHERE product_id=\'71765\' and body=\'This is a test using my functions\'');
    await client.query('DELETE FROM users WHERE name=\'jstning\' and email=\'email\'');
  });

  it('Should put a post request in for a user that HAS been created', async () => {
    let questionBody = 'This is a test using my functions with a user that has already been created';
    let userName = 'Aaliyah.Abbott';
    let email = 'Ardella.Collier43@gmail.com';
    let productId = '1000010';
    let previousQuestionCount = await client.query('SELECT count(*) FROM questions WHERE product_id = $1', [productId]);
    let results = await postQuestion(client, questionBody, userName, email, productId);
    let finalQuestionCount = await client.query('SELECT count(*) FROM questions WHERE product_id = $1', [productId]);

    expect(results.rows[0].question_id).not.toBe(undefined);
    expect(results.rowCount).toBe(1);
    expect(parseInt(previousQuestionCount.rows[0].count))
      .toBeLessThan(parseInt(finalQuestionCount.rows[0].count));

    // reset the inserts that just happened
    await client.query('DELETE FROM questions WHERE product_id=$1 and body= $2', [productId, questionBody]);
  });

  // sad path
  it('Should throw an error if nothing is defined in the postquestion request', async () => {
    let results = await postQuestion(client);

    expect(results.severity).toBe('ERROR');
  });
})

afterAll(() => {
  client.end();
})