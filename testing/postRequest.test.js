const {client} = require('./connectToDBTest.js');
const {postQuestion, postAnswer} = require('../controllers/postRequests.js');
const {formatPhotos} = require('../controllers/helperFunctions.js');

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
});

describe('Post requests for answers should be functional', () => {
  // Happy Path
  it('Should put a post request in for a user that has not been created yet (w/o photos)', async () => {
    let answerBody = 'This is a test using my functions wth answers';
    let userName = 'asdflkj';
    let email = 'email';
    let questionId = '3500000';
    let initialAnswerCount = await client.query('SELECT count(*) FROM answers WHERE question_id = $1', [questionId]);
    let results = await postAnswer(client, questionId, answerBody, userName, email, []);
    let finalAnswerCount = await client.query('SELECT count(*) FROM answers WHERE question_id = $1', [questionId]);

    expect(results.rows[0].answer_id).not.toBe(undefined);
    expect(results.rowCount).toBe(1);
    expect(parseInt(initialAnswerCount.rows[0].count)).toBeLessThan(parseInt(finalAnswerCount.rows[0].count));

    // reset the inserts that just happened
    await client.query('DELETE FROM answers WHERE question_id= $1 and body= $2', [questionId, answerBody]);
    await client.query('DELETE FROM users WHERE name= $1 and email= $2', [userName, email]);
  });

  // Happy Path
  it('Should put a post request in for a user that HAS been created', async () => {
    let answerBody = 'This is a test using my functions with a user that has already been created';
    let userName = 'Aaliyah.Abbott';
    let email = 'Ardella.Collier43@gmail.com';
    let questionId = '1000000';
    let previousAnswerCount = await client.query('SELECT count(*) FROM answers WHERE question_id = $1', [questionId]);
    let results = await postAnswer(client, questionId, answerBody, userName, email, []);
    let finalAnswerCount = await client.query('SELECT count(*) FROM answers WHERE question_id = $1', [questionId]);

    expect(results.rows[0].answer_id).not.toBe(undefined);
    expect(results.rowCount).toBe(1);
    expect(parseInt(previousAnswerCount.rows[0].count))
      .toBeLessThan(parseInt(finalAnswerCount.rows[0].count));

    // reset the inserts that just happened
    await client.query('DELETE FROM answers WHERE question_id=$1 and body= $2', [questionId, answerBody]);
  });

  // sad path
  it('Should throw an error if nothing is defined in the postquestion request', async () => {
    let results = await postAnswer(client);
    expect(results.severity).toBe('ERROR');
  });

  // Happy path with urls
  it('Should work with photos', async () => {
    let answerBody = 'This is a test using my functions with a user that has already been created';
    let userName = 'Aaliyah.Abbott';
    let email = 'Ardella.Collier43@gmail.com';
    let questionId = '1000000';
    let photos = ['test-url1', 'test-url2'];
    let initialPhotos = await client.query('SELECT count(*) FROM photos');
    let results = await postAnswer(client, questionId, answerBody, userName, email, photos);
    let finalPhotos = await client.query('SELECT count(*) FROM photos');

    expect(results.rowCount).toBe(2);
    expect(parseInt(initialPhotos.rows[0].count)).toBeLessThan(parseInt(finalPhotos.rows[0].count));

    // reset the inserts that just happened
    await client.query('DELETE FROM photos WHERE url=$1', [photos[0]]);
    await client.query('DELETE FROM photos WHERE url=$1', [photos[1]]);
    await client.query('DELETE FROM answers WHERE question_id=$1 and body= $2', [questionId, answerBody]);
  });
});

describe('Helper fucntions should work how they are supposed to', () => {
  it('Should work to format the Photos array to work with insertion', () => {
    expect(() => {
      formatPhotos()
    }).toThrow("Cannot read properties of undefined (reading 'map')");

    expect(formatPhotos(1, ['url'])).toBe('(1, \'url\')');
    expect(formatPhotos(1, ['url1', 'url2'])).toBe('(1, \'url1\'), (1, \'url2\')');
    expect(formatPhotos(1, [])).toBe('');
  })
})
afterAll(() => {
  client.end();
})