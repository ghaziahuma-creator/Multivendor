const app = require("../app");
const connectDatabase = require("../db/Database");

connectDatabase();

module.exports = app; 