const authRouter = require("./auth");
const testRouter = require("./test");
function route(app) {
  app.use("/test", testRouter);
  app.use("/", authRouter);
}

module.exports = route;
