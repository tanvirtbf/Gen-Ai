import express from "express";
import { generate } from "./generate.js";
import cors from "cors";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;

  if (!message || !threadId) {
    res.status(400).json({ message: "All fields are required!" });
    return;
  }

  const assistantMessage = await generate(message, threadId);

  res.json({ message: assistantMessage });
});

app.listen(port, () => {
  console.log("Server Start!");
});
