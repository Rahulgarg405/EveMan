import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const {
    id,
    title,
    location,
    date,
    price,
    available_seats,
    total_seats,
    img,
  } = event;

  // Calculate percentage of seats remaining for the indicator
  const percentageAvailable = (available_seats / total_seats) * 100;

  let indicatorColor = "bg-green-500";
  if (percentageAvailable < 30) {
    indicatorColor = "bg-red-500";
  } else if (percentageAvailable < 60) {
    indicatorColor = "bg-yellow-500";
  }

  // Format the date
  const formattedDate = new Date(date).toLocaleString();

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl cursor-pointer relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/events/${id}`}>
        {/* Event Image */}
        <div className="h-48 w-full object-cover">
          <img
            src={
              img || "https://via.placeholder.com/600x400.png?text=Event+Image"
            }
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>

          {/* Seat Availability Indicator  */}
          <div className="mt-2 flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${indicatorColor}`}></div>
            <p className="text-sm text-gray-600 font-medium">
              {available_seats > 0 ? (
                `${available_seats} seats available`
              ) : (
                <span className="text-red-600">Sold Out!</span>
              )}
            </p>
          </div>

          <div className="mt-3 text-sm text-gray-500 space-y-1">
            <p>
              <strong>Location:</strong> {location}
            </p>
            <p>
              <strong>Date:</strong> {formattedDate}
            </p>
            <p className="text-lg font-bold text-indigo-600 mt-2">
              Price: ₹{price}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
