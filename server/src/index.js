import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const api_key = process.env.API_KEY; // Access the API_KEY variable from .env file
const api_secret = process.env.API_SECRET; // Access the API_SECRET variable from .env file

const serverClient = StreamChat.getInstance(api_key, api_secret);

app.post("/signup", (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const token = serverClient.createToken(userId);

    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});
app.post("/login");

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
