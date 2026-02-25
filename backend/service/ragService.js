import SopChunk from "../models/SopChunk.js";
import { generateEmbedding } from "./embeddingService.js";

export const retrieveContext = async (query) => {
  const queryEmbedding = await generateEmbedding(query);

  const results = await SopChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 5
      }
    }
  ]);

    console.log("Retrieved Chunks:", results.length);

  return results;
};
