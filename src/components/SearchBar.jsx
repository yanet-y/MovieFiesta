import React, { useState } from "react";

const SearchBar = ({ onSearch}) => {
  const [input, setInput] = useState(""); 

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = () => {
    onSearch(input); 
    setInput(""); 
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search for movies..."
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
