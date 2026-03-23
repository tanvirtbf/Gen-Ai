import express from "express";
import cors from "cors";
import { generate } from "./generate.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ hello: "Hello" });
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  let result;

  if (message && message.length > 0) {
    result = await generate(message);
  }

  res.json({ message: result });
});

app.listen(3001, () => {
  console.log("Server Start");
});
