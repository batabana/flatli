DROP TABLE IF EXISTS dates;

CREATE TABLE dates(
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    start DATE NOT NULL,
    "end" DATE NOT NULL,
    "allDay?" BOOLEAN DEFAULT true,
    "resource?" BOOLEAN DEFAULT false,
    createtime TIMESTAMP DEFAULT current_timestamp
);
