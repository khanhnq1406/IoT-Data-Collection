const authRouter = require("./auth");
const testRouter = require("./test");
const databaseRouter = require("./database");

function route(app) {
  app.use("/test", testRouter);
  app.use("/auth", authRouter);
  app.use("/database", databaseRouter);
}

module.exports = route;
