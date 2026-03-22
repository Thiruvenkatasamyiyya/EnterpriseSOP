# 🏢 Enterprise SOP RAG Agent

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

An intelligent, full-stack Enterprise conversational agent designed to instantly answer employee queries based on internal Standard Operating Procedures (SOPs). Built using a **Retrieval-Augmented Generation (RAG)** architecture with the **MERN stack**, **Google Gemini 2.5 Flash**, and **Vector Search**.

---

## 🔗 Live Demo
**Check out the live application here:** (https://enterprisesop.netlify.app/)

---

## ✨ Key Features
* **Intelligent Q&A:** Ask complex questions about company policies, onboarding procedures, and compliance guidelines.
* **Retrieval-Augmented Generation (RAG):** Grounded responses based *only* on your uploaded enterprise data, eliminating AI hallucinations.
* **Blazing Fast AI:** Powered by Google's latest **Gemini 2.5 Flash** model for low-latency, high-reasoning generation.
* **Semantic Search:** Utilizes **Gemini embedding-001** to convert SOP documents into high-dimensional vectors, stored and queried using Vector Search (e.g., MongoDB Atlas Vector Search).
* **Modern UI/UX:** Built with React for a seamless, chat-like user experience.
* **Full-Stack MERN:** Robust Node.js/Express backend managing document ingestion, chunking, and API orchestrations with MongoDB for scalable database management.

---

## 🏗️ Architecture Flow
1. **Document Ingestion:** Enterprise SOPs (PDFs, Markdown, Text) are uploaded via the React frontend.
2. **Chunking & Embedding:** The Node backend splits documents into chunks and generates embeddings using the `models/embedding-001` API.
3. **Vector Storage:** Embeddings are stored in the Vector Database alongside metadata.
4. **User Query:** User asks a question in the UI. The question is embedded.
5. **Vector Search:** A similarity search retrieves the top-$K$ most relevant SOP chunks.
6. **LLM Generation:** The retrieved context + user query are passed to `gemini-2.5-flash` to synthesize a precise, context-aware answer.

---

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS (or your preferred UI library)
* **Backend:** Node.js, Express.js
* **Database & Vector Store:** MongoDB / MongoDB Atlas Vector Search
* **LLM:** Google Gemini 2.5 Flash (`gemini-2.5-flash`)
* **Embedding Model:** Google Gemini Embedding 001 (`models/embedding-001`)

---

