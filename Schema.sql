DROP DATABASE IF EXISTS qanda;

CREATE DATABASE qanda;

\c qanda;


CREATE TABLE questions (
  id serial PRIMARY KEY,
  product_id int NOT NULL,
  body varchar NOT NULL,
  date_written DATE,
  asker_name varchar,
  asker_email varchar,
  reported int,
  helpful int
);

CREATE TABLE answers (
  id serial PRIMARY KEY,
  question_id int,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE cascade,
  body varchar NOT NULL,
  date_written DATE,
  answerer_name varchar,
  answerer_email varchar,
  reported int,
  helpful int
);

CREATE TABLE answerphotos (
  id serial PRIMARY KEY,
  answer_id int,
  FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE cascade,
  url varchar NOT NULL
);

COPY questions FROM '/home/n/Desktop/questions.csv' DELIMITER ',' CSV HEADER;
COPY answers FROM '/home/n/Desktop/answers.csv' DELIMITER ',' CSV HEADER;
COPY answerphotos FROM '/home/n/Desktop/answers_photos.csv' DELIMITER ',' CSV HEADER;