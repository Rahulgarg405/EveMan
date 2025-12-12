import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/events";

const EventListingPage = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate("/login");
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Function to fetch events based on current filters
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string based on state
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (locationFilter) params.location = locationFilter;
      if (dateFilter) params.date = dateFilter;

      const response = await axios.get(API_BASE_URL, { params });
      setEvents(response.data);
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, locationFilter, dateFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold font-sans text-gray-300 mb-5 mt-7">
        Upcoming Events
      </h1>

      <div className="text-white p-3 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 col-span-2"
        />
        <input
          type="text"
          placeholder="Filter by Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {loading && <div className="text-center text-lg">Loading events...</div>}
      {error && <div className="text-center text-red-500 text-lg">{error}</div>}

      {!loading && events.length === 0 && !error && (
        <div className="text-center text-gray-500 text-lg">
          No events found matching your criteria.
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        layout
      >
        <AnimatePresence>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EventListingPage;
