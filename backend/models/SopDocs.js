import mongoose from "mongoose";

const sopDocsSchema = new mongoose.Schema({

  documentName: String,
  chunks : Number

});

export default mongoose.model("SopDocs", sopDocsSchema);
