import express from "express";
import { deleteSop, retriveSop, uploadSop } from "../controller/uploadController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router()

router.post("/upload", upload.single("file"), uploadSop);
router.get("/retrieve", retriveSop);
router.delete("/delete", deleteSop);

export default router;