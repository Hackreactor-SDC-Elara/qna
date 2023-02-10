const {Client} = require('pg');
const { writeFile, unlink, readFile } = require('fs').promises;
const path = require('path');
const Round = Math.round;
let main = async () => {
  const db = await new Client({
    database: 'sdc'
  });

  await db.connect();
  let overallStart = Date.now();
  let start;

  let queryHandler = async (data, fileName) => {
    start = Date.now()
    console.log(`Starting ${fileName}`)
    await db.query(data.toString());
    let timeReq = Date.now() - start;
    let minFormat = timeReq >= 1000 ? `(${Math.floor(timeReq/(1000 * 60))}min ${Round((timeReq / (1000 * 60)) % 1 * 60)}s)` : '';
    console.log(`The ${fileName} took ${timeReq} ms ${minFormat}`)
  }

  try {
    await readFile(path.join(__dirname, 'db.sql'))
      .then(async(data) => (await queryHandler(data, 'db.sql')))
      .catch(err => {
        throw new Error(err);
      });

    await readFile(path.join(__dirname, 'userData.sql'))
      .then(async (userData) => (await queryHandler(userData, 'userData.sql')))
      .catch(err => { throw new Error(err); });

    await readFile(path.join(__dirname, 'questionDataMerge.sql'))
      .then(async (questionData) => {
        await writeFile(path.join(__dirname, 'testETL/temp_question_table.csv'), '');
        await queryHandler(questionData, 'questionDataMerge.sql');
        await unlink(path.join(__dirname, 'testETL/temp_question_table.csv'))
      })
      .catch(err => { throw new Error(err); });

    await readFile(path.join(__dirname, 'answersDataMerge.sql'))
      .then(async (answerData) => {
        await writeFile(path.join(__dirname, 'testETL/temp_answers_table.csv'), '');
        await queryHandler(answerData, 'answersDataMerge.sql');
        await unlink(path.join(__dirname, 'testETL/temp_answers_table.csv'));
      })
      .catch(err => { throw new Error(err); });

    await readFile(path.join(__dirname, 'photosDataMerge.sql'))
      .then(async (answerData) => (await queryHandler(answerData, 'photoDataMerge.sql')))
      .catch(err => { throw new Error(err); });

  } catch (err) {
    console.log(err);
    return err;
  } finally {
    console.log(`Process finished, took ${Date.now() - overallStart} ms`);
    return;
  }
};

main();