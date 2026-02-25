import fs from "fs";
import pdf from "pdf-parse-new"

export const extractChunksFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);

  const text = data.text
    .replace(/\s+/g, " ")
    .trim();

  const sentences = text.split(". ");

  const chunks = [];
  let temp = "";

  for (let s of sentences) {

    if ((temp + s).length < 800) {
      temp += s + ". ";
    } else {
      chunks.push(temp);
      temp = s + ". ";
    }
  }

  if (temp) chunks.push(temp);

  return chunks;
};
