const authRouter = require("./auth");
const testRouter = require("./test");
function route(app) {
  app.use("/test", testRouter);
  app.use("/auth", authRouter);
}

module.exports = route;
