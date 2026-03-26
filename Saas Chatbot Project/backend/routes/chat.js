import express from "express";
import { ChatController } from "../controllers/chatController.js";

const router = express.Router();

const chatController = new ChatController();

router.post("/agent", (req, res, next) => chatController.chatPost(req, res, next));

export default router;
