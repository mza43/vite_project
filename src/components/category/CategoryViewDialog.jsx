// src/components/category/CategoryViewDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const CategoryViewDialog = ({ open, onClose, category }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Category Details</DialogTitle>
      <DialogContent dividers>
        {category ? (
          <>
            <Typography sx={{ mb: 1.5 }}>
              <strong>Title:</strong> {category.title}
            </Typography>
            <Typography>
              <strong>Description:</strong> {category.description}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No category selected.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryViewDialog;
