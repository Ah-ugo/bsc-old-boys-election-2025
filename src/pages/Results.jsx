import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "https://bsc-old-boys-election.onrender.com/results"
        );
        setResults(response.data);
      } catch (error) {
        toast.error("Failed to fetch results");
        console.error("Error fetching results:", error);
      }
    };
    fetchResults();
  }, []);

  const data = {
    labels: results.map((result) => result.name),
    datasets: [
      {
        label: "Votes",
        data: results.map((result) => result.votes),
        backgroundColor: "rgba(49, 151, 149, 0.5)",
        borderColor: "rgba(49, 151, 149, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Voting Results", font: { size: 20 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 mb-8 text-center">
          Voting Results
        </h1>
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Results;
