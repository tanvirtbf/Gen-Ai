import express from "express";

const app = express();
const port = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  console.log("message: ", message);

  res.json({ message: message });
});

app.listen(port, () => {
  console.log("Server Start!");
});
