const {client} = require('./connectToDBTest.js');
const {getQuestions, getAnswers} = require('../controllers/getRequests.js');

describe('Testing the get questions function', () => {
  // Happy path for question test
  it('Should grab a desired number of questions with the correct product id', async () => {
    let result = await getQuestions(client, '71705', 1, 1);

    expect(result.length).toEqual(1);
    expect(result[0].question_id).not.toBe(undefined);
    expect(result[0].body).not.toBe(undefined);
    expect(result[0].date).not.toBe(undefined);
    expect(result[0].helpfulness).not.toBe(undefined);
    expect(result[0].reported).not.toBe(undefined);
    expect(result[0].name).not.toBe(undefined);
  });

  // Happy test without arguments for page and count
  it('Should grab 5 questions when the number of questions was not specified', async () => {
    let result = await getQuestions(client, '71705')

    expect(result.length).toEqual(5);
    expect(result[0].question_id).not.toBe(undefined);
    expect(result[0].body).not.toBe(undefined);
    expect(result[0].date).not.toBe(undefined);
    expect(result[0].helpfulness).not.toBe(undefined);
    expect(result[0].reported).not.toBe(undefined);
    expect(result[0].name).not.toBe(undefined);
  });

  // Sad path without arguments for page and count
  it ('Should return 0 rows for a entry that does not exist in the database', async () => {
    let result = await getQuestions(client, '10000000000');
    expect(result.length).toBe(0);
  });

  // Sad path without any arguments for any parameters
  it('Should throw an error when no productId is present arguments are inputted', async () => {
    await expect(async () => {
      await getQuestions(client);
    }).rejects.toThrow('ProductID must be included');
  });

  // Sad path
  it('Should return an empty array with an invalid data type', async () => {
    await expect(async () => {
      await getQuestions(client, 'asdf');
    }).rejects.toThrow('ProductId must be an integer');
  });
});


describe('Testing the get answers functions', () => {
  // Happy path for answers
  it('Should return the desired number of answers for a specified question id', async () => {
    let results = await getAnswers(client, '1', 1, 1);

    expect(results.length).toBe(1);
    expect(results[0].answer_id).not.toBe(undefined);
    expect(results[0].name).not.toBe(undefined);
    expect(results[0].body).not.toBe(undefined);
    expect(results[0].date).not.toBe(undefined);
    expect(results[0].helpfulness).not.toBe(undefined);
    expect(results[0].photos).not.toBe(undefined);
  });

  // Happy path without page or count supplied
  it('Should return the default number of answers for a specific question id when page and or count are not specified', async ()=>{
    let results = await getAnswers(client, '1');

    expect(results.length).toBe(5);
    expect(results[0].answer_id).not.toBe(undefined);
    expect(results[0].name).not.toBe(undefined);
    expect(results[0].body).not.toBe(undefined);
    expect(results[0].date).not.toBe(undefined);
    expect(results[0].helpfulness).not.toBe(undefined);
    expect(results[0].photos).not.toBe(undefined);
  });

  // Sad path
  it('Should throw an error for an invalid data type', async () => {
    await expect(async () => {
      await getAnswers(client, 'asdf')
    }).rejects.toThrow('questionId must be an integer');
  });

  // Sad path
  it('Should return nothing when not arguments are passed through', async () => {
    await expect(async () => {
      await getAnswers(client);
    }).rejects.toThrow('TypeError: QuestionId must be included');
  });

  // Sad path
  it('Should return nothing for a question_id that doesnt exist', async () => {
    let results = await getAnswers(client, '-1');

    expect(results.length).toBe(0);
  });
});

afterAll(async() => {
  await client.end(() => {});
})