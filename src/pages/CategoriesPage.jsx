// src/pages/CategoriesPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../store/categoriesSlice";
import { Button, Typography, CircularProgress, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import ConfirmDialog from "../components/common/ConfirmDialog";
import NotificationDialog from "../components/common/NotificationDialog";

import CategoriesTable from "../components/category/CategoriesTable";
import CategoryFormDialog from "../components/category/CategoryFormDialog";
import CategoryViewDialog from "../components/category/CategoryViewDialog";
import categoryColumns from "../components/category/categoryColumns";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { list: categories, loading } = useSelector((state) => state.categories);

  // Dialogs & state
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

  // Formik
  const formik = useFormik({
    initialValues: { title: "", description: "" },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (editId) {
          await dispatch(
            updateCategory({ id: editId, category: values })
          ).unwrap();
          setNotificationMessage("Category updated successfully!");
        } else {
          await dispatch(createCategory(values)).unwrap();
          setNotificationMessage("Category created successfully!");
        }
        await dispatch(fetchCategories());
        setNotificationOpen(true);
        formik.resetForm();
        setOpenDialog(false);
      } catch (err) {
        setNotificationMessage(err?.message || "Something went wrong!");
        setNotificationOpen(true);
      }
    },
  });

  // Handlers
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

  // Column defs from separate file
  const columns = categoryColumns({
    onView: handleViewClick,
    onEdit: handleOpenDialog,
    onDelete: handleDeleteClick,
  });

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add Category
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CategoriesTable data={categories} columns={columns} loading={loading} />
      )}

      <CategoryFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        formik={formik}
        editId={editId}
      />

      <CategoryViewDialog
        open={openView}
        onClose={() => setOpenView(false)}
        category={selectedCategory}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />

      <NotificationDialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        message={notificationMessage}
      />
    </div>
  );
};

export default CategoriesPage;
