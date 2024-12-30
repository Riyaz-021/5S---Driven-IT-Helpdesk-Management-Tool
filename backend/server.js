const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/Users.js");
const Ticket = require("./models/Tickets.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { authenticateUser, authorizeRole } = require("./middleware/auth");
//const transporter = require("./utils/emailService.js");
const cors = require("cors");
const generalRouter = require("./routes/General.js");
const userRouter = require("./routes/User.js");
const adminRouter = require("./routes/Admin.js");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

main()
  .then((res) => {
    console.log("Database connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/helpdesk");
}

const addSingleUser = async () => {
  try {
    const username = "Panish";
    const rawPassword = "lw123";
    const role = "Admin";

    const password = await bcrypt.hash(rawPassword, 10);

    const newUser = new User({
      username,
      password,
      role,
      createdAt: new Date(),
    });

    await newUser.save();
    console.log("Single user added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};
//addSingleUser();

app.get(
  "/helpdesk/agent_dashboard",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
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
      console.error("Error fetching stats:", err); // Debug log for errors
      res.status(500).json({ message: "Error fetching stats", error: err });
    }
  }
);

/* Root */
app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/helpdesk", generalRouter);

app.use("/helpdesk/user", userRouter);

app.use("/helpdesk/admin", adminRouter);

/* Agent Routes */

/* Agent Tickets */
app.get(
  "/helpdesk/agent_tickets",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
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
  }
);

/* Agent Ticket View */
app.get(
  "/helpdesk/agent_tickets/:ticketId",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
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
  }
);

/* Reject Ticket */
app.patch(
  "/helpdesk/agent_tickets/:ticketId/reject",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
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
  }
);

/* Resolve Ticket */
app.patch(
  "/helpdesk/agent_tickets/:ticketId/resolve",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
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
  }
);

/* Take-up Ticket */
app.patch(
  "/helpdesk/agent_tickets/:ticketId/take-up",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
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
  }
);

/* Agent Priorities */
app.get(
  "/helpdesk/agent_priorities",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
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
  }
);

/* Agent Statuses */
app.get(
  "/helpdesk/agent_statuses",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
    try {
      const agentId = req.user.id;

      if (!agentId) {
        return res
          .status(400)
          .json({ message: "Agent ID not found in request" });
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
  }
);

/* Agent Settings */
app.patch(
  "/helpdesk/agent/settings",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
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
  }
);

/* Role Authentication */
app.get("/helpdesk/auth-status", authenticateUser, (req, res) => {
  res.status(200).json({ role: req.user.role });
});

app.listen(port, () => {
  console.log("app is listening to port:", port);
});
