import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const Dashboard = () => {
  const { user } = useAuth();
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [votedPositions, setVotedPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch positions
        const positionsRes = await api.get("/positions");
        setPositions(positionsRes.data);

        // Fetch candidates for each position
        const candidatesData = {};
        for (const position of positionsRes.data) {
          const candidatesRes = await api.get(
            `/candidates/position/${position.name}`
          );
          candidatesData[position.name] = candidatesRes.data;
        }
        setCandidates(candidatesData);

        // Check which positions the user has already voted for
        const resultsRes = await api.get("/results");
        const votedPos = [];

        // This is a workaround since the API doesn't provide a direct way to check voted positions
        // In a real app, you'd have an endpoint to check user's votes
        for (const position of positionsRes.data) {
          try {
            // Try to vote for a non-existent candidate to check if already voted
            // This is just a simulation - in a real app you'd have a proper endpoint
            await api.post("/vote", null, {
              params: {
                candidate_id: "test",
                position: position.name,
              },
            });
          } catch (error) {
            if (
              error.response?.data?.detail === "Already voted for this position"
            ) {
              votedPos.push(position.name);
            }
          }
        }

        setVotedPositions(votedPos);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load voting data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = async (position, candidateId) => {
    setSubmitting({ ...submitting, [position]: true });

    try {
      await api.post("/vote", null, {
        params: {
          candidate_id: candidateId,
          position: position,
        },
      });

      toast.success(`Vote for ${position} recorded successfully!`);
      setVotedPositions([...votedPositions, position]);
    } catch (error) {
      console.error("Voting error:", error);
      toast.error(error.response?.data?.detail || "Failed to record vote");
    } finally {
      setSubmitting({ ...submitting, [position]: false });
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.username}!
        </h1>
        <p className="text-gray-600">
          Cast your vote for the BSC Old Boys election.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/results"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Results
          </Link>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">
            No positions available for voting at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {positions.map((position) => (
            <div
              key={position.name}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <h2 className="text-xl font-semibold text-white">
                  {position.name}
                </h2>
              </div>

              {votedPositions.includes(position.name) ? (
                <div className="p-6 flex flex-col items-center justify-center text-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-lg font-medium text-gray-800">
                    You have already voted for this position
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Thank you for participating in the election
                  </p>
                </div>
              ) : candidates[position.name]?.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600">
                    No candidates available for this position.
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  <div className="space-y-4">
                    {candidates[position.name]?.map((candidate) => (
                      <div
                        key={candidate._id}
                        className={`border rounded-lg p-4 flex items-center space-x-4 cursor-pointer transition-colors ${
                          selectedCandidates[position.name] === candidate._id
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          setSelectedCandidates({
                            ...selectedCandidates,
                            [position.name]: candidate._id,
                          })
                        }
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={
                              candidate.image_url ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={candidate.name}
                            className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-gray-900 truncate">
                            {candidate.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Candidate for {position.name}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div
                            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                              selectedCandidates[position.name] ===
                              candidate._id
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedCandidates[position.name] ===
                              candidate._id && (
                              <svg
                                className="h-4 w-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() =>
                        handleVote(
                          position.name,
                          selectedCandidates[position.name]
                        )
                      }
                      disabled={
                        !selectedCandidates[position.name] ||
                        submitting[position.name]
                      }
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting[position.name] ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Submitting...
                        </span>
                      ) : (
                        "Cast Vote"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
