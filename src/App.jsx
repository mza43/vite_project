import React from "react";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import CategoriesPage from "./pages/CategoriesPage";
import PostsPage from "./pages/PostsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
//
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) dispatch(fetchCurrentUser());
  }, [token, user, dispatch]);

  console.log("Current path:", window.location.pathname);

  return (
    <Routes>
      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main pages */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/users"
        element={
          <MainLayout>
            <UsersPage />
          </MainLayout>
        }
      />
      <Route
        path="/categories"
        element={
          <MainLayout>
            <CategoriesPage />
          </MainLayout>
        }
      />
      <Route
        path="/posts"
        element={
          <MainLayout>
            <PostsPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default App;
