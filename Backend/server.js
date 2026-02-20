const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const testRoutes = require("./routes/testRoutes"); // ✅ add this line


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tests", testRoutes); // ✅ add this line after your existing app.use() routes
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
