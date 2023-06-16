#include <Arduino.h>
#include <SPI.h>
#include <Ethernet.h>       // Ethernet library v2 is required
#include <ModbusEthernet.h>
//Physical connection between ESP32 and W5500
//GPIO23 <--> MOSI
//GPIO19 <--> MISO
//GPIO18 <--> SCLK
//GPIO5 <--> SCS
const uint16_t REG = 512;               // Modbus Hreg Offset
IPAddress remote(192, 168, 30, 12);  // Address of Modbus Slave device
const int32_t showDelay = 5000;   // Show result every n'th mellisecond

// Enter a MAC address and IP address for your controller below.
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xEE
};
IPAddress ip(192, 168, 30, 178); // The IP address will be dependent on your local network:
ModbusEthernet mb;               // Declare ModbusTCP instance

void setup() {
  Serial.begin(9600);     // Open serial communications and wait for port to open

  Ethernet.init(5);         // SS pin
  Ethernet.begin(mac, ip);  // start the Ethernet connection
  delay(1000);              // give the Ethernet shield a second to initialize
  mb.client();              // Act as Modbus TCP server

}

uint16_t res = 0;
uint32_t showLast = 0;

void loop() {
if (mb.isConnected(remote)) {   // Check if connection to Modbus Slave is established
    mb.readHreg(remote, REG, &res);  // Initiate Read Hreg from Modbus Slave
  } else {
    mb.connect(remote);           // Try to connect if not connected
  }
  delay(100);                     // Pulling interval
  mb.task();                      // Common local Modbus task
  if (millis() - showLast > showDelay) { // Display register value every 5 seconds (with default settings)
    showLast = millis();
    Serial.println(res);
  }
}