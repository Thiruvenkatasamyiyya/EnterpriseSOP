
import { GoogleGenAI } from "@google/genai";

import { retrieveContext } from "../service/ragService.js"; 

export const chatLive =   async (req, res) => {
  const { question } = req.body;

    const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINIAPIKEY
    });

  const contextChunks = await retrieveContext(question);

  if (contextChunks.length === 0) {
    return res.json({ answer: "I don't know. Not found in SOPs." });
  }

  const contextText = contextChunks.map(c => c.text).join("\n");

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Answer ONLY from the context below.
If answer is missing, say "I don't know".

Context:
${contextText}

Question:
${question}
`;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  res.json({
    answer: result.text(),
    sources: contextChunks.map(c => c.documentName)
  });
};

