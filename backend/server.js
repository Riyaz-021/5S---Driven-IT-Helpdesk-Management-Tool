const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/Users.js");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { authenticateUser } = require("./middleware/auth");
const cors = require("cors");
const generalRouter = require("./routes/General.js");
const userRouter = require("./routes/User.js");
const adminRouter = require("./routes/Admin.js");
const agentRouter = require("./routes/Agent.js");

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

/* Root */
app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/helpdesk", generalRouter);

app.use("/helpdesk/user", userRouter);

app.use("/helpdesk/admin", adminRouter);

app.use("/helpdesk/agent", agentRouter);

/* Role Authentication */
app.get("/helpdesk/auth-status", authenticateUser, (req, res) => {
  res.status(200).json({ role: req.user.role });
});

app.listen(port, () => {
  console.log("app is listening to port:", port);
});
