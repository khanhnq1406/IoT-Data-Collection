const authRouter = require("./auth");
const testRouter = require("./test");
const databaseRouter = require("./database");
const espRouter = require("./esp");

function route(app) {
  app.use("/test", testRouter);
  app.use("/auth", authRouter);
  app.use("/database", databaseRouter);
  app.use("/esp", espRouter);
}

module.exports = route;
