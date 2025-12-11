// client/src/pages/BookingSuccess.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

// Animation for the main card
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, type: "spring", stiffness: 100 },
  },
};

// Simple Confetti/Star Animation (visual element only)
const confettiVariants = {
  initial: { y: 0, opacity: 0, scale: 0.5 },
  animate: {
    y: [0, -50, 0],
    opacity: [0.5, 1, 0],
    scale: [1, 1.2, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

const BookingSuccess = () => {
  const { bookingId } = useParams();

  // URL to encode in the QR code (could be a ticket verification URL on your backend)
  const qrCodeValue = `http://localhost:3000/verify-ticket/${bookingId}`;

  const downloadQRCode = () => {
    const canvas = document.getElementById("qrCodeCanvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `ticket_${bookingId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 relative overflow-hidden">
      {/* Animated Confetti Effect (Visual only) */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400 text-xl font-extrabold"
          style={{ top: `${10 + i * 15}%`, left: `${Math.random() * 90}%` }}
          variants={confettiVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
        >
          ⭐
        </motion.div>
      ))}

      <motion.div
        className="bg-white p-10 md:p-16 rounded-xl shadow-2xl max-w-lg w-full text-center relative z-10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <svg
          className="mx-auto h-20 w-20 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h2 className="text-3xl font-extrabold text-green-600 mt-4">
          Booking Confirmed!
        </h2>
        <p className="text-lg text-gray-700 mt-2">
          Your tickets have been successfully reserved.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Booking ID:{" "}
          <span className="font-mono text-indigo-600">{bookingId}</span>
        </p>

        {/* QR Code Ticket */}
        <div className="mt-8 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-3">
            Your Digital Ticket (QR Code)
          </h3>
          <div className="p-4 border border-gray-300 rounded-lg shadow-inner">
            <QRCodeCanvas
              id="qrCodeCanvas"
              value={qrCodeValue}
              size={200}
              level="H"
            />
          </div>
          <button
            onClick={downloadQRCode}
            className="mt-4 py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Download Ticket PNG
          </button>
        </div>

        <Link
          to="/events"
          className="mt-8 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Return to Event Listing
        </Link>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
