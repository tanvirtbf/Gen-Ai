import express from "express";
import { generate } from "./generate.js";
import cors from 'cors'

const app = express();
const port = 3001;
app.use(express.json());

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const result = await generate(String(message));

  res.json({ message: result });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
