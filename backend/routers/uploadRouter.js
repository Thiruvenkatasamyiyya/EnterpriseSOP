import express from "express";
import { deleteSop, retriveSop, uploadSop } from "../controller/uploadController.js";
import multer from "multer";
import { chatLive } from "../controller/chatController.js";
const upload = multer({ dest: "uploads/" });

const router = express.Router()

router.post("/upload",upload.single("pdf"),uploadSop);
router.post("/chat", chatLive);
router.get("/retriveSOP", retriveSop);
router.delete("/deleteFile",deleteSop)

export default router;