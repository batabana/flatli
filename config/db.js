var spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/flatli");

exports.getUsers = async () => {
    const query = `SELECT * FROM users ORDER BY name`;
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
    SELECT *, (SELECT count(id) FROM dates WHERE "end" >= NOW() - INTERVAL '1 day') as count
    FROM
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
        ) AS count
        FROM drinks
        ORDER BY count DESC, name ASC`;
    const { rows } = await db.query(query, [user]);
    return rows;
};

exports.saveDrink = async (user, drink) => {
    const query = `INSERT INTO debts (user_id, drink_id) VALUES ($1, $2) RETURNING *`;
    const { rows } = await db.query(query, [user, drink]);
    return rows;
};

exports.clearDebts = async user => {
    const query = `DELETE FROM debts WHERE user_id = $1 RETURNING *`;
    const { rows } = await db.query(query, [user]);
    return rows;
};

exports.updateCredit = async (user, newCredit) => {
    const query = `UPDATE users SET credit = $2 WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(query, [user, newCredit]);
    return rows;
};

exports.saveExpense = async (day, amount) => {
    const query = `INSERT INTO expenses (day, amount) VALUES ($1, $2) RETURNING *`;
    const { rows } = await db.query(query, [day, amount]);
    return rows;
};

exports.getAllExpenses = async () => {
    const query = `
        SELECT id, day, amount, monthsum
        FROM expenses
        JOIN
        (SELECT TO_CHAR(day, 'YYYY') AS year,
               TO_CHAR(day,'MM') AS month,
               SUM(amount) AS monthsum
        FROM expenses
        GROUP BY 1,2) as aggregate
        ON TO_CHAR(expenses.day, 'MM') = aggregate.month
        AND TO_CHAR(expenses.day, 'YYYY') = aggregate.year
        ORDER BY expenses.day DESC;`;
    const { rows } = await db.query(query);
    return rows;
};

exports.getSumExpenses = async lastDate => {
    const query = `
        SELECT (
            SELECT SUM(amount) AS sum FROM expenses
            WHERE day BETWEEN $1 AND NOW()
        ) AS cyclesum, (
            SELECT SUM(amount) AS sum FROM expenses
            WHERE TO_CHAR(day, 'MM') = TO_CHAR(NOW(), 'MM')
            AND TO_CHAR(day, 'YYYY') = TO_CHAR(NOW(), 'YYYY')
        ) AS monthsum`;
    const { rows } = await db.query(query, [lastDate]);
    return rows;
};

exports.deleteExpense = async id => {
    const query = `DELETE FROM expenses WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(query, [id]);
    return rows;
};
