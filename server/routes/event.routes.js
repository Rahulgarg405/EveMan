const express = require("express");
const { protect, isAdmin } = require("../middleware/auth.middleware");
const db = require("../config/db");

const router = express.Router();

router.post("/", protect, isAdmin, async (req, res) => {
  const { title, description, location, date, total_seats, price, img } =
    req.body;
  const admin_id = req.user.id;

  if (!title || !location || !date || !total_seats || !price) {
    return res.status(400).json({ message: "Missing required event fields." });
  }

  const available_seats = total_seats;

  const sql = `INSERT INTO events (admin_id, title, description, location, date, total_seats, available_seats, price, img) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    admin_id,
    title,
    description,
    location,
    date,
    total_seats,
    available_seats,
    price,
    img,
  ];

  try {
    const [result] = await db.query(sql, values);
    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to create event." });
  }
});

router.get("/", protect, async (req, res) => {
  const { search, location, date } = req.query;

  let sql =
    "SELECT id, title, location, date, price, available_seats FROM events WHERE 1=1";
  const values = [];

  // Filter by location
  if (location) {
    sql += " AND location LIKE ?";
    values.push(`%${location}%`);
  }

  // filter by date :
  if (date) {
    sql += " AND DATE(date) = ?";
    values.push(date);
  }

  // Search by title or description
  if (search) {
    sql += " AND (title LIKE ? OR description LIKE ?)";
    values.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY date ASC";

  try {
    const [events] = await db.query(sql, values);
    res.json(events);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to retrieve events." });
  }
});

router.get("/:id", protect, async (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM events WHERE id = ?";

  try {
    const [events] = await db.query(sql, [id]);
    if (events.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json(events[0]);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to retrieve event details." });
  }
});

router.put("/:id", protect, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, location, date, total_seats, price, img } =
    req.body;

  if (
    !title ||
    !location ||
    !date ||
    total_seats === undefined ||
    price === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Missing required event fields for update." });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [currentEvents] = await connection.query(
      "SELECT total_seats, available_seats FROM events WHERE id = ? FOR UPDATE",
      [id]
    );

    if (currentEvents.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Event not found." });
    }

    const currentEvent = currentEvents[0];

    let new_available_seats = currentEvent.available_seats;

    //  the change in available seats if total_seats was modified
    const seats_difference = total_seats - currentEvent.total_seats;

    if (seats_difference !== 0) {
      // If the admin REDUCED total_seats, check if the reduction is greater than remaining seats
      if (
        total_seats <
        currentEvent.total_seats - currentEvent.available_seats
      ) {
        await connection.rollback();
        return res.status(400).json({
          message:
            "Total seats cannot be reduced below the number of currently booked seats.",
        });
      }

      // If valid, update available_seats by the difference (can be positive or negative)
      new_available_seats = currentEvent.available_seats + seats_difference;
    }

    const sql = `UPDATE events SET title=?, description=?, location=?, date=?, total_seats=?, available_seats=?, price=?, img=? WHERE id=?`;
    const values = [
      title,
      description,
      location,
      date,
      total_seats,
      new_available_seats,
      price,
      img,
      id,
    ];

    await connection.query(sql, values);

    await connection.commit();

    res.status(200).json({
      message: "Event updated successfully.",
      newAvailableSeats: new_available_seats,
    });
  } catch (error) {
    console.error("Update Transaction Failed:", error);
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ message: "Failed to update event." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.delete("/:id", protect, isAdmin, async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM events WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to delete event." });
  }
});

module.exports = router;
