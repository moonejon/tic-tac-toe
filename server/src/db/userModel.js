import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getUsers = async () => {
  try {
    return await new Promise((resolve, reject) => {
      pool.query("SELECT * FROM users", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

const createUser = async (payload) => {
  return await new Promise((resolve, reject) => {
    const { id, username, wins, losses, ties } = payload;
    pool.query(
      "INSERT INTO users (id, username, wins, ties, losses) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, username, wins, losses, ties],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new user has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const getUserById = async (id) => {
  return await new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
      if (error) {
        reject(error);
      }
      if (results && results.rows) {
        resolve(results.rows[0]);
      } else {
        reject(new Error("No results found"));
      }
    });
  });
};

const getUserByUsername = async (username) => {
  return await new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows[0]);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const getTopFiveUsersByWins = async () => {
  return await new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users ORDER BY wins DESC LIMIT 5",
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

export { getUsers, createUser, getUserById, getUserByUsername, getTopFiveUsersByWins };
