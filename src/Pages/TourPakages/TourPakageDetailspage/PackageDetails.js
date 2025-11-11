import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PackageDetails() {
  const { slug } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [bookingData, setBookingData] = useState({
    package_code: "",
    first_guest_name: "",
    total_persons: "",
    check_in_date: "",
    check_out_date: "",
    extra_bed: "",
    child_without_bed: "",
    meal_plan: "",
    mobile_no: "",
    additional_info: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const IMAGE_BASE_URL = "https://demandonsale.com/trav-chap/";

  // ✅ Fetch package details
  useEffect(() => {
    const controller = new AbortController();

    const fetchPackage = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://api.codetabs.com/v1/proxy?quest=https://demandonsale.com/trav-chap/api/package/${slug}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const result = await res.json();
        console.log("✅ Fetched package:", result);

        if (result && typeof result === "object" && result.title) {
          setPackageData(result);
          setBookingData((prev) => ({
            ...prev,
            package_code: result.package_code || "",
          }));
        } else {
          console.error("Unexpected API structure:", result);
          throw new Error("Invalid API response structure");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();

    return () => controller.abort();
  }, [slug]);

  // ✅ Handle form inputs
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResponseMsg("");

    try {
      const formData = new FormData();
      Object.entries(bookingData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await fetch("https://demandonsale.com/trav-chap/api/booking", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setResponseMsg("✅ Booking submitted successfully!");
        setBookingData({
          package_code: "",
          first_guest_name: "",
          total_persons: "",
          check_in_date: "",
          check_out_date: "",
          extra_bed: "",
          child_without_bed: "",
          meal_plan: "",
          mobile_no: "",
          additional_info: "",
        });
      } else {
        setResponseMsg(result.message || "❌ Booking failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setResponseMsg("⚠️ Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600 font-medium">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10 font-semibold">{error}</p>;
  if (!packageData) return null;

  const {
    title,
    price,
    image,
    category,
    type,
    description,
    meta_title,
    meta_description,
    day_details,
    inclusion,
    exclusion,
    note,
    addtional_charge,
    booking_payment_policy,
    booking_cancellation_policy,
    booking_validity,
    person_2,
    person_4,
    person_6,
    extra_bed,
    child_no_bed,
    hotels,
  } = packageData;

  return (
    <div className="pb-10">
      {/* Hero Section */}
      <div
        className="relative w-full h-60 md:h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${IMAGE_BASE_URL}${image})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative text-center text-white px-4 py-2">
          <h2 className="font-bold text-2xl md:text-4xl">{title}</h2>
          <p className="text-sm md:text-base mt-1 uppercase">
            {category} • {type}
          </p>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {/* Meta Info */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold">{meta_title}</h3>
          <div
            className="text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: meta_description }}
          />
        </div>

        {/* Short Description */}
        <div
          className="text-gray-700 mb-6"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Info Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Hotel Name</th>
                <th className="border p-2">Star Rating</th>
                <th className="border p-2">Room Type</th>
                <th className="border p-2">Meal Plan</th>
              </tr>
            </thead>
            <tbody>
              {hotels?.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-100">
                  <td className="border p-2">1 Night</td>
                  <td className="border p-2">{hotel.hotel_name}</td>
                  <td className="border p-2">{hotel.hotel_star}-Star</td>
                  <td className="border p-2">{type}</td>
                  <td className="border p-2">Breakfast & Dinner</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Package Cost</th>
                <th className="border p-2">2 Person</th>
                <th className="border p-2">4 Person</th>
                <th className="border p-2">6 Person</th>
                <th className="border p-2">Extra Bed</th>
                <th className="border p-2">Child Without Bed</th>
                <th className="border p-2">Booking Validity</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="border p-2">₹{price}/-</td>
                <td className="border p-2">₹{person_2}/-</td>
                <td className="border p-2">₹{person_4}/-</td>
                <td className="border p-2">₹{person_6}/-</td>
                <td className="border p-2">₹{extra_bed}/-</td>
                <td className="border p-2">₹{child_no_bed}/-</td>
                <td className="border p-2">{booking_validity}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            CUSTOMIZE YOUR PACKAGE
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setShowModal(true)}
          >
            BOOK NOW
          </button>
        </div>

        {/* Inclusion / Exclusion */}
        <div className="grid md:grid-cols-4 gap-6 mt-10 text-sm">
          <div className="bg-white shadow p-4 rounded hover:shadow-xl">
            <h3 className="font-bold mb-2">Package Inclusion</h3>
            <div dangerouslySetInnerHTML={{ __html: inclusion }} />
          </div>
          <div className="bg-white shadow p-4 rounded hover:shadow-xl">
            <h3 className="font-bold mb-2">Package Exclusion</h3>
            <div dangerouslySetInnerHTML={{ __html: exclusion }} />
          </div>
          <div className="bg-white shadow p-4 rounded hover:shadow-xl">
            <h3 className="font-bold mb-2">Note</h3>
            <div dangerouslySetInnerHTML={{ __html: note }} />
          </div>
          <div className="bg-white shadow p-4 rounded hover:shadow-xl">
            <h3 className="font-bold mb-2">Additional Charges</h3>
            <div dangerouslySetInnerHTML={{ __html: addtional_charge }} />
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-center mb-6">
          DAY-WISE <span className="text-blue-600">ITINERARY</span>
        </h2>
        <div
          className="space-y-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: day_details }}
        />
      </div>

      {/* Payment Policies */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-center">BOOKING PAYMENT POLICY</h3>
          <div dangerouslySetInnerHTML={{ __html: booking_payment_policy }} />
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-center">
            BOOKING CANCELLATION POLICY
          </h3>
          <div dangerouslySetInnerHTML={{ __html: booking_cancellation_policy }} />
        </div>
      </div>

      {/* Booking Modal (unchanged) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start md:items-center z-50 overflow-y-auto">
          <div className="bg-[#083d56] text-white p-6 rounded-lg w-[95%] md:w-[90%] max-w-4xl relative mt-6 md:mt-20 overflow-y-auto max-h-[90vh]">
            <button className="absolute top-2 right-2 text-white text-xl font-bold"
              onClick={() => setShowModal(false)} > ✖ </button>
            <h2 className="text-center text-lg md:text-2xl font-bold mb-6"> Booking Now </h2>
            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" >
              {[{ label: "Booking code*", name: "package_code", type: "text" },
              { label: "First Guest Name *", name: "first_guest_name", type: "text" },
              { label: "Check In Date *", name: "check_in_date", type: "date" },
              { label: "Check Out Date *", name: "check_out_date", type: "date" },
              { label: "Mobile No *", name: "mobile_no", type: "number" },].map((input) => (<div key={input.name}
                className="flex flex-col gap-1"> <label>{input.label}</label> <input type={input.type} name={input.name} value={bookingData[input.name]} onChange={handleBookingChange} className="p-2 rounded text-black" required />
              </div>))}
              <div className="flex flex-col gap-1">
                <label>Total No. of Person *</label>
                <select name="total_persons" value={bookingData.total_persons} onChange={handleBookingChange} className="p-2 rounded text-black" required >
                  <option value="">Select</option>
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (<option key={n}>{n}</option>))}
                </select> </div> <div className="flex flex-col gap-1">
                <label>Extra Bed</label>
                <select name="extra_bed" value={bookingData.extra_bed} onChange={handleBookingChange} className="p-2 rounded text-black" >
                  <option value="">Select</option> {[0, 1, 2, 3, 4, 5, 6].map((n) => (<option key={n}>{n}</option>))} </select>
              </div> <div className="flex flex-col gap-1"> <label>Child without Bed</label>
                <select name="child_without_bed" value={bookingData.child_without_bed} onChange={handleBookingChange} className="p-2 rounded text-black" >
                  <option value="">Select</option> {[0, 1, 2, 3, 4, 5, 6].map((n) => (<option key={n}>{n}</option>))} </select> </div>
              <div className="flex flex-col gap-1"> <label>Meal Plan *</label>
                <select name="meal_plan" value={bookingData.meal_plan} onChange={handleBookingChange} className="p-2 rounded text-black" required >
                  <option value="">Select</option> <option>Room with no meal</option>
                  <option>Breakfast</option> <option>Breakfast and Dinner</option>
                  <option>Breakfast with lunch dinner</option> </select> </div>
              <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label>Additional Information</label>
                <textarea name="additional_info" value={bookingData.additional_info} onChange={handleBookingChange} className="p-2 rounded text-black" />
              </div> <button type="submit" disabled={submitting} className="col-span-1 md:col-span-2 bg-[#246e73] py-2 rounded text-white font-bold hover:bg-white hover:text-[#246e73] transition" > {submitting ? "Submitting..." : "Submit"} </button>
            </form>
            {responseMsg && (<p className="text-center mt-4 font-semibold text-yellow-300">
              {responseMsg} </p>)} </div> </div>)}
    </div>
  );
}

export default PackageDetails;
