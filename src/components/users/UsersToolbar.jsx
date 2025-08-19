
import React from "react";
import { Box, Button, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function UsersToolbar({ searchTerm, onSearch, onAdd }) {
  return (
    <Box display="flex" justifyContent="space-between" mb={2}>
      <TextField
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" onClick={onAdd}>
        Add User
      </Button>
    </Box>
  );
}
