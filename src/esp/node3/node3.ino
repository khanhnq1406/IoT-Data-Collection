#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
TaskHandle_t Task1;
TaskHandle_t Task2;

#include "soc/timer_group_struct.h"
#include "soc/timer_group_reg.h"
#include <Arduino.h>
#include <otadrive_esp.h>
#include "LoRa_E32.h"
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <dhtESP32-rmt.h>
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define IDNODE 4
// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define RXD1 32
#define TXD1 33

LoRa_E32 e32ttl(RXD1, TXD1, &Serial1, UART_BPS_RATE_9600 ,SERIAL_8N1);

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
// Node 3
struct Node3Recv {
  int maxTemperature = 0;
  int minTemperature = 0;
  int maxGas = 0;
  int minGas = 0;
  int espStatus = 0;
  int serverStatus = 0;
} node3Recv;
// IN3: 12; IN4:14
float temperature = 10;
float humidity = 20;
int gas = 30;
#define DHT11PIN 4
#define MQ_PIN A0 // Define the analog pin for MQ-2 sensor
#define MQ_DPIN 5 // Define the analog pin for MQ-2 sensor
#define Buzzer 18

// Time delay
unsigned long previousMillis = 0;     // variable to store the previous time
const long interval = 2000;           // interval at which to blink (in milliseconds)
unsigned long previousMillisLed = 0;  // variable to store the last time the LED was updated

#define MASTERADDL 3
#define MASTERCH 4
#define MASTERADDH 0
#include "loraHandle.h"
#include "getDataSensor.h"
void sync_task();

void setup() {
  Serial.begin(9600);
  pinMode(MQ_DPIN, INPUT);
  pinMode(Buzzer, OUTPUT);
  digitalWrite(Buzzer, LOW);
  e32ttl.begin();
	e32ttl.resetModule();
	// After set configuration comment set M0 and M1 to low
	// and reboot if you directly set HIGH M0 and M1 to program
	ResponseStructContainer c;
	c = e32ttl.getConfiguration();
	Configuration configuration = *(Configuration*) c.data;
	configuration.ADDL = 4;
	configuration.ADDH = 0;
	configuration.CHAN = 0x04;
  configuration.SPED.uartBaudRate = UART_BPS_9600;
  configuration.SPED.uartParity = MODE_00_8N1; // Parity bit
  configuration.SPED.airDataRate = AIR_DATA_RATE_100_96; // Air data rate
  configuration.OPTION.transmissionPower = POWER_20;
  configuration.OPTION.fec = FEC_0_OFF;
  configuration.OPTION.fixedTransmission = FT_FIXED_TRANSMISSION;
  configuration.OPTION.wirelessWakeupTime = WAKE_UP_750;
  configuration.OPTION.ioDriveMode = IO_D_MODE_PUSH_PULLS_PULL_UPS;
	e32ttl.setConfiguration(configuration, WRITE_CFG_PWR_DWN_SAVE);
	printParameters(configuration);
	c.close();

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

  Mgs_d = "Welcome to Node 3";
  display.setTextSize(2); // Draw 2X-scale text
  display.setTextColor(WHITE,BLACK);
  display.setCursor(0, 0);
  display.println(Mgs_d);
  display.display();      // Show initial text

  xTaskCreatePinnedToCore(
    Task1code, /* Task function. */
    "Task1",   /* name of task. */
    10000,     /* Stack size of task */
    NULL,      /* parameter of the task */
    1,         /* priority of the task */
    &Task1,    /* Task handle to keep track of created task */
    0);        /* pin task to core 0 */
  delay(500);

  //create a task that will be executed in the Task2code() function, with priority 1 and executed on core 1
  xTaskCreatePinnedToCore(
    Task2code, /* Task function. */
    "Task2",   /* name of task. */
    10000,     /* Stack size of task */
    NULL,      /* parameter of the task */
    1,         /* priority of the task */
    &Task2,    /* Task handle to keep track of created task */
    1);        /* pin task to core 1 */
  delay(500);
}
void Task1code(void* pvParameters) {
  for (;;) {
    TIMERG0.wdt_wprotect = TIMG_WDT_WKEY_VALUE;
    TIMERG0.wdt_feed = 1;
    TIMERG0.wdt_wprotect = 0;
    loraHandle();
  }
}

void Task2code(void* pvParameters) {
  for (;;) {
    TIMERG0.wdt_wprotect = TIMG_WDT_WKEY_VALUE;
    TIMERG0.wdt_feed = 1;
    TIMERG0.wdt_wprotect = 0;
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
      getDataSensor();
      previousMillis = currentMillis;
    }
  }
}
void loop() {
   delay(1);
}

