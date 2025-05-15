import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setIsLoading(true);

    if (!username) {
      setUsernameError("Username is required");
      setIsLoading(false);
      return;
    }
    if (!email) {
      setEmailError("Email is required");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      setIsLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.detail || "Registration failed";
      toast.error(message);
      setUsernameError(message);
      setEmailError(message);
      setPasswordError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-md w-full mx-4 p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl transition-all hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-teal-900 text-center mb-6">
          Create Account
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className={`mt-1 w-full px-4 py-3 border ${
                usernameError ? "border-red-500" : "border-gray-200"
              } rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
            />
            {usernameError && (
              <p className="mt-1 text-sm text-red-600">{usernameError}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Choose a unique username
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className={`mt-1 w-full px-4 py-3 border ${
                emailError ? "border-red-500" : "border-gray-200"
              } rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Enter a valid email address
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`mt-1 w-full px-4 py-3 border ${
                  passwordError ? "border-red-500" : "border-gray-200"
                } rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-teal-500 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Choose a secure password
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all flex items-center justify-center ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
            ) : null}
            Register
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
