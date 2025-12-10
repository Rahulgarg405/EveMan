// server/routes/bookingRoutes.js

const express = require("express");
const db = require("../config/db"); // The database connection pool
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Helper function to check if a value is a valid positive integer
const isPositiveInteger = (value) => {
  return Number.isInteger(value) && value > 0;
};

// POST /bookings - Book tickets
router.post("/", protect, async (req, res) => {
  // Note: We are mocking a user_id for now, replace with actual auth later
  const user_id = req.user.id;

  const { event_id, name, email, quantity, mobile, total_amount } = req.body;

  // 1. Basic Input Validation
  if (
    !event_id ||
    !name ||
    !email ||
    !isPositiveInteger(quantity) ||
    !total_amount
  ) {
    return res.status(400).json({
      message: "Missing required booking information or invalid quantity.",
    });
  }

  let connection;

  try {
    // Start a database connection and transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // --- PART 1: Check Availability and Price ---
    const [events] = await connection.query(
      "SELECT available_seats, price FROM events WHERE id = ? FOR UPDATE", // LOCK the row for the transaction
      [event_id]
    );

    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Event not found." });
    }

    const event = events[0];
    const { available_seats, price } = event;

    // Seat Check
    if (available_seats < quantity) {
      await connection.rollback();
      return res.status(409).json({
        message: "Not enough seats available. Please try a lower quantity.",
      });
    }

    // Price Verification (optional but recommended security)
    const calculated_total = quantity * price;
    if (parseFloat(total_amount) !== calculated_total) {
      await connection.rollback();
      // Log this for security audit
      console.warn(
        `Price mismatch for Event ${event_id}. Client: ${total_amount}, Server: ${calculated_total}`
      );
      return res
        .status(400)
        .json({ message: "Total amount is incorrect. Booking aborted." });
    }

    // --- PART 2: Create the Booking Record ---
    const bookingSql = `INSERT INTO bookings (user_id, event_id, name, email, quantity, mobile, total_amount) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const bookingValues = [
      user_id,
      event_id,
      name,
      email,
      quantity,
      mobile,
      total_amount,
    ];

    const [bookingResult] = await connection.query(bookingSql, bookingValues);
    const bookingId = bookingResult.insertId;

    // --- PART 3: Update Seat Count (Deduction) ---
    const new_available_seats = available_seats - quantity;
    const updateSql = "UPDATE events SET available_seats = ? WHERE id = ?";

    await connection.query(updateSql, [new_available_seats, event_id]);

    const eventId = event_id;
    const newAvailableSeats = new_available_seats;

    // --- PART 4: Commit Transaction ---
    await connection.commit();

    // Success response
    res.status(201).json({
      message: "Tickets successfully booked and seats confirmed!",
      bookingId: bookingId,
      newAvailableSeats: newAvailableSeats,
    });

    req.io.to(`event-${eventId}`).emit("seatsUpdated", {
      eventId: eventId,
      availableSeats: newAvailableSeats,
    });
    console.log(
      `Emitted seatsUpdated for Event ${eventId}. New count: ${newAvailableSeats}`
    );
  } catch (error) {
    console.error("Booking Transaction Failed:", error);

    // Rollback on any failure
    if (connection) {
      await connection.rollback();
    }

    res
      .status(500)
      .json({ message: "Failed to process booking due to a server error." });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
