-- This is for testing
DROP TABLE photos;

CREATE TABLE if not exists photos (
  photo_id SERIAL PRIMARY KEY,
  answer_id BIGINT DEFAULT 0,
  url VARCHAR(2048),
  CONSTRAINT fk_answer
    FOREIGN KEY (answer_id)
      REFERENCES answers (answer_id)
);

ALTER TABLE photos
DROP CONSTRAINT fk_answer;
-- This is for testing


-- COPY photos
-- FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/input_data/answers_photos.csv'
-- csv header;

COPY photos
FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/etl/testETL/testAnswerPhotos.csv'
csv header;

ALTER TABLE photos
DROP CONSTRAINT fk_answer;

SELECT setval('photos_photo_id_seq', (SELECT MAX(photo_id) from "photos"));

CREATE INDEX photo_photo_id ON photos (photo_id);
CREATE INDEX photo_answer_ids ON photos (answer_id);

ALTER TABLE photos
ADD CONSTRAINT fk_answers
FOREIGN KEY (answer_id)
REFERENCES answers (answer_id);

ANALYZE PHOTOS;