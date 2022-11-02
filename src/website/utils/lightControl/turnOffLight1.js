var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://io.adafruit.com", {
  username: "khanhnq1406",
  password: "aio_ncNv40OMuA1GUqWRDhjzZOWmw97Y",
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
module.exports.client = client;
