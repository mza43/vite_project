import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Header */}
      <Header onMenuClick={handleSidebarToggle} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarToggle} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // adjust for header height
          transition: "margin 0.3s ease", // smooth animation
          marginLeft: isSidebarOpen ? `${drawerWidth}px` : "0", // shift when sidebar opens
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
