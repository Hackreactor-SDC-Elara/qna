-- Keeping this here for testing, but should remove later
DROP TABLE if exists photos;
DROP TABLE if exists answers;
DROP TABLE if exists questions;
DROP TABLE if exists users;


CREATE TABLE if not exists users (
  user_id SERIAL PRIMARY KEY,
  name varchar(60),
  email varchar(60)
);

CREATE TABLE if not exists questions (
  question_id SERIAL PRIMARY KEY,
  body VARCHAR(1000),
  date DATE,
  helpfulness SMALLINT,
  reported BIT(1),
  user_id SMALLINT,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
      REFERENCES users(user_id)
);

CREATE TABLE if not exists answers (
  answer_id SERIAL PRIMARY KEY,
  question_id SMALLINT,
  body VARCHAR(1000),
  date DATE,
  user_id SMALLINT,
  helpfulness SMALLINT,
  CONSTRAINT fk_question
    FOREIGN KEY (question_id)
      REFERENCES questions(question_id),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
      REFERENCES users(user_id)
);

CREATE TABLE if not exists photos (
  photo_id SERIAL PRIMARY KEY,
  answer_id SMALLINT,
  url VARCHAR(2048),
  CONSTRAINT fk_answer
    FOREIGN KEY (answer_id)
      REFERENCES answers (answer_id)
);