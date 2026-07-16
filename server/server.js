// ===============================
// IMPORTS
// ===============================

require("dotenv").config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", !!process.env.EMAIL_PASS);

const express = require("express");
const cors = require("cors");

const contactRoutes = require("./routes/contact");

// ===============================
// APP SETUP
// ===============================

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// ROUTES
// ===============================

app.get("/", (req, res) => {
    res.send("🚢 SDC Shipping Freight Backend Running");
});

app.use("/contact", contactRoutes);

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
});