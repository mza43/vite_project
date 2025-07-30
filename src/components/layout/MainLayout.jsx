import React, { useState } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Box from "@mui/material/Box";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Header onMenuClick={handleSidebarToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
