import React, { useState, useEffect } from "react";
import axios from "axios";

const Results = () => {
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "https://bsc-old-boys-election.onrender.com/results"
        );
        setResults(response.data);
      } catch (err) {
        console.error("Failed to load results");
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Election Results</h2>
      {Object.keys(results).map((position) => (
        <div key={position} className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">{position}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results[position].map((candidate) => (
              <div
                key={candidate.name}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <img
                  src={candidate.image_url}
                  alt={candidate.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h4 className="text-xl font-semibold">{candidate.name}</h4>
                <p className="text-gray-600">Votes: {candidate.votes}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Results;
