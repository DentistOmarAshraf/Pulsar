import React from "react";
import ReactDOM from "react-dom/client";
import AuthProvider from "./AuthComponent/AuthProvider";
import Routes from "./index/Routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Routes />
  </AuthProvider>
);
