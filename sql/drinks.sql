DROP TABLE IF EXISTS drinks;

CREATE TABLE drinks(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL,
    image TEXT,
    createtime TIMESTAMP DEFAULT current_timestamp
);
