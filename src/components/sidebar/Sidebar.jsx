import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// Material UI Icons
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import PostAddIcon from "@mui/icons-material/PostAdd";
import InfoIcon from "@mui/icons-material/Info";

const drawerWidth = 240;

// Menu Items (centralized for easy editing)
const menuItems = [
  
  { text: "Home", icon: <HomeIcon /> },
  { text: "Users", icon: <PeopleIcon /> },
  { text: "Categories", icon: <CategoryIcon /> },
  { text: "Posts", icon: <PostAddIcon /> },
  { text: "About", icon: <InfoIcon /> },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
