#include <Arduino.h>
#include <SPI.h>
#include <Ethernet.h>       // Ethernet library v2 is required
#include <ModbusEthernet.h>
//Physical connection between ESP32 and W5500
//GPIO23 <--> MOSI
//GPIO19 <--> MISO
//GPIO18 <--> SCLK
//GPIO5 <--> SCS
int showDelay = 1000;
const uint16_t REG = 512;               // Modbus Hreg Offset
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(192, 168, 0, 120);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

ModbusEthernet mb;               // Declare ModbusTCP instance
EthernetClass ET;
#define REGN1 15
#define REGN2 15
#define REGN3 15
#define REGN4 15

void setup() {`
  Serial.begin(9600);     // Open serial communications and wait for port to open

  Ethernet.init(5);         // SS pin
  Ethernet.begin(mac, ip, gateway, subnet);  // start the Ethernet connection
  // beginPacket(IPAddress ip, uint16_t port);
  // ET.begin();
  delay(1000);              // give the Ethernet shield a second to initialize
  mb.client();              // Act as Modbus TCP server
  // Add registers
  mb.addCoil(REGN1);//     Tabble name: Read coils (0x)                   type: Read    
  mb.addIsts(REGN2);//     Tabble name: Read discrete input (1x)          type: R/W
  mb.addIreg(REGN3);//     Tabble name: Read input registers (3x)         type: R     
  mb.addHreg(REGN4);//     Tabble name: Read holding registers (4x)       type: R/W

  // Write registers
  mb.Coil(REGN1, 1);
  mb.Ists(REGN2,1);
  mb.Ireg(REGN3,50);
  mb.Hreg(REGN4, 100);
}

uint16_t res = 0;
uint32_t showLast = 0;

void loop() {
  
  Serial.println("oke");
  mb.task();                      // Common local Modbus task
}