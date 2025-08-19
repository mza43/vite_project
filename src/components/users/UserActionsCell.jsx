import React from "react";
import { Button, Box } from "@mui/material";

const UserActionsCell = ({ data, onView, onEdit, onDelete }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "8px",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Button
        size="small"
        variant="outlined"
        color="info"
        onClick={() => onView?.(data)}
      >
        View
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="secondary"
        onClick={() => onEdit?.(data)}
      >
        Edit
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => onDelete?.(data.id)}
      >
        Delete
      </Button>
    </Box>
  );
};

export default UserActionsCell;
