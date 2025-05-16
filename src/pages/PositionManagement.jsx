import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const PositionManagement = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPosition, setNewPosition] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await api.get("/positions");
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast.error("Failed to load positions");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPosition.trim()) {
      toast.error("Please enter a position name");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/positions", { name: newPosition });

      toast.success("Position added successfully");

      // Refresh positions list
      const response = await api.get("/positions");
      setPositions(response.data);

      // Reset form
      setNewPosition("");
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error(error.response?.data?.detail || "Failed to add position");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/admin" className="mr-4">
          <ArrowLeftIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Manage Positions</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Position
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Position Name
              </label>
              <input
                type="text"
                id="position"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., President, Secretary, Treasurer"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Position
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Positions
          </h2>

          {positions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No positions added yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {positions.map((position, index) => (
                <li
                  key={index}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
                      <span className="text-sm font-medium text-blue-800">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-gray-900">{position.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PositionManagement;
