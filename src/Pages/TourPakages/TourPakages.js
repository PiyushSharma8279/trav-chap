import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TourPackages() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [locationData, setLocationData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState(null);

  const IMAGE_BASE_URL = "https://demandonsale.com/trav-chap/";
  const HOME_IMAGE_BASE_URL =
    "https://demandonsale.com/trav-chap/uploads/location/";

  // 🧩 Fetch data
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const API_URL = `https://api.codetabs.com/v1/proxy?quest=https://demandonsale.com/trav-chap/api/locations/${category}`;
        const res = await fetch(API_URL, { signal: controller.signal });

        if (!res.ok) throw new Error("Failed to fetch data");

        const result = await res.json();
        if (result.status && result.data) {
          const { location, packages } = result.data;
          setLocationData(location);
          setPackages(packages || []);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [category]);

  // 🧭 Intersection Observer for active section highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: 0.3 }
    );

    Object.values(sectionRefs.current).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [packages]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 font-medium">Loading...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10 font-semibold">{error}</p>
    );

  if (!locationData) return null;

  const groupedPackages = packages.reduce((acc, pkg) => {
    const duration = pkg.duration || "Others";
    if (!acc[duration]) acc[duration] = [];
    acc[duration].push(pkg);
    return acc;
  }, {});

  const sections = Object.keys(groupedPackages).map((duration, index) => ({
    id: `sec${index + 1}`,
    label: duration,
    packages: groupedPackages[duration],
  }));

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative w-full h-60 md:h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${HOME_IMAGE_BASE_URL}${locationData.image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <h2 className="relative text-center text-white font-bold text-2xl md:text-4xl px-4 py-2 rounded-lg">
          {locationData.name} PACKAGES
        </h2>
      </div>

      {/* About Section */}
      <div className="p-4 shadow-md m-4 md:m-6 bg-white rounded-lg">
        <h2 className="text-xl md:text-2xl font-bold py-2">
          About {locationData.name}
        </h2>
        <p
          className="text-sm md:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: locationData.description }}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row mt-10 px-4 md:px-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-1/4 sticky top-24 h-fit bg-white shadow-md rounded-lg p-4">
          <h2 className="font-bold text-lg mb-3">PACKAGES</h2>
          <ul className="space-y-2 text-gray-700 font-medium">
            {sections.map((s) => (
              <li
                key={s.id}
                className={`cursor-pointer rounded p-1 ${
                  activeSection === s.id ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => {
                  sectionRefs.current[s.id]?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {s.label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile Scroll Tabs */}
        <div className="md:hidden sticky top-20 z-20 bg-white shadow-md overflow-x-auto whitespace-nowrap flex gap-4 px-4 py-2">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`px-3 py-1 rounded-full text-sm ${
                activeSection === s.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => {
                sectionRefs.current[s.id]?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <main className="w-full md:w-3/4 md:ml-6 space-y-12 mt-4 md:mt-0">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              ref={(el) => (sectionRefs.current[s.id] = el)}
              className="space-y-6 scroll-mt-24"
            >
              <h2 className="text-center font-bold text-lg md:text-xl p-2">
                <span className="text-blue-600">{s.label}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {s.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="border rounded-lg shadow hover:shadow-lg transition hover:scale-[1.02] bg-white p-3 md:p-4 cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={
                          pkg.image
                            ? `${IMAGE_BASE_URL}${pkg.image}`
                            : "https://via.placeholder.com/400x250"
                        }
                        alt={pkg.title}
                        className="w-full h-36 md:h-40 object-cover rounded-md"
                      />
                    </div>

                    <h3 className="text-center md:text-lg font-semibold mt-3">
                      {pkg.type} PACKAGE
                    </h3>
                    <h3 className="text-base md:text-lg font-semibold mt-3">
                      {pkg.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      Code: {pkg.package_code}
                    </p>

                    <div className="flex flex-wrap gap-2 md:gap-3 text-gray-600 mt-3 text-[11px] md:text-[12px]">
                      <span>🍽 Meal</span>
                      <span>🏨 Hotel</span>
                      <span>🚗 Transport</span>
                      <span>👓 Sightseeing</span>
                    </div>

                    <h4 className="text-blue-600 font-bold text-lg md:text-xl mt-1">
                      ₹{pkg.price}/-
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500">
                      Per Person
                    </p>

                    <button
                      className="mt-3 md:mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm md:text-base"
                      onClick={() => navigate(`/package/${pkg.package_code}`)} // ✅ FIXED
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </>
  );
}

export default TourPackages;
