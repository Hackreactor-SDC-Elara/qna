DROP TABLE IF EXISTS temp_questions;

CREATE TABLE if not exists temp_questions (
  question_id SERIAL NOT NULL,
  product_id bigint,
  body varchar(1000),
  date_written bigint,
  asker_name varchar(60),
  asker_email varchar(60),
  reported bit(1),
  helpful INTEGER
);

COPY temp_questions
FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/input_data/questions.csv'
csv header;

ALTER TABLE temp_questions ADD user_id INTEGER;

UPDATE temp_questions
SET
user_id = u.user_id
FROM users u
WHERE temp_questions.asker_name = u.name and temp_questions.asker_email = u.email;

ALTER TABLE temp_questions DROP COLUMN asker_name;
ALTER TABLE temp_questions DROP COLUMN asker_email;
ALTER TABLE temp_questions RENAME COLUMN date_written TO date;

INSERT INTO questions (question_id, product_id, body, helpfulness, reported, date, user_id)
SELECT question_id, product_id, body, helpful, reported,  date, user_id
FROM temp_questions;

DROP TABLE temp_questions;
SELECT setval('questions_question_id_seq', (SELECT MAX(question_id) from "questions"));