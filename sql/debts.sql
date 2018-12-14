DROP TABLE IF EXISTS debts;

CREATE TABLE debts(
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
    drink_id INTEGER UNIQUE NOT NULL REFERENCES drinks(id),
    count INTEGER,
    createtime TIMESTAMP DEFAULT current_timestamp
);
