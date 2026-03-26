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
  } catch (error) {
    console.error("API Error:", error);
  }
};

const App = () => {
  const [query, setQuery] = useState("");

  function handleClick() {
    fetchApi(query);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Type Here.."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleClick}>Generate</button>
    </div>
  );
};

export default App;
