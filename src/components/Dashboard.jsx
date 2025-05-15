import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ user }) => {
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [message, setMessage] = useState("");
  const [voteLoading, setVoteLoading] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const positionsResponse = await axios.get(
          "https://bsc-old-boys-election.onrender.com/positions"
        );
        setPositions(positionsResponse.data);
        if (positionsResponse.data.length > 0) {
          setSelectedPosition(positionsResponse.data[0].name);
        }
      } catch (err) {
        setMessage("Failed to load positions");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPosition) {
      const fetchCandidates = async () => {
        try {
          const response = await axios.get(
            `https://bsc-old-boys-election.onrender.com/candidates/position/${selectedPosition}`
          );
          setCandidates(response.data);
        } catch (err) {
          setMessage("Failed to load candidates");
        }
      };
      fetchCandidates();
    }
  }, [selectedPosition]);

  const handleVote = async (candidateId) => {
    setVoteLoading((prev) => ({ ...prev, [candidateId]: true }));
    try {
      const response = await axios.post(
        `https://bsc-old-boys-election.onrender.com/vote?candidate_id=${encodeURIComponent(
          candidateId
        )}&position=${encodeURIComponent(selectedPosition)}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            accept: "application/json",
          },
        }
      );
      setMessage(response.data.msg || "Vote recorded successfully");
    } catch (err) {
      console.error("Vote error:", err.response?.data);
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          const errorMessages = err.response.data.detail
            .map((error) => error.msg)
            .join(", ");
          setMessage(errorMessages || "Failed to record vote");
        } else {
          setMessage(err.response.data.detail || "Failed to record vote");
        }
      } else {
        setMessage("Failed to record vote");
      }
    } finally {
      setVoteLoading((prev) => ({ ...prev, [candidateId]: false }));
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Welcome, {user.username}
      </h2>
      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes("success") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Select Position
        </label>
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {positions.map((pos) => (
            <option key={pos.name} value={pos.name}>
              {pos.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {candidates.map((candidate) => (
          <div
            key={candidate._id}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
          >
            <img
              src={candidate.image_url}
              alt={candidate.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg sm:text-xl font-semibold">
              {candidate.name}
            </h3>
            <p className="text-gray-600">{candidate.position}</p>
            <button
              onClick={() => handleVote(candidate._id)}
              disabled={voteLoading[candidate._id]}
              className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 flex items-center justify-center"
            >
              {voteLoading[candidate._id] ? (
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : null}
              {voteLoading[candidate._id] ? "Voting..." : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
