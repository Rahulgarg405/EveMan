// client/src/components/admin/EventForm.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:3000/events";

// Helper to convert date to YYYY-MM-DDTHH:mm format for datetime-local input
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Ensure the date is treated as local time to avoid timezone offset issues on the input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EventForm = ({ eventData, onSuccess, onCancel }) => {
  const { token } = useAuth();
  const isUpdating = !!eventData;

  // Initial state based on whether we are creating or updating
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    total_seats: 0,
    price: 0.0,
    img: "",
    ...eventData, // Overwrite with existing data if updating
    // Handle date conversion for the input field
    date: eventData ? formatDateForInput(eventData.date) : "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Ensure form data updates if the parent passes a new eventData object
  useEffect(() => {
    if (eventData) {
      setFormData({
        ...eventData,
        date: formatDateForInput(eventData.date),
      });
    } else {
      // Reset form for creation mode
      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
        total_seats: "",
        price: "",
        img: "",
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const url = isUpdating ? `${API_BASE_URL}/${eventData.id}` : API_BASE_URL;
    const method = isUpdating ? "PUT" : "POST";

    try {
      await axios({
        method,
        url,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Event ${isUpdating ? "updated" : "created"} successfully!`);
      onSuccess(); // Close form and refresh list
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      setFormError(
        `Failed to ${isUpdating ? "update" : "create"} event: ${
          err.response?.data?.message || "Server error."
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">
        {isUpdating ? "Update Event" : "Create New Event"}
      </h3>

      {formError && <p className="text-red-500">{formError}</p>}

      {/* Input Fields (Example: Title) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Input Fields (Example: Date and Time) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date and Time
        </label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Input Fields (Example: Seats) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Total Seats
        </label>
        <input
          type="number"
          name="total_seats"
          value={formData.total_seats}
          onChange={handleChange}
          required
          min="1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Input Fields (Example: Price) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Input Fields (Description, Location, Img - to be added for completeness) */}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isUpdating
            ? "Update Event"
            : "Create Event"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
