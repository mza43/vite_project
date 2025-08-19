// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// -------------------- LOGIN --------------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/auth/login`, credentials);
      const token = res.data?.data?.token?.value;
      if (token) localStorage.setItem("token", token);
      return res.data; // { status, message, data: { user, token } }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// -------------------- REGISTER --------------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/auth/register`, formData);
      const token = res.data?.data?.token?.value;
      if (token) localStorage.setItem("token", token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// -------------------- CURRENT USER --------------------
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// -------------------- SLICE --------------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || null;
        state.token = localStorage.getItem("token");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || null;
        state.token = localStorage.getItem("token");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
