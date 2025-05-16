import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  ArrowLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, positionsRes] = await Promise.all([
          api.get("/candidates"),
          api.get("/positions"),
        ]);
        setCandidates(candidatesRes.data);
        setPositions(positionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.position || !formData.image) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("position", formData.position);
      data.append("image", formData.image);

      await api.post("/candidates", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Candidate added successfully");

      // Refresh candidates list
      const candidatesRes = await api.get("/candidates");
      setCandidates(candidatesRes.data);

      // Reset form
      setFormData({
        name: "",
        position: "",
        image: null,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error(error.response?.data?.detail || "Failed to add candidate");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (candidateId) => {
    setDeleting({ ...deleting, [candidateId]: true });

    try {
      await api.delete(`/candidates/${candidateId}`);
      toast.success("Candidate deleted successfully");

      // Update candidates list
      setCandidates(
        candidates.filter((candidate) => candidate._id !== candidateId)
      );
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error(error.response?.data?.detail || "Failed to delete candidate");
    } finally {
      setDeleting({ ...deleting, [candidateId]: false });
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
        <h1 className="text-2xl font-bold text-gray-800">Manage Candidates</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Add, edit, or remove candidates for the election.
          </p>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Candidate
          </button>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Add New Candidate
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Position
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a position</option>
                    {positions.map((position) => (
                      <option key={position.name} value={position.name}>
                        {position.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Candidate Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
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
                      Saving...
                    </>
                  ) : (
                    "Add Candidate"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {candidates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No candidates added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Candidate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              candidate.image_url ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={candidate.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {candidate.position}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(candidate._id)}
                        disabled={deleting[candidate._id]}
                        className="text-red-600 hover:text-red-900 focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting[candidate._id] ? (
                          <svg
                            className="animate-spin h-5 w-5 text-red-600"
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
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateManagement;
