const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth.js");
const agentController = require("../controllers/Agent.js");

//Agent Dashboard
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.dashbaord
);

/* Agent Tickets */
router.get(
  "/tickets",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.tickets
);

/* Agent Ticket View */
router.get(
  "/tickets/:ticketId",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.viewTicket
);

/* Reject Ticket */
router.patch(
  "/tickets/:ticketId/reject",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.rejectTicket
);

/* Resolve Ticket */
router.patch(
  "/tickets/:ticketId/resolve",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.resolveTicket
);

/* Take-up Ticket */
router.patch(
  "/tickets/:ticketId/take-up",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.takeUp
);

/* Agent Priorities */
router.get(
  "/priorities",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.priorities
);

/* Agent Statuses */
router.get(
  "/statuses",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.status
);

/* Agent Settings */
router.patch(
  "/settings",
  authenticateUser,
  authorizeRole("Agent"),
  agentController.settings
);

module.exports = router;
