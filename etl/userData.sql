-- Before running this command, run the userData.js file and ensure that the
-- 'myTest.csv' file was generated without any issues

CREATE TEMP TABLE temp_users_table
AS
SELECT *
FROM users
WITH NO DATA;

\copy  temp_users_table from '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/input_data/myTest.csv' csv header;

INSERT INTO users (name, email)
SELECT DISTINCT name, email
FROM temp_users_table;

DROP TABLE temp_users_table;