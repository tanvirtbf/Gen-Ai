import express from "express";
import { generate } from "./generate.js";
import cors from 'cors'

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const assistantMessage = await generate(message);

  res.json({ message: assistantMessage });
});

app.listen(port, () => {
  console.log("Server Start!");
});
