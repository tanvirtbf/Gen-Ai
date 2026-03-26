export class ChatController {
  async chatPost(req, res, next) {
    try {
      const { query } = req.body;

      res.status(200).json({ success: true, query });
    } catch (error) {
      res.status(500).json({ error: "error" });
    }
  }
}
