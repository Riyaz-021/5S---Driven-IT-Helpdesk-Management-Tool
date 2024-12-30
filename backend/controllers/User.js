const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/Users.js");
const Ticket = require("../models/Tickets.js");
const mongoose = require("mongoose");

module.exports.dashboard = async (req, res) => {
  try {
    // Calculate Stats
    const totalTickets = await Ticket.countDocuments({
      userId: new mongoose.Types.ObjectId(req.user.id),
    });
    const pendingTickets = await Ticket.countDocuments({
      userId: new mongoose.Types.ObjectId(req.user.id),
      status: { $in: ["Open", "Assigned", "In Progress"] },
    });
    const resolvedTickets = await Ticket.countDocuments({
      userId: new mongoose.Types.ObjectId(req.user.id),
      status: { $in: ["Resolved", "Closed"] },
    });
    const highPriority = await Ticket.countDocuments({
      userId: new mongoose.Types.ObjectId(req.user.id),
      priority: "High",
    });
    // Send Stats
    res.json({
      totalTickets,
      pendingTickets,
      resolvedTickets,
      highPriority,
    });
  } catch (err) {
    console.error("Error fetching user dashboard stats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.profile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("username role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.welcome = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.tickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching user tickets:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postRaise = async (req, res) => {
  const { title, description, priority } = req.body;

  try {
    const newTicket = new Ticket({
      title,
      description,
      priority,
      userId: req.user.id,
      status: "Open",
      createdAt: new Date(),
    });

    await newTicket.save();
    res.status(201).json({ message: "Ticket created successfully" });
  } catch (error) {
    console.error("Failed to create ticket", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.viewTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "assignedTo",
      "username email"
    );
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.reopenTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status !== "Closed") {
      return res.status(400).json({
        message: "Only tickets with status 'Closed' can be reopened.",
      });
    }

    ticket.status = "Open";
    ticket.assignedTo = null;
    await ticket.save();

    res.json({ message: "Ticket successfully reopened", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reopening ticket" });
  }
};

module.exports.deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Server error while deleting ticket" });
  }
};

module.exports.settings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, password } = req.body;

    // Prepare update fields
    const updateFields = {};
    if (username) updateFields.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedAgent = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedAgent) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Settings updated successfully",
      user: updatedAgent,
    });
  } catch (err) {
    console.error("Error updating agent settings:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
