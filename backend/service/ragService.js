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
        limit: 10
      }
    },
    {
      $project: {
        text: 1,
        documentName: 1,
        score: { $meta: "vectorSearchScore" }, // THIS IS CRITICAL
        preview: { $substr: ["$text", 0, 200] } // Show first 200 chars
      }
    }
  ]);

    console.log("📊 Retrieved Chunks:", results.length);
  
  if (results.length > 0) {
    console.log("📈 Scores:", results.map(r => r.score));
    console.log("📄 Top chunk preview:", results[0].preview);
  } else {
    console.log("❌ No results found!");
  }

    console.log("Retrieved Chunks:", results.length);

  return results;
};
