#include <WiFi.h>
#include <string.h>

#define LED  23
/************************** Configuration ***********************************/

// edit the config.h tab and enter your Adafruit IO credentials
// and any additional configuration needed for WiFi, cellular,
// or ethernet clients.
#include "config.h"

// this int will hold the current count for our sketch
bool hasturnedOn;
#define IO_LOOP_DELAY 5000
unsigned long lastUpdate = 0;

// set up the feed
AdafruitIO_Feed *mqttServer = io.feed("mqtt-server");

void setup() {

  // start the serial connection
  Serial.begin(115200);

  // wait for serial monitor to open
  while(! Serial);

  Serial.print("Connecting to Adafruit IO");

  // connect to io.adafruit.com
  io.connect();

  // set up a message handler for the count feed.
  // the handleMessage function (defined below)
  // will be called whenever a message is
  // received from adafruit io.
  mqttServer->onMessage(handleMessage);

  // wait for a connection
  while(io.status() < AIO_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  // we are connected
  Serial.println();
  Serial.println(io.statusText());
  mqttServer->get();

}

void loop() {

  // io.run(); is required for all sketches.
  // it should always be present at the top of your loop
  // function. it keeps the client connected to
  // io.adafruit.com, and processes any incoming data.
  io.run();
}

// this function is called whenever a 'mqttServer' message
// is received from Adafruit IO. it was attached to
// the mqttServer feed in the setup() function above.
void handleMessage(AdafruitIO_Data *data) {

  Serial.print("received <- ");
  Serial.println(data->value());
  if (strcmp(data->value(),"#turnOn") == 0) {
    Serial.println("Turned ON");
    mqttServer->save("#turnedOn");
    hasturnedOn = true;
  }
  if (strcmp(data->value(),"#turnOff") == 0) {
    Serial.println("Turned OFF");
    mqttServer->save("#turnedOff");
    hasturnedOn = false;
  }
  if (strcmp(data->value(),"#checkStatus") == 0) {
    Serial.println("Check status");
    if (hasturnedOn)
      mqttServer->save("#hasturnedOn");
    else
      mqttServer->save("#hasturnedOff");

  }
}
