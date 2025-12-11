import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:3000";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [bookingDetails, setBookingDetails] = useState({
    name: user?.username || "",
    email: user?.email || "",
    mobile: "",
  });
  const [bookingError, setBookingError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.emit("joinEvent", id);

    socket.on("seatsUpdated", (data) => {
      if (data.eventId === parseInt(id)) {
        console.log(
          `Real-time update: New seats available: ${data.availableSeats}`
        );
        setEvent((prevEvent) => ({
          ...prevEvent,
          available_seats: data.availableSeats,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError("Event not found or failed to load.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return navigate("/login");
    }

    if (quantity <= 0 || quantity > event.available_seats) {
      setBookingError("Invalid quantity selected.");
      return;
    }

    setBookingError(null);
    setIsBooking(true);

    const totalAmount = (quantity * event.price).toFixed(2);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings`,
        {
          event_id: parseInt(id),
          ...bookingDetails,
          quantity: quantity,
          total_amount: totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/booking/success/${response.data.bookingId}`);
    } catch (err) {
      console.error("Booking failed:", err.response?.data);
      setBookingError(
        err.response?.data?.message ||
          "Booking failed due to a server error. Check seats/server."
      );
    } finally {
      setIsBooking(false);
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading Event Details...</div>;
  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!event) return null;

  const {
    title,
    description,
    location,
    date,
    price,
    available_seats,
    total_seats,
  } = event;
  const isSoldOut = available_seats <= 0;
  const formattedDate = new Date(date).toLocaleString();
  const totalPrice = (quantity * price).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-300 mb-2 mt-5">
          {title}
        </h1>
        <p className="text-xl text-indigo-100 font-semibold mb-6">
          Starts: {formattedDate}
        </p>

        {/* Seat Availability & Price */}
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-8">
          <span className="text-2xl font-bold">₹{price} / ticket</span>
          <span
            className={`text-lg font-medium ${
              isSoldOut ? "text-red-500" : "text-green-600"
            }`}
          >
            {isSoldOut
              ? "SOLD OUT"
              : `${available_seats} / ${total_seats} Seats Available`}
          </span>
        </div>

        {/* Description and Location */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold border-b pb-2 text-white">
              About the Event
            </h2>
            <p className="text-gray-300 whitespace-pre-line ">{description}</p>

            <h2 className="text-2xl font-bold border-b pb-2 text-white">
              Location: {location}
            </h2>
            {/* Display location as a simple text block instead of a map */}
            <div className="bg-gray-50 p-6 border rounded-lg">
              <p className="text-lg font-semibold">{location}</p>
              <p className="text-gray-600 mt-2">
                The event address is listed here.
              </p>
            </div>
          </div>

          {/* Booking Form (Ticket Selection) */}
          <div className="lg:col-span-1">
            <motion.form
              onSubmit={handleBookingSubmit}
              className="p-6 bg-white rounded-xl shadow-2xl sticky top-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">
                Book Your Tickets
              </h3>

              {/* Quantity Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) val = 1;
                    if (val > available_seats) val = available_seats;
                    setQuantity(val);
                  }}
                  min="1"
                  max={available_seats}
                  disabled={isSoldOut}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={bookingDetails.name}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={bookingDetails.email}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              {/* Mobile Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mobile
                </label>
                <input
                  type="tel"
                  value={bookingDetails.mobile}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      mobile: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xl font-bold flex justify-between">
                  <span>Total Amount:</span>
                  <span className="text-indigo-600">₹{totalPrice}</span>
                </p>
              </div>

              {bookingError && (
                <p className="text-red-500 text-sm mt-3">{bookingError}</p>
              )}

              <button
                type="submit"
                disabled={isSoldOut || isBooking}
                className={`w-full mt-6 py-3 px-4 font-bold rounded-lg transition duration-300 
                  ${
                    isSoldOut || isBooking
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
              >
                {isBooking
                  ? "Processing..."
                  : isSoldOut
                  ? "Sold Out"
                  : `Book ${quantity} Tickets`}
              </button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetailsPage;
