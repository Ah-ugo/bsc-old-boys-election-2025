import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [positionName, setPositionName] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidatePosition, setCandidatePosition] = useState("");
  const [image, setImage] = useState(null);
  const [positions, setPositions] = useState([]);
  const [message, setMessage] = useState("");
  const [createPositionLoading, setCreatePositionLoading] = useState(false);
  const [createCandidateLoading, setCreateCandidateLoading] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          "https://bsc-old-boys-election.onrender.com/positions"
        );
        setPositions(response.data);
        if (response.data.length > 0) {
          setCandidatePosition(response.data[0].name);
        }
      } catch (err) {
        setMessage("Failed to load positions");
      }
    };
    fetchPositions();
  }, []);

  const handleCreatePosition = async (e) => {
    e.preventDefault();
    setCreatePositionLoading(true);
    try {
      await axios.post(
        "https://bsc-old-boys-election.onrender.com/positions",
        { name: positionName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage("Position created successfully");
      setPositionName("");
      // Refresh positions
      const response = await axios.get(
        "https://bsc-old-boys-election.onrender.com/positions"
      );
      setPositions(response.data);
      if (response.data.length > 0 && !candidatePosition) {
        setCandidatePosition(response.data[0].name);
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to create position");
    } finally {
      setCreatePositionLoading(false);
    }
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    if (!candidateName || !candidatePosition || !image) {
      setMessage("All fields are required");
      return;
    }
    setCreateCandidateLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post(
        `https://bsc-old-boys-election.onrender.com/candidates?name=${encodeURIComponent(
          candidateName
        )}&position=${encodeURIComponent(candidatePosition)}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        }
      );
      setMessage("Candidate created successfully");
      setCandidateName("");
      setCandidatePosition(positions[0]?.name || "");
      setImage(null);
    } catch (err) {
      console.error("Create candidate error:", err.response?.data); // Log for debugging
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          // Handle Pydantic validation errors
          const errorMessages = err.response.data.detail
            .map((error) => error.msg)
            .join(", ");
          setMessage(errorMessages || "Failed to create candidate");
        } else {
          // Handle standard error messages
          setMessage(err.response.data.detail || "Failed to create candidate");
        }
      } else {
        setMessage("Failed to create candidate");
      }
    } finally {
      setCreateCandidateLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Admin Panel
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Create Position
          </h3>
          <form onSubmit={handleCreatePosition} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position Name
              </label>
              <input
                type="text"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={createPositionLoading}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 flex items-center justify-center"
            >
              {createPositionLoading ? (
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
              {createPositionLoading ? "Creating..." : "Create Position"}
            </button>
          </form>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Create Candidate
          </h3>
          <form onSubmit={handleCreateCandidate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Candidate Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                value={candidatePosition}
                onChange={(e) => setCandidatePosition(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {positions.length === 0 ? (
                  <option value="" disabled>
                    No positions available
                  </option>
                ) : (
                  positions.map((pos) => (
                    <option key={pos.name} value={pos.name}>
                      {pos.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 block w-full p-2 border rounded-md"
                required
                accept="image/*"
              />
            </div>
            <button
              type="submit"
              disabled={
                createCandidateLoading ||
                !image ||
                !candidateName ||
                !candidatePosition
              }
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 flex items-center justify-center"
            >
              {createCandidateLoading ? (
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
              {createCandidateLoading ? "Creating..." : "Create Candidate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
