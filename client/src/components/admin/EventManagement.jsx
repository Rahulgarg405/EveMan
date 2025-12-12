import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import EventForm from "./EventForm";
import { API_BASE_URL } from "../../config";

const EventManagement = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      const incomingData = Array.isArray(response.data) ? response.data : [];
      setEvents(incomingData);
      setError(null);
    } catch (err) {
      setError("Failed to load events. Check API and token validity.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsFormVisible(true);
  };

  const handleDelete = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/${eventId}`, authConfig);

      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
      console.log(`Event ${eventId} deleted.`);
    } catch (err) {
      alert("Failed to delete event. Check server logs.");
      console.error("Delete Error:", err.response?.data);
    }
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    setEditingEvent(null);
    fetchEvents();
  };

  if (loading)
    return <div className="text-center">Loading Events for Admin...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Events List</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsFormVisible(true);
          }}
          className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          + Create New Event
        </button>
      </div>
      {(isFormVisible || editingEvent) && (
        <div className="mb-8 p-6 bg-white shadow-xl rounded-lg border border-indigo-200">
          <EventForm
            eventData={editingEvent}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormVisible(false);
              setEditingEvent(null);
            }}
          />
        </div>
      )}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seats (Avail/Total)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.available_seats} / {event.total_seats}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${event.price}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventManagement;
