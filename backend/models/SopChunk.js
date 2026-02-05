import mongoose from "mongoose";

const sopChunkSchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
  documentName: String,
  pageNumber: Number
});

export default mongoose.model("SopChunk", sopChunkSchema);
