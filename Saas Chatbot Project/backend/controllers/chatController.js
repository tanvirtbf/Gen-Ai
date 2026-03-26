import { chatAgent } from "../agents/chatAgent.js";

export class ChatController {
  async chatPost(req, res, next) {
    const { query } = req.body;
    console.log(query);
    const result = await chatAgent(String(query));

    console.log("result: ", result);
    try {
      res.status(200).json({ success: true, assistant: result });
    } catch (error) {
      res.status(500).json({ error: "error" });
    }
  }
}
