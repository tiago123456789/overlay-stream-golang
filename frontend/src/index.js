import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";

import ReactDOM from "react-dom/client";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SettingPage from "./pages/SettingPage";
import OverlayPage from "./pages/OverlayPage";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/overlay" element={<OverlayPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/settings" element={<SettingPage />} />
        </Route>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
