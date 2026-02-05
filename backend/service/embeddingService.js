import { GoogleGenAI } from "@google/genai";



export const generateEmbedding = async (text) => {
    console.log(process.env.GEMINIAPIKEY);

    const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINIAPIKEY
  });
    


    const response = await genAI.models.embedContent({
        model : 'gemini-embedding-001',
        contents: [text]
    })
//   const model = genAI.getGenerativeModel({ model: "embedding-001" });
//   const result = await model.embedContent(text);
  return response.embeddings[0].values;
};
