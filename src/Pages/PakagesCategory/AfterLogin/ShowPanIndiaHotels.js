import React, { useState, useEffect } from "react";
import Sidebar from "../../../Components/Home/Sidebar";
import Header from "../../../Components/Header/Header";
import Footer from "../../../Components/Footer/Footer";
import PanIndia from "../../../Components/Home/Pakages/PanIndia";


function ShowPanIndiaHotels() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  // Hero section slides
  const slides = [
    {
      img: "https://img.freepik.com/free-photo/swimming-pool_74190-1977.jpg?semt=ais_hybrid&w=740&q=80",
      title: "Pan India Hotels",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide change
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 mt-[72px] 
          ${isOpen ? "ml-0 sm:ml-56" : "ml-0 sm:ml-16"}
        `}
      >
        {/* Header */}
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Hero Section */}
        <section>
          <div
            className="w-full h-96 bg-cover bg-center flex items-center justify-center transition-all duration-700"
            style={{
              backgroundImage: `url(${slides[currentSlide].img})`,
            }}
          >
            <h2 className="text-center text-white font-bold text-4xl md:text-5xl px-6 py-2 rounded-lg bg-black/40 shadow-lg">
              {slides[currentSlide].title}
            </h2>
          </div>
        </section>

        {/* Pan India Packages Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <PanIndia/>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Overlay when sidebar is open (on small screens) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 sm:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default ShowPanIndiaHotels;
