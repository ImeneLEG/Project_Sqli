import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, IconButton, Button } from '@mui/material';
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
    // Function to fetch suggestions using JSONP
    const fetchSuggestions = (requestTerm) => {
      const script = document.createElement('script');
      script.src = `https://suggestqueries.google.com/complete/search?callback=suggestCallBack&hl=en&ds=yt&jsonp=suggestCallBack&q=${encodeURIComponent(
        requestTerm
      )}&client=youtube`;

      window.suggestCallBack = (data) => {
        const suggestions = data[1].map((val) => ({ value: val[0] }));
        setSuggestions(suggestions.slice(0, 7)); // Limit suggestions to 5 items
      };

      document.body.appendChild(script);
    };

    if (inputValue !== '') {
      fetchSuggestions(inputValue);
      setShowSuggestions(true); // Show suggestions when input is not empty
    } else {
      setSuggestions([]);
      setShowSuggestions(false); // Hide suggestions when input is empty
    }
  }, [inputValue]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setsearchTerm(event.target.value);
  };

  const handleSelectSuggestion = (selectedSuggestion) => {
    setInputValue(selectedSuggestion.value);
    setsearchTerm(selectedSuggestion.value); // Update searchTerm with the selected suggestion
    setShowSuggestions(false); 
    
    // Hide suggestions after clicking a suggestion
  };


  return (
    <Paper
      component='form'
      onSubmit={handleSubmit}
      sx={{
        borderRadius: 20,
        border: '1px solid #e3e3e3',
        pl: 2,
        boxShadow: 'none',
        mr: { md: 5 },
        maxWidth: { xs: '100%', sm: '300px', md: '500px' },
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center', // Center the items vertically
        justifyContent: 'space-between',
         // Align the items horizontally
         // Ensure the container expands to full width
      }}
    ><div style={{ position: 'relative',margintop:'100px', }}>
      <input
        className='search-bar'
        placeholder='Search..'
        value={inputValue} // Use 'inputValue' instead of 'searchTerm'
        onChange={handleInputChange}
        style={{ 
         
          fontSize: '20px'}} // Use the combined handler
        sx={{
          flex: '1',
          
           // Allow the input to fill the remaining space
           fontSize: { xs: '14px', sm: '16px', md: '20px' },
           fontWeight:'bold',
           fontFamily: 'Arial',
          border: 'none', // Remove the border to prevent misalignment on xs devices
          outline: 'none', // Remove the outline on focus
          backgroundColor: 'transparent', // Ensure the background is transparent
        }}
      />
      
      
        {showSuggestions && (
          <ul
            className='suggestion-list'
            style={{
              listStyleType: 'none',
              padding: 0,
              marginTop: '20px',
              marginRight:'140px',
              position: 'absolute',
              backgroundColor: '#fff',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              zIndex: 1,
              width: '100%',
              color:'red',
              fontWeight:'bold',
              fontFamily: 'Arial',
              
            }}
          >
            {suggestions.map((suggestion, index) => (
              <li type='submit'
                key={index}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: index === suggestions.length - 1 ? 'none' : '1px solid #e3e3e3',
                }}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.value}
                
              </li>
              
            ))}
           <li style={{ textAlign: 'center',backgroundColor: '#f00',cursor: 'pointer',  }} onClick={hideSuggestions}>
              <div>
                <button
                  onClick={hideSuggestions}
                  style={{
                    backgroundColor: '#f00',
                    color: '#fff',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                  type='button'
                >
                  Clear All
                </button>
              </div>
              </li>
          </ul>
        )}
      </div>


      <IconButton type='submit' sx={{ p: '10px', color: 'red' }}>
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
