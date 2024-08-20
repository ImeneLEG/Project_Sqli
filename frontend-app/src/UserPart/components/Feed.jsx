import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { SideBar, Videos } from "./index";
import { fetchFromAPI } from "../utils/fetchFromApi";
import MenuIcon from "@mui/icons-material/Menu"; // Import the Menu icon

const Feed = () => {
  const [selectedCategory, setselectedCategory] = useState("New");
  const [sidebarOpen, setSidebarOpen] = useState(true); // Added state for sidebar visibility
const[videos,setVideos]=useState([])
  useEffect(() => {
    fetchFromAPI(`search?part=snippet&q=${selectedCategory}`)
    .then((data)=>setVideos(data.items))
  }, [selectedCategory]);

  // Function to toggle the sidebar state
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
console.log(videos)
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
          <MenuIcon style={{ color: "white", fontSize: "24px" }} /> {/* Use the Menu icon */}
        </button>
      </Box>
      {sidebarOpen && (
        <Box
          sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}
        >
          <SideBar selectedCategory={selectedCategory} setselectedCategory={setselectedCategory} />
          <Typography variant="body2" sx={{ mt: 1.5, color: "#fff", display: {xs: "none", md: "block" } }}>
            Copyright-2024
          </Typography>
        </Box>
      )}
      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: "2" }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
          {selectedCategory}
          <span style={{ color: "red", marginLeft: "5px" }}>Videos</span>
        </Typography>
        <Videos videos={videos} sidebarOpen={sidebarOpen}/>
      </Box>
    </Stack>
  );
};

export default Feed;
