import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl w-full mx-4 p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl text-center transition-all hover:shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4">
          Welcome to Voting App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Cast your vote securely, view real-time results, and make your voice
          heard in our elegant and intuitive platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {!user ? (
            <>
              <Link to="/login">
                <button className="py-3 px-6 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:scale-105">
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button className="py-3 px-6 bg-gray-200 text-teal-900 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:scale-105">
                  Register
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/vote">
                <button className="py-3 px-6 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:scale-105">
                  Vote Now
                </button>
              </Link>
              <Link to="/results">
                <button className="py-3 px-6 bg-gray-200 text-teal-900 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:scale-105">
                  View Results
                </button>
              </Link>
              {user.isAdmin && (
                <Link to="/admin">
                  <button className="py-3 px-6 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:scale-105">
                    Admin Dashboard
                  </button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
