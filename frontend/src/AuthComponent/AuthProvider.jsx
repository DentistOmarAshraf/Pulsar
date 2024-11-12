import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : {};
  });

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
      localStorage.setItem("token", user.token);
      axios
        .get("http://localhost:5001/user/me")
        .then((response) => setUser((prev) => ({ ...prev, ...response.data })))
        .catch(() => {
          setUser({});
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        });
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [user?.token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(UserContext);
};

export default AuthProvider;
