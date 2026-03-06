import { extractChunksFromPDF } from "../service/pdfService.js";
import { generateEmbedding } from "../service/embeddingService.js";
import SopChunk from "../models/SopChunk.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import SopDocs from "../models/SopDocs.js";

export const uploadSop = async (req, res) => {
  const chunks = await extractChunksFromPDF(req.file.path);
  const docs = await SopDocs.create({
    documentName : req.file.originalname,
    chunks : chunks.length
  })
console.log(chunks.length);

  // for (let chunk of chunks) {
  //   const embedding = await generateEmbedding(chunk);
  //   await SopChunk.create({
  //     text: chunk,
  //     embedding,
  //     documentName: req.file.originalname
  //   });
  // }

   for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    try {
      const embedding = await generateEmbedding(chunk);
      await SopChunk.create({
        text: chunk,
        embedding,
        documentName: req.file.originalname
      });
      console.log(`✅ Processed chunk ${i + 1}/${chunks.length}`);
      
      // Add a delay of ~600ms between chunks (target ~100 requests per minute)
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    } catch (error) {
      console.error(`❌ Failed on chunk ${i + 1}:`, error.message);
      // Decide whether to stop or continue
      // For now, we'll continue to the next chunk
    }
  }

  res.json({ message: "SOP Uploaded & Indexed Successfully" });
};

//Delete sop

export const deleteSop = catchAsyncErrors(async(req,res)=>{
  const {file} = req.body;

  SopChunk.deleteMany()
})


