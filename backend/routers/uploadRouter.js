import express from "express";
import { uploadSop } from "../controller/uploadController.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router()

router.post("/upload",upload.single("pdf"),uploadSop);

export default router;