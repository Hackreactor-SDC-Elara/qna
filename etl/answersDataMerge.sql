-- -- This is for testing
-- DROP TABLE answers CASCADE;

-- CREATE TABLE if not exists answers (
--   answer_id SERIAL PRIMARY KEY,
--   question_id BIGINT NULL,
--   body VARCHAR(1000) NULL,
--   date BIGINT NULL,
--   user_id BIGINT DEFAULT 0,
--   helpfulness BIGINT DEFAULT 0,
--   reported BIT(1) DEFAULT B'0',
--   CONSTRAINT fk_question
--     FOREIGN KEY (question_id)
--       REFERENCES questions(question_id),
--   CONSTRAINT fk_user
--     FOREIGN KEY (user_id)
--       REFERENCES users(user_id)
-- );

-- DROP INDEX answer_questions_ids;
-- DROP INDEX answer_answer_ids;
-- DROP INDEX answer_user_ids;

-- -- This is for testing

DROP TABLE IF EXISTS temp_answers;

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

COPY temp_answers
FROM '/var/lib/pgsql/data/answers.csv'
csv header;

-- COPY temp_answers
-- FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/etl/testETL/test_answers.csv'
-- csv header;

ALTER TABLE temp_answers ADD user_id INTEGER;

UPDATE temp_answers
SET
user_id = u.user_id
FROM users u
WHERE temp_answers.answerer_name = u.name and temp_answers.answerer_email = u.email;

ALTER TABLE temp_answers DROP COLUMN answerer_name;
ALTER TABLE temp_answers DROP COLUMN answerer_email;
ALTER TABLE temp_answers RENAME COLUMN date_written TO date;
ALTER TABLE temp_answers RENAME COLUMN helpful TO helpfulness;
ALTER TABLE temp_answers RENAME COLUMN id TO answer_id;

ALTER TABLE answers
DROP CONSTRAINT fk_question;

ALTER TABLE answers
DROP CONSTRAINT fk_user;

COPY (SELECT DISTINCT answer_id, question_id, body, helpfulness, reported, date, user_id
FROM temp_answers)
TO '/usr/src/app/testETL/temp_answers_table.csv'
CSV HEADER;

-- INSERT INTO answers (answer_id, question_id, body, helpfulness, reported, date, user_id)
-- SELECT id, question_id, body, helpful, reported, date, user_id
-- FROM temp_answers;

COPY answers (answer_id, question_id, body, helpfulness, reported, date, user_id)
FROM '/usr/src/app/testETL/temp_answers_table.csv'
CSV HEADER;

DROP TABLE temp_answers;
SELECT setval('answers_answer_id_seq', (SELECT MAX(answer_id) from "answers"));

CREATE INDEX answer_questions_ids ON answers (question_id);
CREATE INDEX answer_answer_ids ON answers (answer_id);
CREATE INDEX answer_user_ids ON answers (user_id);

-- ALTER TABLE answers
-- ADD CONSTRAINT fk_question
-- FOREIGN KEY (question_id)
-- REFERENCES questions (question_id);

-- ALTER TABLE answers
-- ADD CONSTRAINT fk_user
-- FOREIGN KEY (user_id)
-- REFERENCES users (user_id);

ANALYZE answers;