import { extractChunksFromPDF } from "../service/pdfService.js";
import { generateEmbedding } from "../service/embeddingService.js";
import SopChunk from "../models/SopChunk.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import SopDocs from "../models/SopDocs.js";

export const uploadSop = catchAsyncErrors(async (req, res, next) => {
  const chunks = await extractChunksFromPDF(req.file.path);
  await SopDocs.create({
    documentName: req.file.originalname,
    chunks: chunks.length,
  });
  console.log(chunks.length);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    try {
      const embedding = await generateEmbedding(chunk);
      await SopChunk.create({
        text: chunk,
        embedding,
        documentName: req.file.originalname,
      });
      console.log(`✅ Processed chunk ${i + 1}/${chunks.length}`);
      if (i < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    } catch (error) {
      console.error(`❌ Failed on chunk ${i + 1}:`, error.message);
    }
  }

  res.json({ message: "SOP Uploaded & Indexed Successfully" });
});

export const deleteSop = catchAsyncErrors(async (req, res) => {
  const { file } = req.body;
  const response = await SopChunk.deleteMany({ documentName: file });
  await SopDocs.deleteOne({ documentName: file });
  res.status(201).json({ response });
});

export const retriveSop = catchAsyncErrors(async (req, res) => {
  const data = await SopDocs.find();
  res.json({
    No_docs: data.length,
    data,
  });
});