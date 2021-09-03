const mongoose = require("mongoose");

// Settings Schema
const SettingsSchema = mongoose.Schema({
    bgtype: { type: String, required: true },
    bgvalue: { type: String, required: true },
    videosfolder: { type: String, required: true },
    thumbsfolder: { type: String, required: true },
    name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
