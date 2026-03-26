import React, { useEffect, useState } from "react";

const App = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchApi = async () => {
      try {
        const response = await fetch("http://localhost:3001/chat/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        console.log('Api Data: ',data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchApi();
  }, [query]);
  return (
    <div>
      <input
        type="text"
        placeholder="Type Here.."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default App;
