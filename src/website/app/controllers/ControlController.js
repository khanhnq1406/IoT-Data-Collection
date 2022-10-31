const fb = require("firebase");
const url = require("url");
const WebSocketServer = require("websocket").server;
const http = require("http");
class ControlController {
  // [GET] /
  index(req, res, next) {
    if (req.session.loggedin) {
      res.render("control");
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

  turnOn(req, res, next) {
    // require("../../config/webSocket/webSocketOn");
    res.render("turning");
    let hasDone = false;
    const WebSocketServer = require("websocket").server;
    const http = require("http");

    var server = http.createServer(function (request, response) {
      console.log(new Date() + " Received request for " + request.url);
      response.writeHead(404);
      response.end();
    });
    server.listen(1406, function () {
      console.log(new Date() + " Server is listening on port 3000");
    });

    const wsServer = new WebSocketServer({
      httpServer: server,
      // You should not use autoAcceptConnections for production
      // applications, as it defeats all standard cross-origin protection
      // facilities built into the protocol and the browser.  You should
      // *always* verify the connection's origin and decide whether or not
      // to accept it.
      autoAcceptConnections: false,
    });

    function originIsAllowed(origin) {
      // put logic here to detect whether the specified origin is allowed.
      return true;
    }

    wsServer.on("request", function (request) {
      console.log(request);
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log(
          new Date() +
            " Connection from origin " +
            request.origin +
            " rejected."
        );
        return;
      }

      let connection = request.accept(null, request.origin);
      console.log(new Date() + " Connection accepted.");
      connection.on("message", function (message) {
        if (message.type === "utf8") {
          console.log("Received Message: " + message.utf8Data);
          connection.sendUTF("ON");
          if (String(message.utf8Data) === "#TurnedOn") {
            connection.close();
            server.close();
            const request = require("request");
            request(
              "http://localhost:3000/control",
              { json: true },
              (err, res, body) => {
                if (err) {
                  return console.log(err);
                }
                console.log(body.url);
                console.log(body.explanation);
              }
            );
          }
        } else if (message.type === "binary") {
          console.log(
            "Received Binary Message of " + message.binaryData.length + " bytes"
          );
          connection.sendBytes(message.binaryData);
        }
      });
      // connection.on("close", function (reasonCode, description) {
      //   console.log(
      //     new Date() + " Peer " + connection.remoteAddress + " disconnected."
      //   );
      // });
    });
  }
  turnOff(req, res, next) {
    require("../../config/webSocket/webSocketOff");
    res.render("turning");
  }
}

module.exports = new ControlController();
