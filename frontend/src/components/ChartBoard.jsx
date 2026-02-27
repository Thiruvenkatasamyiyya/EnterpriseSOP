import React, { useState, useRef, useEffect } from "react";
import { askQuestion } from "../api/api";

const ChartBoard = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {role : "ai", content: "Hello! How can I assist you today?"}
  ]);
  const messagesEndRef = useRef(null);

  const submit = async () => {
    if (!question.trim()) return;


    const newMessages = [
      ...messages,
      { role: "user", content: question }
    ];
    setMessages(newMessages);
    setQuestion("");


    const res = await askQuestion(question);


    setMessages([
      ...newMessages,
      { role: "ai", content: res.answer }
    ]);
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">

     
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">OpsMind AI</h2>
      </div>

   
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={question}
            className="flex-1 border-2 border-gray-300 p-2 rounded-lg"
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
          />
          <button
            onClick={submit}
            className="bg-blue-500 text-white px-4 rounded-lg"
          >
            Ask
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Terms and Conditions Apply
        </p>
      </div>

    </div>
  );
};

export default ChartBoard;