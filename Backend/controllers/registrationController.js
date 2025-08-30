const Registration = require("../models/Registration");

// Register for a session (only once)
exports.registerSession = async (req, res) => {
    try {
        const { learnerId, sessionId, sessionDate, sessionTime } = req.body;

        const existing = await Registration.findOne({ learnerId, sessionId });
        if (existing) return res.status(409).send("Already registered for this session.");

        const reg = new Registration({ learnerId, sessionId, sessionDate, sessionTime });
        await reg.save();
        res.status(200).send("Session registered successfully");
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Unregister from a session
exports.unregisterSession = async (req, res) => {
    try {
        const { learnerId, sessionId } = req.body;

        const existing = await Registration.findOne({ learnerId, sessionId });
        if (!existing) return res.status(404).send("No registration found to delete.");

        await Registration.findByIdAndDelete(existing._id);
        res.status(200).send("Registration deleted successfully");
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
