import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as postsApi from "../api/postApi";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  return await postsApi.fetchPosts();
});

export const createPost = createAsyncThunk("posts/createPost", async (post) => {
  return await postsApi.createPost(post); // returns { message, data }
});

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, post }) => {
    return await postsApi.updatePost(id, post); // returns { message, data }
  }
);

export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  return await postsApi.deletePost(id); // returns { message, id }
});

const postsSlice = createSlice({
  name: "posts",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.list.push(action.payload.data);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.list.findIndex((p) => p.id === updated.id);
        if (index !== -1) state.list[index] = updated;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.list = state.list.filter((p) => p.id !== deletedId);
      });
  },
});

export default postsSlice.reducer;
