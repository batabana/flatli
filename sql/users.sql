DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    image TEXT,
    createtime TIMESTAMP DEFAULT current_timestamp
);
