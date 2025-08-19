
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  Button,
} from "@mui/material";

const PostFormDialog = ({ open, handleClose, formik, users, categories, editId }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{editId ? "Edit Post" : "Add Post"}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="dense"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="dense"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          {/* User Select */}
          <FormControl fullWidth margin="dense">
            <InputLabel>User</InputLabel>
            <Select
              name="userId"
              value={formik.values.userId}
              onChange={formik.handleChange}
              input={<OutlinedInput label="User" />}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.userId && formik.errors.userId && (
              <Typography color="error" variant="caption">
                {formik.errors.userId}
              </Typography>
            )}
          </FormControl>

          {/* Categories Multi-select */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              name="categoryIds"
              value={formik.values.categoryIds}
              onChange={formik.handleChange}
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) =>
                categories
                  .filter((c) => selected.includes(c.id))
                  .map((c) => c.title)
                  .join(", ")
              }
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  <Checkbox checked={formik.values.categoryIds.includes(c.id)} />
                  <ListItemText primary={c.title} />
                </MenuItem>
              ))}
            </Select>
            {formik.touched.categoryIds && formik.errors.categoryIds && (
              <Typography color="error" variant="caption">
                {formik.errors.categoryIds}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" type="submit">
            {editId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostFormDialog;
