CREATE TABLE tasks(
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title varchar(120) NOT NULL,
    completed boolean NOT NULL DEFAULT false
);