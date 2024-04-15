import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

import { playersPool } from "./DBConfig.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const api_key = process.env.API_KEY; // Access the API_KEY variable from .env file
const api_secret = process.env.API_SECRET; // Access the API_SECRET variable from .env file

const serverClient = StreamChat.getInstance(api_key, api_secret);

app.post("/signup", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  try {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hashSync(password, 10);

    const token = serverClient.createToken(userId);

    await playersPool.query(
      `INSERT INTO players ( username ) VALUES ('${username}') RETURNING *`
    );

    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const { users } = await serverClient.queryUsers({ name: username });

    if (users.length === 0) {
      return res.json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compareSync(
      password,
      users[0].hashedPassword
    );

    const token = serverClient.createToken(users[0].id);

    if (passwordMatch) {
      res.json({
        token,
        userId: users[0].id,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        hashedPassword: users[0].hashedPassword,
      });
    } else {
      return res.json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.json(error);
  }
});

app.post("/update", async (req, res) => {
  const { username, result } = req.body;

  try {
    if (result === "won") {
      await playersPool.query(
        `UPDATE players SET wins = wins + 1 WHERE username = '${username}'`
      );
    } else if (result === "lost") {
      await playersPool.query(
        `UPDATE players SET losses = losses + 1 WHERE username = '${username}'`
      );
    } else {
      await playersPool.query(
        `UPDATE players SET ties = ties + 1 WHERE username = '${username}'`
      );
    }

    res.json({ message: "Stats updated" });
  } catch (error) {
    res.json(error);
  }
});

app.get("/top-players", async (req, res) => {
  try {
    const result = await playersPool.query(
      "SELECT username, wins FROM players ORDER BY wins DESC LIMIT 5"
    );
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to retrieve top players",
        error: error.message,
      });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
