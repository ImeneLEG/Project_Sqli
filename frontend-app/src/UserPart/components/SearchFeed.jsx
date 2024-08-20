import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { SideBar, Videos } from "./index";
import { fetchFromAPI } from "../utils/fetchFromApi";
import MenuIcon from "@mui/icons-material/Menu";
import { useParams, useNavigate } from "react-router-dom";

const SearchFeed = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categoryVideos, setCategoryVideos] = useState([]);
  const [searchVideos, setSearchVideos] = useState([]);
  const { searchTerm } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("New"); // State for the selected category
  const navigate = useNavigate();

  const [showSuggestions, setShowSuggestions] = useState(true);

  // Function to toggle the suggestions visibility
  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  useEffect(() => {
    // Fetch videos based on the selected category only if a searchTerm exists.
    if (searchTerm && selectedCategory !== searchTerm) {
      fetchFromAPI(`search?part=snippet&q=${selectedCategory}`)
        .then((data) => setCategoryVideos(data.items))
        .catch((error) => console.error("Error fetching category videos:", error));
    } else {
      // Reset the searchVideos state when a sidebar category is clicked
      setSearchVideos([]);
    }
  }, [searchTerm, selectedCategory]);

  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle redirection when a sidebar category is clicked
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/search/${category}`);
  };

  useEffect(() => {
    // Fetch search results when the searchTerm changes
    if (searchTerm) {
      fetchFromAPI(`search?part=snippet&q=${searchTerm}`)
        .then((data) => {
          setSearchVideos(data.items);
        })
        .catch((error) => console.error("Error fetching search results:", error));
    }
  }, [searchTerm]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ position: "fixed", left: 16, top: 10, zIndex: 999 }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: "black",
            border: "none",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <MenuIcon style={{ color: "white", fontSize: "24px" }} />
        </button>
      </Box>
      {sidebarOpen && (
        <Box
          sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}
        >
          <SideBar selectedCategory={selectedCategory} setselectedCategory={setSelectedCategory} onClick={handleCategoryClick}/>
          <Typography variant="body2" sx={{ mt: 1.5, color: "#fff", display: { xs: "none", md: "block" } }}>
            Copyright-2024
          </Typography>
        </Box>
      )}
      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: "2" }}>
      {searchTerm && (
          <React.Fragment>
            <Box sx={{ textAlign: "left", mt: -2, mb: 2 }}>
              <button
                onClick={toggleSuggestions}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "red",
                  fontSize:'20px'
                }}
              >
                {showSuggestions ? "Hide Results" : "Show Results"}
              </button>
            </Box>
            {showSuggestions && (
              <React.Fragment>
                <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
                  Search Results for <span style={{ color: "#FC1503" }}>{searchTerm}</span> videos
                </Typography>
                <Videos videos={searchVideos} sidebarOpen={sidebarOpen} />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        
        {searchTerm && (
          <React.Fragment>
            <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
              {selectedCategory}
              <span style={{ color: "red", marginLeft: "5px" }}>Videos</span>
            </Typography>
            <Videos videos={categoryVideos} sidebarOpen={sidebarOpen} />
          </React.Fragment>
        )}

        
      </Box>
    </Stack>
  );
};

export default SearchFeed;
