DROP TABLE IF EXISTS expenses;

CREATE TABLE expenses(
    id SERIAL PRIMARY KEY,
    day DATE NOT NULL,
    amount DECIMAL(6,2),
    createtime TIMESTAMP DEFAULT current_timestamp
);
