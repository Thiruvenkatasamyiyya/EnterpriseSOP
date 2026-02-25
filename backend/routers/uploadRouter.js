import express from "express";
import { uploadSop } from "../controller/uploadController.js";
import multer from "multer";
import { chatLive } from "../controller/chatController.js";
const upload = multer({ dest: "uploads/" });

const router = express.Router()

router.post("/upload",upload.single("pdf"),uploadSop);
router.post("/chat", chatLive);

export default router;