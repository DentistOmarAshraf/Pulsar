import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from "axios";

function ProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: location } });
    }
  }, [token, location, navigate]);
  return token ? <Outlet /> : null;
}

export default ProtectedRoute;
