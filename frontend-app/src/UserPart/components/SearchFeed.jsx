import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { SideBar, Videos } from "./index";
import MenuIcon from "@mui/icons-material/Menu";
import { useParams, useNavigate } from "react-router-dom";
import { getUserFavoriteVideos } from "../../services/videoService"; // Adjusted import path to match your service

const SearchFeed = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categoryVideos, setCategoryVideos] = useState([]);
  const [searchVideos, setSearchVideos] = useState([]);
  const { searchTerm } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [favoriteVideos, setFavoriteVideos] = useState([]);

  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(true);

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const fetchFavoriteVideos = async () => {
    try {
      const userId = '1'; // Replace this with the actual user ID or fetch it from authentication state.
      const data = await getUserFavoriteVideos(userId);
      setFavoriteVideos(data);
    } catch (error) {
      console.error('Error fetching favorite videos:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCategoryClick = (category) => {
    if (category === 'Favorites') {
      fetchFavoriteVideos(); // Fetch favorite videos when Favorites is clicked
      setSelectedCategory(category);
      navigate(`/favorites`);
    } else {
      setSelectedCategory(category);
      navigate(`/search/${category}`);
    }
  };

  useEffect(() => {
    if (selectedCategory === 'Favorites') {
      fetchFavoriteVideos(); // Ensure favorite videos are fetched when Favorites is the selected category
    } else if (searchTerm && selectedCategory !== searchTerm) {
      fetchFromAPI(`search?part=snippet&q=${selectedCategory}`)
        .then((data) => setCategoryVideos(data.items))
        .catch((error) => console.error("Error fetching category videos:", error));
    } else {
      setSearchVideos([]);
    }
  }, [selectedCategory, searchTerm]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ position: "fixed", left: 16, top: 10, zIndex: 999 }}>
        {selectedCategory === 'Favorites' && (
          <>
            <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
              Favorite Videos
            </Typography>
            <Videos videos={favoriteVideos} sidebarOpen={sidebarOpen} />
          </>
        )}
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
          <SideBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onClick={handleCategoryClick} />
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
                  fontSize: '20px'
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
        {selectedCategory !== 'Favorites' && (
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
