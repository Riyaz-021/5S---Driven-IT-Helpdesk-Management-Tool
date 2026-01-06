const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth.js");
const userController = require("../controllers/User.js");

//User Dashboard
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRole("User"),
  userController.dashboard
);

/* User Profile */
router.get("/profile", authenticateUser, userController.profile);

/* User Welcome */
router.get("/welcome", authenticateUser, userController.welcome);

/* User Tickets */
router.get(
  "/tickets",
  authenticateUser,
  authorizeRole("User"),
  userController.tickets
);

/* Raise Tickets Page */
router.get(
  "/raise_ticket",
  authenticateUser,
  authorizeRole("User"),
  (req, res) => {
    res.status(201).json({ message: "create ticket page" });
  }
);

router.post("/raise_ticket", authenticateUser, userController.postRaise);

/* View Individua Ticket */
router.get(
  "/tickets/:id",
  authenticateUser,
  authorizeRole("User"),
  userController.viewTicket
);

/* Update Ticket */
router.patch(
  "/tickets/:id",
  authenticateUser,
  authorizeRole("User"),
  userController.updateTicket
);

// Reopen Ticket
router.patch(
  "/tickets/:id/reopen",
  authenticateUser,
  authorizeRole("User"),
  userController.reopenTicket
);

/* Delete Ticket */
router.delete(
  "/tickets/:id",
  authenticateUser,
  authorizeRole("User"),
  userController.deleteTicket
);

/* User Settings */
router.patch(
  "/settings",
  authenticateUser,
  authorizeRole("User"),
  userController.settings
);

module.exports = router;
