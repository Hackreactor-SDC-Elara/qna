-- Keeping this here for testing, but should remove later
-- Adding to tables I will need to follow this order
-- For questions: 1. Users, 2. Questions
-- For answers: 1. Users, 2. Answer, 3. Photos

DROP TABLE if exists photos;
DROP TABLE if exists answers;
DROP TABLE if exists questions;
DROP TABLE if exists users;


CREATE TABLE if not exists users (
  user_id SERIAL PRIMARY KEY,
  name varchar(60) NOT NULL,
  email varchar(60) NOT NULL
);

CREATE TABLE if not exists questions (
  question_id SERIAL PRIMARY KEY,
  product_id VARCHAR(7) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date BIGINT NOT NULL,
  helpfulness INTEGER NOT NULL,
  reported BIT(1) NOT NULL,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
      REFERENCES users(user_id)
);

CREATE TABLE if not exists answers (
  answer_id SERIAL PRIMARY KEY,
  question_id BIGINT,
  body VARCHAR(1000),
  date BIGINT,
  user_id BIGINT,
  helpfulness BIGINT,
  reported BIT(1),
  CONSTRAINT fk_question
    FOREIGN KEY (question_id)
      REFERENCES questions(question_id),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
      REFERENCES users(user_id)
);

CREATE TABLE if not exists photos (
  photo_id SERIAL PRIMARY KEY,
  answer_id BIGINT,
  url VARCHAR(2048),
  CONSTRAINT fk_answer
    FOREIGN KEY (answer_id)
      REFERENCES answers (answer_id)
);