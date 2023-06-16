#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define IDNODE 4
// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#include <ModbusRTU.h>
#include <HardwareSerial.h>
HardwareSerial SerialPort(2); // use UART2

#define REGN1 15
#define REGN2 15
#define REGN3 15
#define REGN4 15

#define SLAVE_ID 15//// 03 readholding register 4x
#define RXTX_PIN 13
// #define RX_pin 16
// #define TX_pin 17
// #define BaudRate 4800
// #define SerialMode SERIAL_8N1

#define MBUS_HW_SERIAL Serial2
#define MBUS_TXD_PIN   17         
#define MBUS_RXD_PIN   16


ModbusRTU mb;
// put function declarations here:
int myFunction(int, int);

void setup() {
  // put your setup code here, to run once:
  int result = myFunction(2, 3);
    Serial.begin(9600);
  // SerialPort.begin (BaudRate, SerialMode, RX_pin, TX_pin);
  MBUS_HW_SERIAL.begin(9600, SERIAL_8N1, MBUS_RXD_PIN, MBUS_TXD_PIN);
  // mb.begin(&SerialPort, RXTX_PIN);  //or use RX/TX direction control pin (if required)
  // mb.setBaudrate(4800);
   mb.begin(&MBUS_HW_SERIAL, RXTX_PIN);
  
  // Add registers
  mb.slave(SLAVE_ID);
  mb.addCoil(REGN1);//     Tabeb name: Read coils (0x)                   type: Read    
  mb.addIsts(REGN2);//     Tabeb name: Read discrete input (1x)          type: R/W
  mb.addIreg(REGN3);//     Tabeb name: Read input registers (3x)         type: R     
  mb.addHreg(REGN4);//     Tabeb name: Read holding registers (4x)       type: R/W

  // Write registers
  mb.Coil(REGN1, 1);
  mb.Ists(REGN2,1);
  mb.Ireg(REGN3,50);
  mb.Hreg(REGN4, 100);


  Serial.println("oke");
  delay(1000);
  Serial.println("oke");
  delay(500);
  Serial.println("oke");
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);// initialize with the I2C addr 0x3C (for the 128x32)(initializing the display)
  display.setRotation(90);
  display.display();
  display.setTextSize(2); // Draw 2X-scale text
  display.setTextColor(WHITE,BLACK);
  display.setCursor(10, 0);
  display.println("Start");
  display.display();      // Show initial text
  delay(500); // Pause for 2 seconds
  // Clear the buffer
  display.clearDisplay();
  Serial.println(mb.Hreg(REGN4));
  Serial.println(mb.slave());

}
void loop() {



  // Display registers
  String Messeage;

  Serial.println("REGN1   REGN2   REGN3   REGN4");
  Messeage = String(mb.Coil(REGN1)) + "   " + String(mb.Ists(REGN2))+ "   " + String(mb.Ireg(REGN3))+ "   " + String(mb.Hreg(REGN4));
  Serial.println(Messeage);
  // Serial.println(mb.Coil(REGN1));
  // Serial.println(mb.Ists(REGN2));
  // Serial.println(mb.Ireg(REGN3));
  // Serial.println(mb.Hreg(REGN4));

  display.setTextSize(2); // Draw 2X-scale text
  display.setTextColor(WHITE,BLACK);
  display.setCursor(0, 0);
  display.println(mb.Hreg(REGN4));
  display.display();      // Show initial text
  
  mb.task();
  yield();
}

// put function definitions here:
int myFunction(int x, int y) {
  return x + y;
}