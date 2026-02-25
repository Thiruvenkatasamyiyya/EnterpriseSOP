import { useState } from "react";
import { askQuestion } from "../api/api";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const submit = async () => {
    const res = await askQuestion(question);
    setAnswer(res.answer);
  };

  return (
    <div>
      <h2>OpsMind AI</h2>
      <input value={question} onChange={e => setQuestion(e.target.value)} />
      <button onClick={submit}>Ask</button>
      <p>{answer}</p>
    </div>
  );
}
