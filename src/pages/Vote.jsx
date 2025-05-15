import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function Vote() {
  const [candidatesByPosition, setCandidatesByPosition] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activePosition, setActivePosition] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "https://bsc-old-boys-election.onrender.com/candidates"
        );
        // Group candidates by position
        const grouped = response.data.reduce((acc, candidate) => {
          const pos = candidate.position || "Other";
          acc[pos] = acc[pos] || [];
          acc[pos].push(candidate);
          return acc;
        }, {});
        setCandidatesByPosition(grouped);
        // Set the first position as active
        const firstPosition = Object.keys(grouped)[0];
        setActivePosition(firstPosition);
      } catch (error) {
        toast.error("Failed to fetch candidates");
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  const handleVote = async (candidateId) => {
    setIsLoading(true);
    console.log(localStorage.getItem("token"));
    try {
      await axios.post(
        "https://bsc-old-boys-election.onrender.com/vote",
        { candidateId: String(candidateId) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Vote submitted successfully");
    } catch (error) {
      let message = "Failed to submit vote";
      if (error.response?.status === 422) {
        // Handle validation errors
        const details = error.response.data.detail;
        message = Array.isArray(details)
          ? details.map((d) => d.msg).join(", ")
          : details || message;
      } else if (error.response?.data?.detail) {
        message = error.response.data.detail;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 mb-8 text-center">
          Cast Your Vote
        </h1>
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(candidatesByPosition).map((position) => (
              <button
                key={position}
                onClick={() => setActivePosition(position)}
                className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                  activePosition === position
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-teal-900 hover:bg-teal-100"
                }`}
              >
                {position}
              </button>
            ))}
          </div>
          {activePosition && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {candidatesByPosition[activePosition].map((candidate) => (
                <div
                  key={candidate._id}
                  className="bg-white/90 p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:scale-105"
                >
                  <h2 className="text-xl font-semibold text-teal-900 mb-2">
                    {candidate.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Position: {candidate.position}
                  </p>
                  {candidate.imageUrl && (
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <button
                    onClick={() => handleVote(candidate._id)}
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
                    Vote
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vote;
