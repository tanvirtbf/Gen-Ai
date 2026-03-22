import express from "express";
import { generate } from "./generate.js";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  console.log("message: ", message);
  const assistantMessage = await generate(message);

  res.json({ message: assistantMessage });
});

app.listen(port, () => {
  console.log("Server Start!");
});
