// src/components/layout/Header.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { logout, fetchCurrentUser } from "../../store/authSlice";

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        {token && (
          <Box display="flex" alignItems="center" gap={2}>
            {loading ? (
              <Typography variant="body2">Loading...</Typography>
            ) : user?.name ? (
              <Typography variant="body1">Hi, {user.name}</Typography>
            ) : null}

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
