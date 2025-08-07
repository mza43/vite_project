import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch Categories
export const fetchCategories = createAsyncThunk("categories/fetch", async () => {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data.data;
});

// Create Category
export const createCategory = createAsyncThunk("categories/create", async (category) => {
  const res = await axios.post(`${API_URL}/categories`, {
    title: category.title,
    description: category.description,
  });
  return res.data.data;
});

// Update Category
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, category }) => {
    const res = await axios.put(`${API_URL}/categories/${id}`, {
      title: category.title,
      description: category.description,
    });
    return res.data.data;
  }
);

// Delete Category
export const deleteCategory = createAsyncThunk("categories/delete", async (id) => {
  await axios.delete(`${API_URL}/categories/${id}`);
  return id;
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
