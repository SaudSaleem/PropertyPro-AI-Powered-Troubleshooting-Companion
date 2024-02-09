const express = require("express");
const app = express();

const users = require("./routes/users.js");
const login = require("./routes/login.js");
const { sequelize } = require("./models");
const isAdmin = require("./middlewares/isAdmin.js");
const verifyToken = require("./middlewares/verifyToken.js");


app.use(express.json());
app.get("/api", (req, res) => {
  res.send("Welcome to PropertyPro APIs!");
});
app.use("/api/", login);
app.use("/api/users", verifyToken, isAdmin, users);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
