import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../store/categoriesSlice";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ConfirmDialog from "../components/common/ConfirmDialog";
import NotificationDialog from "../components/common/NotificationDialog";

// Register AG Grid modules
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { list: categories, loading } = useSelector((state) => state.categories);

  // Dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Notification
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Formik setup
  const formik = useFormik({
    initialValues: { title: "", description: "" },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (editId) {
          await dispatch(updateCategory({ id: editId, category: values })).unwrap();
          setNotificationMessage("Category updated successfully!");
        } else {
          await dispatch(createCategory(values)).unwrap();
          setNotificationMessage("Category created successfully!");
        }
        await dispatch(fetchCategories());
        setNotificationOpen(true);
        formik.resetForm();
        handleCloseDialog();
      } catch (err) {
        setNotificationMessage(err?.message || "Something went wrong!");
        setNotificationOpen(true);
      }
    },
  });

  const handleOpenDialog = (category = null) => {
    if (category) {
      formik.setValues({
        title: category.title,
        description: category.description,
      });
      setEditId(category.id);
    } else {
      formik.resetForm();
      setEditId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteCategory(deleteId)).unwrap();
      await dispatch(fetchCategories());
      setNotificationMessage("Category deleted successfully!");
      setNotificationOpen(true);
    } catch (err) {
      setNotificationMessage(err?.message || "Delete failed!");
      setNotificationOpen(true);
    }
    setConfirmOpen(false);
  };

  const handleViewClick = (category) => {
    setSelectedCategory(category);
    setOpenView(true);
  };

  // AG Grid columns
  const columns = [
    { headerName: "ID", field: "id", width: 70 },
    { headerName: "Title", field: "title", flex: 1 },
    { headerName: "Description", field: "description", flex: 2 },
    {
      headerName: "Actions",
      width: 240,
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleViewClick(params.data)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => handleOpenDialog(params.data)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteClick(params.data.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>

      {/* Add Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add Category
      </Button>

      {/* Loader */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="ag-theme-alpine" style={{ width: "100%", borderRadius: "8px" }}>
          <AgGridReact
            rowData={categories}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
            rowHeight={50}
            headerHeight={45}
            domLayout="autoHeight"
            defaultColDef={{
              sortable: true,
              filter: true,
              floatingFilter: true,
            }}
          />
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle>
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
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={formik.touched.description && formik.errors.description}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" color="primary" type="submit">
              {editId ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth>
        <DialogTitle>Category Details</DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <>
              <Typography>Title: {selectedCategory.title}</Typography>
              <Typography>Description: {selectedCategory.description}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />

      {/* Notification Dialog */}
      <NotificationDialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        message={notificationMessage}
      />
    </div>
  );
};

export default CategoriesPage;