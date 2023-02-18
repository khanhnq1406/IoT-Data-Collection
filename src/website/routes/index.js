const monitorRouter = require("./monitor");
const homeRouter = require("./home");
const chartRouter = require("./chart");
const controlRouter = require("./control");
const inputRouter = require("./input");

function route(app) {
  app.use("/monitor", monitorRouter);
  app.use("/chart", chartRouter);
  app.use("/control", controlRouter);
  app.use("/input", inputRouter);
  app.use("/", homeRouter);
}
module.exports = route;
