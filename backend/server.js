const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("./models/Users.js");
const Ticket = require("./models/Tickets.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { authenticateUser, authorizeRole } = require("./middleware/auth");
const cors = require("cors");

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

const seedUsers = async () => {
  try {
    const users = [];

    for (let i = 0; i < 10; i++) {
      const password = await bcrypt.hash(faker.internet.password(), 10);
      users.push({
        username: faker.internet.userName(),
        password,
        role: faker.helpers.arrayElement(["Admin", "Agent", "User"]),
        createdAt: new Date(),
      });
    }

    await User.insertMany(users);
    console.log("Random users added successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
// seedUsers();

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
  "/helpdesk/user_dashboard",
  authenticateUser,
  authorizeRole("User"),
  async (req, res) => {
    try {
      const userTickets = await Ticket.find({ userId: req.user.userId });
      res.json({ tickets: userTickets });
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get(
  "/helpdesk/admin_dashboard",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
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
  }
);

app.get(
  "/helpdesk/agent_dashboard",
  authenticateUser,
  authorizeRole("Agent"),
  async (req, res) => {
    try {
      const assigned = await Ticket.countDocuments({
        assignedTo: new mongoose.Types.ObjectId(req.user.id),
        status: "Assigned",
      });

      const inProgress = await Ticket.countDocuments({
        assignedTo: new mongoose.Types.ObjectId(req.user.id),
        status: "In Progress",
      });

      const resolved = await Ticket.countDocuments({
        assignedTo: new mongoose.Types.ObjectId(req.user.id),
        status: "Resolved",
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

/* Index Page */
app.get("/helpdesk", (req, res) => {
  res.json({ message: "Welcome to the HelpDesk API" });
});

/* Login Page */
app.get("/helpdesk/login", (req, res) => {
  res.json({ message: "Please POST to this endpoint to log in" });
});

app.post("/helpdesk/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // Ensure id is included
      "secretKey", // Replace with a secure key
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    console.error("Login Error:", err); // Debug log for errors
    res.status(500).json({ message: "Internal server error" });
  }
});

/* Raise Tickets Page */
app.get("/helpdesk/tickets/create", (req, res) => {
  res.render("ticket.ejs");
});

app.post("/helpdesk/tickets/create", authenticateUser, async (req, res) => {
  const { title, description, priority } = req.body;

  try {
    const newTicket = new Ticket({
      title,
      description,
      priority,
      userId: req.user.userId,
      status: "Open",
      createdAt: new Date(),
    });

    await newTicket.save();
    res.status(201).json({ message: "Ticket created successfully" });
  } catch (error) {
    console.error("Failed to create ticket", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* View Individua Ticket */
app.get("/helpdesk/tickets/:id", authenticateUser, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* Update Ticket */
app.patch("/helpdesk/tickets/:id", authenticateUser, async (req, res) => {
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
});

/* Delete Ticket */
app.delete("/helpdesk/tickets/:id", authenticateUser, async (req, res) => {
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
});

/* Admin Tickets */
app.get(
  "/helpdesk/admin_tickets",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find();
      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  }
);

/* View Ticket Details */
app.get(
  "/helpdesk/admin/ticket/:id",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/* Fetch Agents */
app.get("/helpdesk/admin/agents", async (req, res) => {
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
});

/* Assign Agent */
app.patch("/helpdesk/admin/tickets/:id/assign", async (req, res) => {
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
});

/* Admin Priorities */
app.get(
  "/helpdesk/admin_priorities",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
    try {
      const openTickets = await Ticket.find({ status: "Open" });
      res.status(200).json(openTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  }
);

/* Update Priority */
app.patch(
  "/helpdesk/admin_priorities/:id",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
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
  }
);

/* Admin Statuses */
app.get(
  "/helpdesk/admin_statuses",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find({}, "title status priority");
      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching statuses:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/* User Management */
app.get(
  "/helpdesk/admin/users",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("username role _id");
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/* Add User */
app.post(
  "/helpdesk/admin/users",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
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
  }
);

/* Add user */
app.post("/helpdesk/admin/users", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new User({
      username,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Failed to create user", error: err.message });
  }
});

/*Get user Details */
app.get("/helpdesk/admin/users/:id", async (req, res) => {
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
});

/* Edit user */
app.patch("/helpdesk/admin/users/:id", async (req, res) => {
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
});

/* Delete User */
app.delete(
  "/helpdesk/admin/users/:id",
  authenticateUser,
  authorizeRole("Admin"),
  async (req, res) => {
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
  }
);

/* Role Authentication */
app.get("/helpdesk/auth-status", authenticateUser, (req, res) => {
  res.status(200).json({ role: req.user.role });
});

/* User Logout */
app.get("/helpdesk/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0, httpOnly: true });
  res.set("Cache-Control", "no-store");
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
    });
  }
  res.json({ message: "Logged out successfully" });
});

app.listen(port, () => {
  console.log("app is listening to port:", port);
});
