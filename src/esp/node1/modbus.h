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
IPAddress ip(192, 168, 3, 19);
// IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

ModbusEthernet mb;  // Declare ModbusTCP instance
EthernetClass ET;
#define HREG_TIMEON 10
#define HREG_PROD1 2
#define HREG_PROD2 3
#define HREG_PROD3 4
#define HREG_TOTAL 6
#define HREG_FAULT 7

#include "serialInput.h"

void setupModbus() {
  Serial.begin(9600);  // Open serial communications and wait for port to open

  Ethernet.init(5);         // SS pin
  Ethernet.begin(mac, ip);  // start the Ethernet connection
  // beginPacket(IPAddress ip, uint16_t port);
  // ET.begin();
  delay(1000);  // give the Ethernet shield a second to initialize
  mb.client();  // Act as Modbus TCP server
  Serial.println(mb.isConnected(remote));
}

uint16_t product1 = 0;
uint16_t product2 = 0;
uint16_t product3 = 0;
uint16_t total = 0;
uint16_t fault = 0;
uint16_t timeOn = 0;

uint32_t showLast = 0;
int startStatus = 0;
int stopStatus = 0;
void loopModbus() {
  if (mb.isConnected(remote)) {                  // Check if connection to Modbus Slave is established
      
    if (node1Recv.motorStatus == 1) {
      mb.writeHreg(remote, 8, 1);
      Serial.println("Start");
    } else if (node1Recv.motorStatus == 0) {
      mb.writeHreg(remote, 8, 2);
      Serial.println("Stop");
    }
    mb.readHreg(remote, HREG_PROD1, &product1);
    mb.readHreg(remote, HREG_PROD2, &product2);
    mb.readHreg(remote, HREG_PROD3, &product3);
    mb.readHreg(remote, HREG_TOTAL, &total);
    mb.readHreg(remote, HREG_FAULT, &fault);
    mb.readHreg(remote, HREG_TIMEON, &timeOn);
                                                 // Serial.println(String("product1: ") + String(product1));
                                                 // Serial.println(String("product2: ") + String(product2));
                                                 // Serial.println(String("product3: ") + String(product3));
    messageSend.Data1 = product1;
    messageSend.Data2 = product2;
    messageSend.Data3 = product3;
    messageSend.Data4 = fault;
    messageSend.Data5 = timeOn;
    messageSend.Data6 = total;
    Serial.println(String(product1) + "\t" + String(product2) + "\t" + String(product3) + "\t" + String(fault) + "\t" + String(timeOn) + "\t" + String(total)) ;
  } else {
    mb.connect(remote);  // Try to connect if not connected
    Serial.println("Connecting");
  }
  mb.task();  // Common local Modbus task
}