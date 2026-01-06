const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/Users.js");
const Ticket = require("../models/Tickets.js");
const mongoose = require("mongoose");

module.exports.dashbaord = async (req, res) => {
  try {
    const assigned = await Ticket.countDocuments({
      assignedTo: new mongoose.Types.ObjectId(req.user.id),
    });

    const inProgress = await Ticket.countDocuments({
      assignedTo: new mongoose.Types.ObjectId(req.user.id),
      status: "In Progress",
    });

    const resolved = await Ticket.countDocuments({
      assignedTo: new mongoose.Types.ObjectId(req.user.id),
      $or: [{ status: "Resolved" }, { status: "Closed" }],
    });

    res.status(200).json({ assigned, inProgress, resolved });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Error fetching stats", error: err });
  }
};

module.exports.tickets = async (req, res) => {
  try {
    const agentId = req.user.id;
    const tickets = await Ticket.find({
      assignedTo: new mongoose.Types.ObjectId(agentId),
    }); // Fetch tickets assigned to the agent
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching agent tickets:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.viewTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID format" });
    }

    const ticket = await Ticket.findById(ticketId)
      .populate("userId", "username email")
      .populate("assignedTo", "username email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Error fetching ticket details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.rejectTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { assignedTo: null, status: "Open" },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({
      message: "Ticket rejected successfully and status set to Open",
      ticket,
    });
  } catch (err) {
    console.error("Error rejecting ticket:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.resolveTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status: "Resolved" },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket resolved successfully", ticket });
  } catch (err) {
    console.error("Error resolving ticket:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.takeUp = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const agentId = req.user.id;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.assignedTo && ticket.assignedTo.toString() !== agentId) {
      return res
        .status(403)
        .json({ message: "Ticket already assigned to another agent" });
    }

    ticket.assignedTo = agentId;
    ticket.status = "In Progress";
    await ticket.save();

    res.json({ message: "Ticket taken up successfully" });
  } catch (err) {
    console.error("Error taking up ticket:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.priorities = async (req, res) => {
  try {
    const agentId = req.user.id;

    // Fetch tickets assigned to the agent
    const tickets = await Ticket.find({ assignedTo: agentId }).select(
      "title priority status"
    );

    if (!tickets.length) {
      return res
        .status(404)
        .json({ message: "No tickets assigned to this agent" });
    }

    res.json(tickets);
  } catch (err) {
    console.error("Error fetching agent priorities:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.status = async (req, res) => {
  try {
    const agentId = req.user.id;

    if (!agentId) {
      return res.status(400).json({ message: "Agent ID not found in request" });
    }

    // Fetch tickets assigned to the agent
    const tickets = await Ticket.find({ assignedTo: agentId }).select(
      "title status priority"
    );

    if (!tickets.length) {
      return res
        .status(404)
        .json({ message: "No tickets assigned to this agent" });
    }

    res.json(tickets);
  } catch (err) {
    console.error("Error fetching agent statuses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.settings = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { username, password } = req.body;

    // Prepare update fields
    const updateFields = {};
    if (username) updateFields.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedAgent = await User.findByIdAndUpdate(agentId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
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
