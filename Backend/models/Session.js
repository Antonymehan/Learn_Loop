// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    tutor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Tutor", 
      required: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    time: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], 
      default: "Upcoming" 
    }, // session lifecycle
    learners: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Learner" 
    }], // registered learners
    meetingLink: { 
      type: String, 
      trim: true 
    }, // link to online session (Zoom/Google Meet/Jitsi)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
