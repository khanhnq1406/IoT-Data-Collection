#include <Arduino.h>
#include "LoRa_E32.h"
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <PID_v1.h>

#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels
#define IDNODE 4
// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET -1  // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define RXD1 32
#define TXD1 33

LoRa_E32 e32ttl(RXD1, TXD1, &Serial1, UART_BPS_RATE_9600, SERIAL_8N1);

String Mgs_d;
int ID = 0;
float Data1 = 0;
float Data2 = 0;
float Data3 = 0;
float Data4 = 0;

struct Message {
  int ID;
  int Data1;
  int Data2;
  int Data3;
  int Data4;
  int Data5;
  int Data6;
};
struct Message messageSend;
// Node 2
struct Node2Recv {
  int setpoint;
  int motorStatus;
} node2Recv;


// Time delay
unsigned long previousMillis = 0;     // variable to store the previous time
const long interval = 500;           // interval at which to blink (in milliseconds)
unsigned long previousMillisLed = 0;  // variable to store the last time the LED was updated

#define MASTERADDL 2
#define MASTERCH 4
#define MASTERADDH 0
#include "loraHandle.h"
#include "getDataSensor.h"
void sync_task();

void setup() {
  Serial.begin(9600);
  // Config Node 2 pin
  // Thiết lập chế độ OUTPUT cho các chân kết nối module L298N
  pinMode(enA, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);

  // Thiết lập chế độ INPUT/OUTPUT cho các chân kết nối cảm biến siêu âm
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Đặt mức nước mục tiêu
  Setpoint = 20;  // Ví dụ: đặt mức nước ở độ cao 25cm

  // Thiết lập các tham số PID
  myPID.SetMode(AUTOMATIC);
  myPID.SetSampleTime(1);
  myPID.SetOutputLimits(0, 255);  // Giới hạn tốc độ động cơ từ -255 đến 255

  e32ttl.begin();
  e32ttl.resetModule();
  // After set configuration comment set M0 and M1 to low
  // and reboot if you directly set HIGH M0 and M1 to program
  ResponseStructContainer c;
  c = e32ttl.getConfiguration();
  Configuration configuration = *(Configuration*)c.data;
  configuration.ADDL = 4;
  configuration.ADDH = 0;
  configuration.CHAN = 0x04;
  configuration.SPED.uartBaudRate = UART_BPS_9600;
  configuration.SPED.uartParity = MODE_00_8N1;            // Parity bit
  configuration.SPED.airDataRate = AIR_DATA_RATE_100_96;  // Air data rate
  configuration.OPTION.transmissionPower = POWER_20;
  configuration.OPTION.fec = FEC_0_OFF;
  configuration.OPTION.fixedTransmission = FT_FIXED_TRANSMISSION;
  configuration.OPTION.wirelessWakeupTime = WAKE_UP_750;
  configuration.OPTION.ioDriveMode = IO_D_MODE_PUSH_PULLS_PULL_UPS;
  e32ttl.setConfiguration(configuration, WRITE_CFG_PWR_DWN_SAVE);
  printParameters(configuration);
  c.close();
}
// int i = 0;
void loop() {
  loraHandle();
  // unsigned long currentMillis = millis();
  // if (currentMillis - previousMillis >= interval) {
    getDataSensor();
    // previousMillis = currentMillis;
  // Serial.println(i);
}