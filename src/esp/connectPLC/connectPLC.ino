#include <Arduino.h>
#include <SPI.h>
#include <Ethernet.h>  // Ethernet library v2 is required
#include <ModbusEthernet.h>
int dataSend = 0;

//Physical connection between ESP32 and W5500
//GPIO23 <--> MOSI
//GPIO19 <--> MISO
//GPIO18 <--> SCLK
//GPIO5 <--> SCS
int showDelay = 1000;
const uint16_t REG = 512;  // Modbus Hreg Offset
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress remote(192, 168, 3, 10);
IPAddress ip(192, 168, 3, 11);
// IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

ModbusEthernet mb;  // Declare ModbusTCP instance
EthernetClass ET;
#define HREG_PROD1 2
#define HREG_PROD2 3
#define HREG_PROD3 4
#define REGN4 15
#include "serialInput.h"

void setup() {
  Serial.begin(9600);  // Open serial communications and wait for port to open

  Ethernet.init(5);         // SS pin
  Ethernet.begin(mac, ip);  // start the Ethernet connection
  // beginPacket(IPAddress ip, uint16_t port);
  // ET.begin();
  delay(1000);  // give the Ethernet shield a second to initialize
  mb.client();  // Act as Modbus TCP server
  // Add registers
  // mb.addCoil(REGN1);//     Tabble name: Read coils (0x)                   type: Read
  // mb.addIsts(REGN2);//     Tabble name: Read discrete input (1x)          type: R/W
  // mb.addIreg(REGN3);//     Tabble name: Read input registers (3x)         type: R
  // mb.addHreg(REGN4);//     Tabble name: Read holding registers (4x)       type: R/W

  // // Write registers
  // mb.Coil(REGN1, 1);
  // mb.Ists(REGN2,1);
  // mb.Ireg(REGN3,50);
  // mb.Hreg(REGN4, 100);
  Serial.println(mb.isConnected(remote));
  // mb.writeHreg(remote,  100,  2);
}

uint16_t product1 = 0;
uint16_t product2 = 0;
uint16_t product3 = 0;

uint32_t showLast = 0;
int startStatus = 1;
int stopStatus = 0;
void loop() {
  if (mb.isConnected(remote)) {                  // Check if connection to Modbus Slave is established
    mb.readHreg(remote, HREG_PROD1, &product1);  // Initiate Read Hreg from Modbus Slave
    mb.readHreg(remote, HREG_PROD2, &product2);  // Initiate Read Hreg from Modbus Slave
    mb.readHreg(remote, HREG_PROD3, &product3);  // Initiate Read Hreg from Modbus Slave
                                                 // mb.writeHreg(remote,  2,  dataSend);
                                                 // Serial.println(String("product1: ") + String(product1));
                                                 // Serial.println(String("product2: ") + String(product2));
                                                 // Serial.println(String("product3: ") + String(product3));
    mb.writeHreg(remote, 8, startStatus);
    mb.writeHreg(remote, 9, stopStatus);

    if (dataSend == 1) {
      startStatus = 1;
      stopStatus = 0;
      Serial.println("Start");

    } else if (dataSend == 2) {
      startStatus = 0;
      stopStatus = 1;
      Serial.println("Stop");
    } else {
      startStatus = 0;
      stopStatus = 0;
      Serial.println("None");
    }
  } else {
    mb.connect(remote);  // Try to connect if not connected
    Serial.println("Connecting");
  }
  mb.task();  // Common local Modbus task
  serialInput();
}