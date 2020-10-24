DROP TABLE if exists location;
DROP TABLE if exists weather;
DROP TABLE if exists trails;

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  latitude FLOAT,
  longitude FLOAT,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255)
);


CREATE TABLE weather (
  id SERIAL PRIMARY KEY,
  forecast VARCHAR(255),
  time VARCHAR(255)
);

CREATE TABLE trails (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  location VARCHAR(255),
  length VARCHAR(255),
  stars FLOAT,
  star_votes VARCHAR(255),
  summary VARCHAR(255),
  trail_url VARCHAR(255),
  conditions VARCHAR(255),
  condition_date VARCHAR(255),
  condition_time VARCHAR(255)
);

