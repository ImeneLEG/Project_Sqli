import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { SideBar, Videos } from "./index";
import MenuIcon from "@mui/icons-material/Menu";
import { useParams, useNavigate } from "react-router-dom";
import { getTrendingVideos } from "../../services/videoService"; // Assurez-vous d'avoir la bonne méthode pour récupérer les vidéos basées sur le terme de recherche




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


  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle redirection when a sidebar category is clicked
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/search/${category}`);
  };



// Nouvelle méthode pour récupérer des vidéos en utilisant votre backend


    useEffect(() => {
        if (searchTerm) {
            getTrendingVideos(searchTerm)
                .then((data) => setSearchVideos(data)) // Assurez-vous que les données reçues sont sous la forme attendue par votre composant
                .catch((error) => console.error("Error fetching search videos:", error));
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
