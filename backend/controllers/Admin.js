const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/Users.js");
const Ticket = require("../models/Tickets.js");

module.exports.dashboard = async (req, res) => {
  try {
    const openTicketsCount = await Ticket.countDocuments({ status: "Open" });
    const pendingTicketsCount = await Ticket.countDocuments({
      $or: [{ status: "In Progress" }, { status: "Assigned" }],
    });
    const resolvedTicketsCount = await Ticket.countDocuments({
      $or: [{ status: "Resolved" }, { status: "Closed" }],
    });

    res.status(200).json({
      openTickets: openTicketsCount,
      pendingTickets: pendingTicketsCount,
      resolvedTickets: resolvedTicketsCount,
    });
  } catch (error) {
    console.error("Error fetching ticket metrics:", error);
    res.status(500).json({ message: "Failed to fetch ticket metrics" });
  }
};

module.exports.tickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

module.exports.viewTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("userId", "username email")
      .populate("assignedTo", "username email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.agents = async (req, res) => {
  try {
    const agents = await User.find({ role: "Agent" });

    const agentsWithCapacity = await Promise.all(
      agents.map(async (agent) => {
        const ticketCount = await Ticket.countDocuments({
          assignedTo: agent._id,
        });
        return {
          ...agent.toObject(),
          capacity: ticketCount,
        };
      })
    );

    res.status(200).json(agentsWithCapacity);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch agents", error: err });
  }
};

module.exports.assign = async (req, res) => {
  const { agentId } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: agentId, status: "Assigned" },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket assigned successfully", ticket });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign ticket", error: err });
  }
};

module.exports.priorities = async (req, res) => {
  try {
    const openTickets = await Ticket.find({ status: "Open" });
    res.status(200).json(openTickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

module.exports.rePrioritize = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { priority },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Priority updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating priority:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.status = async (req, res) => {
  try {
    const tickets = await Ticket.find({}, "title status priority");
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.userManage = async (req, res) => {
  try {
    const users = await User.find().select("username role _id");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user details", error: err });
  }
};

module.exports.editUser = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user role", error: err });
  }
};

module.exports.delUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.settings = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { username, password } = req.body;

    // Prepare update fields
    const updateFields = {};
    if (username) updateFields.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedAgent = await User.findByIdAndUpdate(adminId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedAgent) {
      return res.status(404).json({ message: "Admin not found" });
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
