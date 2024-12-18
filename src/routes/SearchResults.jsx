import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiRequest } from "../utils/api";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiRequest(`/search?q=${query}`, "GET", null, token);
        setResults(response);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-gray-600">{query}</span>
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((result) => (
            <div
              key={result._id}
              className="p-6 bg-white shadow-md rounded-md hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-black">{result.title}</h2>
              <p className="text-gray-600">{result.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results found for your query.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
