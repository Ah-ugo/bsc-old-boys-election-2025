import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "https://bsc-old-boys-election.onrender.com/candidates"
        );
        setCandidates(response.data);
      } catch (error) {
        toast.error("Failed to fetch candidates");
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name) {
      toast.error("Candidate name is required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(
        "https://bsc-old-boys-election.onrender.com/candidates",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCandidates([...candidates, response.data]);
      setName("");
      setImage(null);
      toast.success("Candidate added successfully");
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to add candidate";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 mb-8 text-center">
          Admin Dashboard
        </h1>
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 transition-all hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-teal-900 mb-4">
            Add Candidate
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Candidate Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter candidate name"
                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Candidate Image
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            <button
              type="submit"
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
              Add Candidate
            </button>
          </form>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-teal-900 mb-4">
            Candidates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="p-4 bg-gray-50/50 rounded-lg shadow-sm transition-all hover:shadow-md hover:scale-105"
              >
                <h3 className="text-lg font-medium text-teal-900">
                  {candidate.name}
                </h3>
                {candidate.imageUrl && (
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    className="mt-2 w-full h-32 object-cover rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
