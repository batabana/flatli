DROP TABLE IF EXISTS debts;

CREATE TABLE debts(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    drink_id INTEGER NOT NULL REFERENCES drinks(id),
    createtime TIMESTAMP DEFAULT current_timestamp
);
