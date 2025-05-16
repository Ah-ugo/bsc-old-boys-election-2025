import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu on click outside
  const handleOutsideClick = (e) => {
    if (
      isOpen &&
      !e.target.closest(".navbar-menu") &&
      !e.target.closest(".hamburger")
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  return (
    <nav className="bg-white z-[50000] p-4 shadow-lg sticky top-0">
      <div className="container mx-auto z-[50000] flex justify-between items-center">
        <Link
          to="/"
          className="text-gold-200 text-lg sm:text-xl lg:text-2xl font-bold hover:text-gold-100 transition-all duration-200 flex items-center gap-2"
          aria-label="Voting App Home"
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          Voting App
        </Link>
        <button
          onClick={toggleMenu}
          className="sm:hidden text-black focus:outline-none hamburger"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        <div
          className={`navbar-menu absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:bg-white transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"
          } sm:flex sm:items-center overflow-hidden sm:overflow-visible`}
        >
          <div className="flex flex-col sm:flex-row sm:space-x-6 p-4 sm:p-0">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-black text-sm sm:text-base lg:text-lg hover:text-gold-300 py-2 sm:py-0 hover:scale-105 transition-all duration-200 ${
                    location.pathname === "/dashboard"
                      ? "border-b-2 border-gold-400"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/results"
                  className={`text-black text-sm sm:text-base lg:text-lg hover:text-gold-300 py-2 sm:py-0 hover:scale-105 transition-all duration-200 ${
                    location.pathname === "/results"
                      ? "border-b-2 border-gold-400"
                      : ""
                  }`}
                >
                  Results
                </Link>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className={`text-black text-sm sm:text-base lg:text-lg hover:text-gold-300 py-2 sm:py-0 hover:scale-105 transition-all duration-200 ${
                      location.pathname === "/admin"
                        ? "border-b-2 border-gold-400"
                        : ""
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    navigate("/login");
                  }}
                  className="text-black text-sm sm:text-base lg:text-lg hover:text-gold-300 py-2 sm:py-0 hover:scale-105 transition-all duration-200 text-left bg-teal-600 sm:bg-teal-600 sm:px-4 sm:rounded-md sm:hover:bg-teal-500 sm:transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-black text-sm sm:text-base lg:text-lg hover:text-gold-300 py-2 sm:py-0 hover:scale-105 transition-all duration-200 ${
                    location.pathname === "/login"
                      ? "border-b-2 border-gold-400"
                      : ""
                  }`}
                >
                  Login
                </Link>
                {/* <Link
                  to="/register"
                  className={`text-black text-sm sm:text-base lg:text-lg hover:text-gold-300 py-2 sm:py-0 hover:scale-105 transition-all duration-200 ${
                    location.pathname === "/register"
                      ? "border-b-2 border-gold-400"
                      : ""
                  }`}
                >
                  Register
                </Link> */}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
