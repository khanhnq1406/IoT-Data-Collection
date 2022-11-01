const fb = require("firebase");
const notifier = require("node-notifier");
const url = require("url");
class MonitorController {
  // [GET] /
  index(req, res, next) {
    if (req.session.loggedin) {
      const firebaseDB = fb.database();
      const firebaseRef = firebaseDB.ref("Temperature");
      const data = [];
      firebaseRef.on("value", function (snapshot) {
        snapshot.forEach(function (element) {
          data.push({ dateTime: element.key, temperature: element.val() });
        });
        res.render("monitor", {
          pageData: data.reverse(),
        });
        // res.send(data);
      });
    } else {
      res.redirect(
        url.format({
          pathname: "/",
          query: {
            notYetLogin: true,
          },
        })
      );
    }
  }
  // [GET] /addTemp
  addTemperature(req, res, next) {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    const firebaseDB = fb.database();
    const temperature = Math.random() * (99 - 10) + 10;
    firebaseDB
      .ref("Temperature")
      .child(dateTime)
      .set(Number(temperature.toFixed(2)));
    res.send("");
  }
}

module.exports = new MonitorController();
