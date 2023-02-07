-- Will remove later
DROP TABLE questions;

CREATE TABLE if not exists questions (
  question_id SERIAL PRIMARY KEY,
  product_id VARCHAR(7) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date BIGINT NOT NULL,
  helpfulness INTEGER DEFAULT 0,
  reported BIT(1) DEFAULT B'0',
  user_id INTEGER DEFAULT 0,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
      REFERENCES users(user_id)
);

drop index question_answer_ids;
drop index question_user_ids;
-- Will remove later

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

-- COPY temp_questions
-- FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/input_data/questions.csv'
-- csv header;

COPY temp_questions
FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/etl/testETL/testQuestions.csv'
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

ALTER TABLE questions
DROP CONSTRAINT fk_user;

INSERT INTO questions (question_id, product_id, body, helpfulness, reported, date, user_id)
SELECT DISTINCT question_id, product_id, body, helpful, reported,  date, user_id
FROM temp_questions;

DROP TABLE temp_questions;
SELECT setval('questions_question_id_seq', (SELECT MAX(question_id) from "questions"));

CREATE INDEX question_answer_ids ON answers (question_id);
CREATE INDEX question_user_ids ON answers (user_id);
CREATE INDEX question_product_id ON questions (product_id);

ALTER TABLE questions
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users (user_id);

ANALYZE questions;