import React, { useState } from "react";

const fetchApi = async (query) => {
  try {
    const response = await fetch("http://localhost:3001/chat/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    console.log("Api Data: ", data);
    return data.assistant;
  } catch (error) {
    console.error("API Error:", error);
  }
};

const App = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  function handleClick() {
    const res = fetchApi(query);
    setResult(res);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1>{result}</h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="Type Here.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleClick}>Generate</button>
      </div>
    </div>
  );
};

export default App;
