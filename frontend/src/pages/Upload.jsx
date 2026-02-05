import { useState } from "react";

export default function Upload() {

  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const uploadPDF = async () => {

    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    const res = await fetch("http://localhost:3000/api/v1/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div style={{ border: "1px solid gray", padding: "20px" }}>
      <h2>Admin - Upload SOP PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadPDF}>Upload</button>

      <p>{msg}</p>
    </div>
  );
}
