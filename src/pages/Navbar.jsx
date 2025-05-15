import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-teal-900">
            Voting App
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-teal-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/results"
              className="text-gray-700 hover:text-teal-500 transition-colors"
            >
              Results
            </Link>
            {user ? (
              <>
                <Link
                  to="/vote"
                  className="text-gray-700 hover:text-teal-500 transition-colors"
                >
                  Vote
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-teal-500 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="py-1 px-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-teal-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-1 px-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
              className="block text-gray-700 hover:text-teal-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/results"
              className="block text-gray-700 hover:text-teal-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Results
            </Link>
            {user ? (
              <>
                <Link
                  to="/vote"
                  className="block text-gray-700 hover:text-teal-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Vote
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-gray-700 hover:text-teal-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full py-1 px-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-teal-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-1 px-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
