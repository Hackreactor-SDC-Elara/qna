CREATE TABLE if not exists temp_answers (
  id bigint,
  question_id bigint,
  body varchar(1000),
  date_written bigint,
  answerer_name varchar(60),
  answerer_email varchar(60),
  reported bit(1),
  helpful INTEGER
);

\copy  temp_answers
FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/input_data/answers.csv'
csv header;

ALTER TABLE temp_answers ADD user_id INTEGER;

UPDATE temp_answers
SET
user_id = u.user_id
FROM users u
WHERE temp_answers.answerer_name = u.name and temp_answers.answerer_email = u.email;

ALTER TABLE temp_answers DROP COLUMN answerer_name;
ALTER TABLE temp_answers DROP COLUMN answerer_email;
ALTER TABLE temp_answers RENAME COLUMN date_written TO date;

INSERT INTO answers (answer_id, question_id, body, helpfulness, reported, date, user_id)
SELECT id, question_id, body, helpful, reported,  date, user_id
FROM temp_answers;

DROP TABLE temp_answers;