import pkg from 'pg';
const { Pool } = pkg;

const playersPool = new Pool({
    connectionString: process.env.DBConnLink,
    ssl: {
        rejectUnauthorized: false
    }
});

export { playersPool };
