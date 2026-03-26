import "dotenv/config";
import express from "express";
import cors from "cors";

import chatRouter from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRouter);

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on : ${port}`);
});
