import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import categoriesReducer from "./categoriesSlice";
import postsReducer from "./postsSlice";
import authReducer from "../store/authSlice";


const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
    posts: postsReducer,
    auth: authReducer,

    
  },
});

export default store;
