const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: String,
  userID: String,
  registeredUserSize: { type: Number, default: 0 },
  registeredUsers: { type: Array, default: [] },
});

module.exports = model("registerMod", schema);
