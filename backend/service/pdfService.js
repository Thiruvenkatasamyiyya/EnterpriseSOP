import fs from "fs";
import pdf from "pdf-parse-new"

export const extractChunksFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);

  const text = data.text;
  const chunks = [];
  const chunkSize = 1000;
  const overlap = 100;

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
};
