import React, { useState, useEffect } from "react";
import "./App.css"; // Import the CSS file
import React from 'react';


const AutocompleteComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Initially hide suggestions

  useEffect(() => {
    // Function to fetch suggestions using JSONP
    const fetchSuggestions = (requestTerm) => {
      const script = document.createElement("script");
      script.src = `https://suggestqueries.google.com/complete/search?callback=suggestCallBack&hl=en&ds=yt&jsonp=suggestCallBack&q=${encodeURIComponent(
        requestTerm
      )}&client=youtube`;

      window.suggestCallBack = (data) => {
        const suggestions = data[1].map((val) => ({ value: val[0] }));
        setSuggestions(suggestions.slice(0, 5)); // Limit suggestions to 5 items
      };

      document.body.appendChild(script);
    };

    if (inputValue !== "") {
      fetchSuggestions(inputValue);
      setShowSuggestions(true); // Show suggestions when input is not empty
    } else {
      setSuggestions([]);
      setShowSuggestions(false); // Hide suggestions when input is empty
    }
  }, [inputValue]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSelectSuggestion = (selectedSuggestion) => {
    setInputValue(selectedSuggestion.value);
    setShowSuggestions(false); // Hide suggestions after clicking a suggestion
  };

  return (
    <div>
      <input
        type="text"
        id="search"
        placeholder="luciana zogbi.."
        value={inputValue}
        onChange={handleInputChange}
      />
      {showSuggestions && ( // Only show the suggestion list when showSuggestions is true
        <ul className="suggestion-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteComponent;
