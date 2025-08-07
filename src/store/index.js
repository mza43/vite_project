import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import categoriesReducer from "./categoriesSlice";
import postsReducer from "./postsSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
    posts: postsReducer,
  },
});

export default store;
