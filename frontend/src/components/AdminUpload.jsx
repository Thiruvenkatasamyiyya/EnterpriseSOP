import React, { useState } from "react";
import DocsLog from "./DocsLog";
import UserLog from "./UserLog";
import {toast} from "react-hot-toast"
const baseUrl=import.meta.env.VITE_API_URL;
const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [isLoading,setIsLoading] = useState(false);

  const uploadPDF = async () => {
    if (!file) {
      toast.error("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    setIsLoading(true);
    const res = await fetch(`${baseUrl}/api/v1/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setIsLoading(false);
    setMsg(data.message);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 border-b bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">OpsMind AI</h2>
      </div>

      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Admin - Upload SOP PDF
        </h2>

        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="text-center px-4">
            <p className="text-gray-600 text-lg font-medium">
              {file ? file.name : "Click to upload PDF"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Only PDF files are allowed
            </p>
          </div>
        </label>

        
        <button
          disabled = {isLoading}
          onClick={uploadPDF}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          {isLoading ? "Uploading....." : "Upload"}
        </button>

        {msg && (
          <p className="mt-4 text-center text-green-600 font-medium">
            {msg}
          </p>
        )}
      </div>
      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
        <DocsLog />
      </div>
      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md"> 
        <UserLog/>
      </div>
    </div>
  );
};

export default AdminUpload;