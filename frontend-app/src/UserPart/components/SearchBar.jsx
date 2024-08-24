import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = () => {
  const [searchTerm, setsearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`search/${searchTerm}`);
      setsearchTerm('');
      setShowSuggestions(false); 
    }
  };

  const hideSuggestions = () => {
    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchSuggestions = (requestTerm) => {
      const script = document.createElement('script');
      script.src = `https://suggestqueries.google.com/complete/search?callback=suggestCallBack&hl=en&ds=yt&jsonp=suggestCallBack&q=${encodeURIComponent(
        requestTerm
      )}&client=youtube`;

      window.suggestCallBack = (data) => {
        const suggestions = data[1].map((val) => ({ value: val[0] }));
        setSuggestions(suggestions.slice(0, 7));
      };

      document.body.appendChild(script);
    };

    if (inputValue !== '') {
      fetchSuggestions(inputValue);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setsearchTerm(event.target.value);
  };

  const handleSelectSuggestion = (selectedSuggestion) => {
    setInputValue(selectedSuggestion.value);
    setsearchTerm(selectedSuggestion.value);
    setShowSuggestions(false); 
  };

  return (
    <Paper
      component='form'
      onSubmit={handleSubmit}
      sx={{
        borderRadius: '20px',
        border: '1px solid #e3e3e3',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        maxWidth: { xs: '90%', sm: '300px', md: '500px' },
        margin: '0 auto',
        position: 'relative', // Added for suggestion list positioning
      }}
    >
      <input
        placeholder='Search...'
        value={inputValue}
        onChange={handleInputChange}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          padding: '10px',
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          borderRadius: '20px',
        }}
      />
      {showSuggestions && (
        <ul
          style={{
            listStyleType: 'none',
            padding: 0,
            margin: '5px 0 0',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            zIndex: 10,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: index === suggestions.length - 1 ? 'none' : '1px solid #e3e3e3',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              {suggestion.value}
            </li>
          ))}
          {suggestions.length > 0 && (
            <li style={{ textAlign: 'center' }}>
              <button
                onClick={hideSuggestions}
                style={{
                  backgroundColor: '#f00',
                  color: '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  width: '100%',
                }}
                type='button'
              >
                Clear All
              </button>
            </li>
          )}
        </ul>
      )}
      <IconButton type='submit' sx={{ p: '10px', color: '#f00' }}>
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
