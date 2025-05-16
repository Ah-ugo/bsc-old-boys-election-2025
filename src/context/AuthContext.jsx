import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get("/users/me");
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await api.post("/token", formData);
      const { access_token } = response.data;

      localStorage.setItem("token", access_token);
      setToken(access_token);

      // Fetch user details
      const userResponse = await api.get("/users/me");
      setUser(userResponse.data);

      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.detail || "Login failed");
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post("/register", null, {
        params: { username, email, password },
      });
      toast.success("Registration successful! Please login.");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.detail || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
