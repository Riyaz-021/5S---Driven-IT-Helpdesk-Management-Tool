const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/auth.js");
const adminController = require("../controllers/Admin.js");

//Admin Dashboard
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.dashboard
);

/* Admin Tickets */
router.get(
  "/tickets",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.tickets
);

/* View Ticket Details */
router.get(
  "/ticket/:id",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.viewTicket
);

/* Fetch Agents */
router.get(
  "/agents",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.agents
);

/* Assign Agent */
router.patch(
  "/tickets/:id/assign",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.assign
);

/* Admin Priorities */
router.get(
  "/priorities",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.priorities
);

/* Update Priority */
router.patch(
  "/priorities/:id",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.rePrioritize
);

/* Admin Statuses */
router.get(
  "/statuses",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.status
);

/* User Management */
router.get(
  "/users",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.userManage
);

/* Add User */
router.post(
  "/users",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.addUser
);

/* Add user */
// router.post(
//   "/users",
//   authenticateUser,
//   authorizeRole("Admin"),
//   async (req, res) => {
//     const { username, password, role } = req.body;

//     try {
//       // Hash the password before storing it
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Create the new user
//       const user = new User({
//         username,
//         password: hashedPassword,
//         role,
//       });

//       await user.save();

//       res.status(201).json({ message: "User created successfully" });
//     } catch (err) {
//       console.error(err);
//       res
//         .status(400)
//         .json({ message: "Failed to create user", error: err.message });
//     }
//   }
// );

/*Get user Details */
router.get(
  "/users/:id",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.getUser
);

/* Edit user */
router.patch(
  "/users/:id",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.editUser
);

/* Delete User */
router.delete(
  "/users/:id",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.delUser
);

/* Admin Settings */
router.patch(
  "/settings",
  authenticateUser,
  authorizeRole("Admin"),
  adminController.settings
);

module.exports = router;
