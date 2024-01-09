const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
    isUser: 0,
    isAdmin: 1,
    isSuperAdmin: 2,
});
const Role = mongoose.model("role", roleSchema);
module.exports = Role;