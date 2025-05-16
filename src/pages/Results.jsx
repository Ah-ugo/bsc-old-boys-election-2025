import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { TrophyIcon } from "@heroicons/react/24/solid";

const Results = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get("/results");
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Failed to load election results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if there are any results
  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Election Results
        </h1>
        <p className="text-blue-300">BSC Old Boys Association</p>
      </div>

      {!hasResults ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600">No results available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(results).map(([position, candidates]) => {
            // Sort candidates by votes (highest first)
            const sortedCandidates = [...candidates].sort(
              (a, b) => b.votes - a.votes
            );
            const winner = sortedCandidates[0];
            const totalVotes = sortedCandidates.reduce(
              (sum, candidate) => sum + candidate.votes,
              0
            );

            return (
              <div
                key={position}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <h2 className="text-xl font-semibold text-white">
                    {position}
                  </h2>
                </div>

                {sortedCandidates.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600">
                      No candidates for this position.
                    </p>
                  </div>
                ) : (
                  <div className="p-6">
                    {/* Winner section */}
                    {totalVotes > 0 && (
                      <div className="mb-6 flex flex-col items-center">
                        <div className="relative mb-4">
                          <img
                            src={
                              winner.image_url ||
                              "/placeholder.svg?height=120&width=120"
                            }
                            alt={winner.name}
                            className="h-32 w-32 rounded-full object-cover border-4 border-yellow-400"
                          />
                          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                            <TrophyIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {winner.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Leading with {winner.votes} votes
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${
                                totalVotes > 0
                                  ? (winner.votes / totalVotes) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {totalVotes > 0
                            ? Math.round((winner.votes / totalVotes) * 100)
                            : 0}
                          % of total votes
                        </p>
                      </div>
                    )}

                    {/* Other candidates */}
                    <div className="space-y-4 mt-6">
                      <h4 className="font-medium text-gray-700 border-b pb-2">
                        All Candidates
                      </h4>
                      {sortedCandidates.map((candidate, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={
                                candidate.image_url ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={candidate.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {candidate.name}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{
                                    width: `${
                                      totalVotes > 0
                                        ? (candidate.votes / totalVotes) * 100
                                        : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {candidate.votes} votes
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t text-center">
                      <p className="text-sm text-gray-500">
                        Total votes: {totalVotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;
