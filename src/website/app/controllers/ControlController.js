const fb = require("firebase");
const url = require("url");
const WebSocketServer = require("websocket").server;
const http = require("http");
const { response } = require("express");
const mqtt = require("mqtt");
class ControlController {
  // [GET] /
  index(req, res, next) {
    if (req.session.loggedin) {
      var mqtt = require("mqtt");
      var client = mqtt.connect("mqtt://io.adafruit.com", {
        username: "khanhnq1406",
        password: "aio_SLVp61QtyK1ZmJJuDUM7Cn8SB2cb",
      });
      var mqtttopic = `${client.options.username}/f/mqtt-server`;
      client.on("connect", function () {
        console.log("connected");
        client.subscribe(mqtttopic, function (err) {
          if (!err) {
            console.log("subscribed");
            client.publish(mqtttopic, "#checkStatus");
          }
        });
      });

      client.on("message", function (topic, message) {
        console.log(message.toString());
        if (message.toString() === "#hasturnedOn") {
          client.end();
          res.render("control", {
            hasturnedOn: true,
          });
        } else if (message.toString() === "#hasturnedOff") {
          client.end();
          res.render("control", {
            hasturnedOn: false,
          });
        }
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

  turning(req, res, next) {
    var mqtt = require("mqtt");
    var client = mqtt.connect("mqtt://io.adafruit.com", {
      username: "khanhnq1406",
      password: "aio_SLVp61QtyK1ZmJJuDUM7Cn8SB2cb",
    });
    var mqtttopic = `${client.options.username}/f/mqtt-server`;
    client.on("connect", function () {
      console.log("connected");
      client.subscribe(mqtttopic, function (err) {
        if (!err) {
          console.log("subscribed");
          client.publish(mqtttopic, "#checkStatus");
        }
      });
    });

    client.on("message", function (topic, message) {
      console.log(message.toString());
      if (message.toString() === "#hasturnedOn") {
        client.end();
        res.redirect("turnOff");
      } else if (message.toString() === "#hasturnedOff") {
        client.end();
        res.redirect("turnOn");
      }
    });
  }
  turnOn(req, res, next) {
    // Setup MQTT Client
    // mqtt[s]://[username][:password]@host.domain[:port]
    var mqtt = require("mqtt");
    var client = mqtt.connect("mqtt://io.adafruit.com", {
      username: "khanhnq1406",
      password: "aio_SLVp61QtyK1ZmJJuDUM7Cn8SB2cb",
    });
    var mqtttopic = `${client.options.username}/f/mqtt-server`;
    client.on("connect", function () {
      console.log("connected");
      client.subscribe(mqtttopic, function (err) {
        if (!err) {
          console.log("subscribed");
          client.publish(mqtttopic, "#turnOn");
        }
      });
    });

    client.on("message", function (topic, message) {
      console.log(message.toString());
      if (message.toString() === "#turnedOn") {
        client.end();
        res.redirect("/control");
      }
    });
  }

  turnedOn(req, res, next) {
    res.render("turned");
  }
  turnOff(req, res, next) {
    // Setup MQTT Client
    // mqtt[s]://[username][:password]@host.domain[:port]
    var mqtt = require("mqtt");
    var client = mqtt.connect("mqtt://io.adafruit.com", {
      username: "khanhnq1406",
      password: "aio_SLVp61QtyK1ZmJJuDUM7Cn8SB2cb",
    });
    var mqtttopic = `${client.options.username}/f/mqtt-server`;
    client.on("connect", function () {
      console.log("connected");
      client.subscribe(mqtttopic, function (err) {
        if (!err) {
          console.log("subscribed");
          client.publish(mqtttopic, "#turnOff");
        }
      });
    });

    client.on("message", function (topic, message) {
      console.log(message.toString());
      if (message.toString() === "#turnedOff") {
        client.end();
        res.redirect("/control");
      }
    });
  }
}

module.exports = new ControlController();
