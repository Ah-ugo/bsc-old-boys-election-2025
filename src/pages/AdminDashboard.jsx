import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user?.username}! Manage the BSC Old Boys election from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/candidates" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Candidates
            </h2>
            <p className="text-gray-600">
              Add, edit, or remove candidates for the election.
            </p>
          </div>
        </Link>

        <Link to="/admin/positions" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Positions
            </h2>
            <p className="text-gray-600">
              Create and manage election positions.
            </p>
          </div>
        </Link>

        <Link to="/results" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              View Results
            </h2>
            <p className="text-gray-600">
              Check the current election results and statistics.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
