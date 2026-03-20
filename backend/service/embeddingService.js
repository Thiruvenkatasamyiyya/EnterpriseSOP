import { GoogleGenAI } from "@google/genai";



export const generateEmbedding = async (text) => {

    const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINIAPIKEY
  });
    


    const response = await genAI.models.embedContent({
        model : 'gemini-embedding-001',
        contents: [text]
    })
//   const model = genAI.getGenerativeModel({ model: "embedding-001" });
//   const result = await model.embedContent(text);
    const embedding = response.embeddings[0].values;

    // if (embedding.length !== 768) {
    //   console.error(`❌ Wrong dimensions! Expected 768, got ${embedding.length}`);
    // }
  return response.embeddings[0].values;
};
