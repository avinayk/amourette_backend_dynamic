const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
require("dotenv").config();
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/login", loginRoutes);
app.use("/api", registerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
