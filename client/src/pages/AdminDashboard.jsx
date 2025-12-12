import React, { useState } from "react";
import EventManagement from "../components/admin/EventManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">
        Welcome to the Admin Dashboard
      </h1>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 text-lg font-medium transition duration-200 
                        ${
                          activeTab === "events"
                            ? "border-b-4 border-indigo-600 text-indigo-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
          onClick={() => setActiveTab("events")}
        >
          Event Management
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "events" && <EventManagement />}
        {/* Add other admin components here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
