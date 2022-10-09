const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: String,
  userID: String,
  registeredSize: { type: Number, default: 0 },
  registersInfo: { type: Array, default: [] }
});

module.exports = model("registerUser", schema);
