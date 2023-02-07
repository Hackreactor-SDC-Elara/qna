-- Before running this command, run the userData.js file and ensure that the
-- 'myTest.csv' file was generated without any issues
-- USE THIS FOR TESTING
DROP TABLE users;
CREATE TABLE if not exists users (
  user_id SERIAL PRIMARY KEY,
  name varchar(60) NOT NULL,
  email varchar(60) NOT NULL,
  UNIQUE (name, email)
);
-- USE THIS FOR TESTING


DROP TABLE if exists temp_users_table;
CREATE TEMP TABLE temp_users_table
AS
SELECT *
FROM users
WITH NO DATA;

-- COPY temp_users_table
-- FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/input_data/myTest.csv'
-- csv header;
COPY temp_users_table
FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/etl/testETL/usersMyTest.csv'
csv header;

INSERT INTO users (name, email)
SELECT DISTINCT name, email
FROM temp_users_table;

DROP TABLE temp_users_table;
CREATE INDEX user_user_id ON users (user_id);

ANALYZE USERS;