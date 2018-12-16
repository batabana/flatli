DROP TABLE IF EXISTS dates;

CREATE TABLE dates(
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    start DATE NOT NULL,
    "end" DATE NOT NULL,
    createtime TIMESTAMP DEFAULT current_timestamp
);
