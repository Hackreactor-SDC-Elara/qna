COPY photos
FROM '/Users/justinstendara/Documents/HackReactor/Git/seniorPhase/sdc/qna/input_data/answers_photos.csv'
csv header;

SELECT setval('photos_photo_id_seq', (SELECT MAX(photo_id) from "photos"));