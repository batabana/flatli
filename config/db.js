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

exports.getDates = async () => {
    const query = `SELECT * FROM dates WHERE "end" >= NOW() - INTERVAL '1 day' ORDER BY start ASC LIMIT 5`;
    const { rows } = await db.query(query);
    return rows;
};

exports.saveDate = async (title, start, end) => {
    const query = `INSERT INTO dates (title, start, "end") VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await db.query(query, [title, start, end]);
    return rows;
};

exports.deleteDate = async id => {
    const query = `DELETE FROM dates WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows;
};
