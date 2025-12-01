const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoot = require("./routes/auth");
const addressRoutes = require("./routes/user");
const bookRoutes = require("./routes/book")
const orderRoutes = require("./routes/orderRoutes")
const adminRoutes = require("./routes/adminRoutes")
const path = require("path");

dotenv.config();
const app = express();


// app.use(cors());
app.use(cors({
  origin: "https://book-on-desk.vercel.app", // your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));


app.get("/", (req, res) => {
    console.log("slkdjf");
  res.send("Backend running ✅");
})
// all routes
app.use("/api/auth", authRoot);
app.use("/api", addressRoutes); //addressRoute
app.use("/api", bookRoutes); //bookroutes
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes)


mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
