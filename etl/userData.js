const fs = require('fs');
const {parse} = require('csv-parse');
const {client} = require('../server/connectToDb.js');

let text, dateStart, dateEnd, endTime;
let startTime = Date.now();
let counter = 1;
let newObj = fs.createWriteStream('../input_data/myTest.csv');
newObj.write('user_id,name,email\n');
let stream = fs.createReadStream('../input_data/answers.csv')
.pipe(parse({delimiter: ','}))
.on('error', (err) => {
  console.log(`There was an error: `, err);
})
.on('data', async (row) => {
  newObj.write(`${counter},${row[4]},${row[5]}\n`);
  counter++;
})
.on('end', () => {
  endTime = Date.now();
  console.log(`Finished gettings users from the answers. Took ${(endTime - startTime) / 1000} s`);
  return;
})

let stream2 = fs.createReadStream('../input_data/questions.csv')
.pipe(parse({delimiter: ','}))
.on('error', (err) => {
  console.log(`There was an error: `, err);
})
.on('data', async (row) => {
  newObj.write(`${counter},${row[4]},${row[5]}\n`);
  counter++;
})
.on('end', () => {
  endTime = Date.now();
  console.log(`Finished gettings users from the questions. Took ${(endTime - startTime) / 1000} s`);
  return;
});