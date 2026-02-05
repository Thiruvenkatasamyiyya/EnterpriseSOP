import { extractChunksFromPDF } from "../service/pdfService.js";
import { generateEmbedding } from "../service/embeddingService.js";
import SopChunk from "../models/SopChunk.js";

export const uploadSop = async (req, res) => {
  const chunks = await extractChunksFromPDF(req.file.path);

  for (let chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    await SopChunk.create({
      text: chunk,
      embedding,
      documentName: req.file.originalname
    });
  }

  res.json({ message: "SOP Uploaded & Indexed Successfully" });
};


