import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://bsc-old-boys-election.onrender.com/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser({ ...response.data, token }))
        .catch(() => {
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.");
        });
    }
  }, []);

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const response = await axios.post(
      "https://bsc-old-boys-election.onrender.com/token",
      formData
    );
    const { access_token, user } = response.data;
    localStorage.setItem("token", access_token);
    setUser({ ...user, token: access_token });
  };

  const register = async (username, email, password) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    const response = await axios.post(
      "https://bsc-old-boys-election.onrender.com/register",
      formData
    );
    const { access_token, user } = response.data;
    localStorage.setItem("token", access_token);
    setUser({ ...user, token: access_token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
