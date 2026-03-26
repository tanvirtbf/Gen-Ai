import React, { useState } from "react";

const HomePage = () => {
  const [query, setQuery] = useState("");
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

export default HomePage;

