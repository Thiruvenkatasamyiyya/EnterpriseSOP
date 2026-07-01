import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import { useAskQuestionMutation } from "../redux/features/docs";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
const ChartBoard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! How can I assist you today?" },
  ]);
  const messagesEndRef = useRef(null);

  const [askQuestion, { data, error, isLoading }] = useAskQuestionMutation();
  const [open, setOpen] = useState(false);

  const submit = async () => {
    if (!question.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: question },
      { role: "ai", content: "typing..." },
    ];

    setMessages(newMessages);
    setQuestion("");

    try {
      const res = await askQuestion({ question }).unwrap();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", content: res.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", content: "Something went wrong!" },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function validUser() {
    if (!isAuthenticated) toast.error("Login to get access");
  }
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="grid w-[500px] h-[150px] bg-white rounded-xl shadow-2xl p-6 relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid-rows-5 text-center"><p>Login Before Accessing Chat</p></div>
                <div className="grid grid-rows-1 grid-cols-2 gap-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => navigate("/login")}>Log In</button>
                  <button className="bg-gray-300 text-black px-4 py-2 rounded-lg" onClick={() => setOpen(false)}>Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
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
            // disabled={!isAuthenticated}
            className="flex-1 border-2 border-gray-300 p-2 rounded-lg"
            onClick={!isAuthenticated && (() => setOpen(true))}
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
