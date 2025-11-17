import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DomesticPackages() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const IMAGE_BASE_URL = "https://demandonsale.com/trav-chap/uploads/location/";
  const API_URL =
    "https://api.codetabs.com/v1/proxy?quest=https://demandonsale.com/trav-chap/api/locations/list";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch packages");
        const result = await res.json();

        if (result.status && Array.isArray(result.data)) {
          setPackages(result.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);
  useEffect(() => {
    const user = localStorage.getItem("travchap_user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="px-4 sm:px-6 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#246e73] mb-10">
        Domestic Packages
      </h2>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 mt-4">
          Error loading packages: {error}
        </p>
      )}

      {!loading && !error && packages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300 group"
            >
              <div className="overflow-hidden">
                <img
                  src={
                    pkg.image
                      ? `${IMAGE_BASE_URL}${pkg.image}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={pkg.name || "Package"}
                  className="h-48 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-center text-lg font-semibold text-gray-800 py-3 border-t px-2 truncate">
                {pkg.name || "Unknown Destination"}
              </h3>
              <div className="p-4 flex flex-col justify-between">
                <button
                  className="mt-4 w-full border border-[#246e73] text-[#246e73] px-4 py-2 rounded-lg font-medium hover:bg-[#246e73] hover:text-white transition"
                  onClick={() =>
                    isLoggedIn
                      ? navigate(`/${pkg.slug}/tour-pakages`)
                      : navigate("/login")
                  }
                >
                  {isLoggedIn ? "View More" : "Login to Check"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && packages.length === 0 && (
        <p className="text-center text-gray-500">No packages found.</p>
      )}
    </div>
  );
}

export default DomesticPackages;
