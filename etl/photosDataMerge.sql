COPY photos
FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/input_data/answers_photos.csv'
csv header;

SELECT setval('photos_photo_id_seq', (SELECT MAX(photo_id) from "photos"));

CREATE INDEX photo_photo_id ON photos (photo_id);
CREATE INDEX photo_answer_ids ON photos (answer_id);