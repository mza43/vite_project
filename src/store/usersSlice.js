import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch Users 
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 1, limit = 20, search = "", sortField = "id", sortOrder = "asc" } = {}) => {
    const res = await axios.post(`${API_URL}/users`, {
      page,
      limit,
      search,
      sortField,
      sortOrder,
    });
    return {
      list: res.data.data,
      meta: res.data.meta,
    };
  }
);


// Create User
export const createUser = createAsyncThunk("users/createUser", async (user) => {
  const res = await axios.post(`${API_URL}/users/create`, user); // renamed to /create to avoid conflict
  return res.data.data;
});

// Update User
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }) => {
    const res = await axios.put(`${API_URL}/users/${id}`, user);
    return res.data.data;
  }
);

// Delete User
export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  await axios.delete(`${API_URL}/users/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    meta: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.meta = action.payload.meta;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // insert at beginning
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
