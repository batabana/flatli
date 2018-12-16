var spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/flatli");

exports.getUsers = async () => {
    const query = `SELECT * FROM users`;
    const { rows } = await db.query(query);
    return rows;
};

exports.getUserById = async id => {
    const query = `SELECT * FROM users WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows;
};

exports.getDateBatch = async (bottom, top) => {
    const query = `
    SELECT * FROM
        (SELECT ROW_NUMBER() OVER (ORDER BY start ASC) AS row, *
        FROM dates
        WHERE "end" >= NOW() - INTERVAL '1 day') AS rows
    WHERE row BETWEEN $1 AND $2`;
    const { rows } = await db.query(query, [bottom, top]);
    return rows;
};

exports.getAllDates = async () => {
    const query = `
    SELECT * FROM dates`;
    const { rows } = await db.query(query);
    return rows;
};

exports.saveDate = async (title, start, end) => {
    const query = `INSERT INTO dates (title, start, "end") VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await db.query(query, [title, start, end]);
    return rows;
};

exports.deleteDate = async id => {
    const query = `DELETE FROM dates WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(query, [id]);
    return rows;
};

exports.getAllDrinks = async user => {
    const query = `
        SELECT *, (
            SELECT COUNT(drink_id) FROM debts WHERE user_id = $1 AND debts.drink_id = drinks.id
        ) AS count, count * price AS total
        FROM drinks;`;
    const { rows } = await db.query(query, [user]);
    return rows;
};

exports.saveDrink = async (user, drink) => {
    const query = `INSERT INTO debts (user_id, drink_id) VALUES ($1, $2) RETURNING *`;
    const { rows } = await db.query(query, [user, drink]);
    return rows;
};
