import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import { useAskQuestionMutation } from "../redux/features/docs";

const ChartBoard = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {role : "ai", content: "Hello! How can I assist you today?"}
  ]);
  const messagesEndRef = useRef(null);

  const [askQuestion,{data,error,isLoading}] = useAskQuestionMutation()
  console.log(data,error,isLoading);
  
const submit = async () => {
  if (!question.trim()) return;

  const newMessages = [
    ...messages,
    { role: "user", content: question },
    { role: "ai", content: "typing..." } 
  ];

  setMessages(newMessages);
  setQuestion("");

  try {
    const res = await askQuestion({ question }).unwrap();

    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "ai", content: res.answer }
    ]);
  } catch (err) {
    setMessages((prev)=>[
      ...prev.slice(0,-1),
      { role: "ai", content: "Something went wrong!" }
    ]);
  }
};


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">

     <Header/>

   
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
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