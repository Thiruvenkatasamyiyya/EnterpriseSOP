export const askQuestion = async (question) => {
  const res = await fetch("http://localhost:3000/api/v1/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  return res.json();
};
