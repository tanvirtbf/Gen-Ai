import express from "express";
import { ChatController } from "../controllers/chatController";

const router = express.Router();

const chatController = new ChatController();

router.post("/agent", (req, res) => chatController.chatPost(req, res));

export default router;
