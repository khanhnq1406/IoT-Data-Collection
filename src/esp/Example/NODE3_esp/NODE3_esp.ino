/*
 * LoRa E32-TTL-100
 * Receive fixed transmission message on channel.
 * https://www.mischianti.org/2019/12/03/lora-e32-device-for-arduino-esp32-or-esp8266-power-saving-and-sending-structured-data-part-5/
 *
 * E32-TTL-100----- Arduino UNO or esp8266
 * M0         ----- 3.3v (To config) GND (To send) 7 (To dinamically manage)
 * M1         ----- 3.3v (To config) GND (To send) 6 (To dinamically manage)
 * TX         ----- RX PIN 2 (PullUP)
 * RX         ----- TX PIN 3 (PullUP & Voltage divider)
 * AUX        ----- Not connected (5 if you connect)
 * VCC        ----- 3.3v/5v
 * GND        ----- GND
 *
 */
#include "Arduino.h"
#include "LoRa_E32.h"

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#include <SoftwareSerial.h>
SoftwareSerial mySerial1(D4,D5);
LoRa_E32 e32ttl(&mySerial1);

//#include <SoftwareSerial.h>
//SoftwareSerial mySerial(D2, D3); // Arduino RX <-- e32 TX, Arduino TX --> e32 RX
//LoRa_E32 e32ttl(&mySerial);
// -------------------------------------
void printParameters(struct Configuration configuration);
void printModuleInformation(struct ModuleInformation moduleInformation);
//The setup function is called once at startup of the sketch
void setup()
{
	Serial.begin(9600);
//  tft.initR(INITR_144GREENTAB); 
//  tft.fillScreen(BLACK); 
//	while (!Serial) {
//	    ; // wait for serial port to connect. Needed for native USB
//    }
	delay(100);

	e32ttl.begin();
//	e32ttl.resetModule();
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
	// ---------------------------
	Serial.println();
	Serial.println("Start listening!");
  // e32ttl.setMode(MODE_2_POWER_SAVING);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);// initialize with the I2C addr 0x3C (for the 128x32)(initializing the display)
  display.display();
      display.setTextSize(2); // Draw 2X-scale text
    display.setTextColor(WHITE,BLACK);
    display.setCursor(10, 0);
    display.println("Start");
    display.display();      // Show initial text
  delay(500); // Pause for 2 seconds

  // Clear the buffer
  display.clearDisplay();
}
struct Message {
	    byte ID[4];
      byte Data1[4];
      byte Data2[4];
      byte Data3[4];
      byte Data4[4];    
};
int ID = 0;
float Data1 = 0;
float Data2 = 0;
float Data3 = 0;
float Data4 = 0;
// The loop function is called in an endless loop
void loop()
{
  
    display.setTextSize(2); // Draw 2X-scale text
    display.setTextColor(WHITE,BLACK);
    display.setCursor(10, 0);
    display.println(rand()%5000);
    display.display();      // Show initial text
    delay(500);
  if(ID  != 4)
  {
    if (e32ttl.available()  > 1){
    redData();
    }
  }
  else if( ID  == 4)
  {
        struct Message1 {
        byte ID[4];
        byte Data1[4];
        byte Data2[4];
        byte Data3[4];
        byte Data4[4];   
      } mgs;
      *(int*)(mgs.ID) =  4;
      *(float*)(mgs.Data1) = 1;
      *(float*)(mgs.Data2) = 2;
      *(float*)(mgs.Data3) = 3;
      *(float*)(mgs.Data4) = 4;
      ResponseStatus rs = e32ttl.sendFixedMessage(0, 2, 2,&mgs, sizeof(Message1));
      delay(10);
      if(rs.getResponseDescription() == "Success")
      {
        ID = 0;
        Serial.println("rst");
      }
  }
}
void redData()
{
    ResponseStructContainer rsc = e32ttl.receiveMessage(sizeof(Message));
    struct Message message = *(Message*) rsc.data;
    ID = *(int*)(message.ID);
    Data1 = *(float*)(message.Data1);
    Data2 = *(float*)(message.Data2);
    Data3 = *(float*)(message.Data3);
    Data4 = *(float*)(message.Data4);
    Serial.print("ID = "); Serial.println(ID); 
    Serial.print("Data1 = "); Serial.println(Data1); 
    Serial.print("Data2 = "); Serial.println(Data2);
    Serial.print("Data3 = "); Serial.println(Data3);
    Serial.print("Data4 = "); Serial.println(Data4);


    display.setTextSize(2); // Draw 2X-scale text
    display.setTextColor(WHITE,BLACK);
    display.setCursor(10, 0);
    display.println(Data1);
    display.display();      // Show initial text
		rsc.close();
}
void printParameters(struct Configuration configuration) {
	Serial.println("----------------------------------------");

	Serial.print(F("HEAD : "));  Serial.print(configuration.HEAD, BIN);Serial.print(" ");Serial.print(configuration.HEAD, DEC);Serial.print(" ");Serial.println(configuration.HEAD, HEX);
	Serial.println(F(" "));
	Serial.print(F("AddH : "));  Serial.println(configuration.ADDH, DEC);
	Serial.print(F("AddL : "));  Serial.println(configuration.ADDL, DEC);
	Serial.print(F("Chan : "));  Serial.print(configuration.CHAN, DEC); Serial.print(" -> "); Serial.println(configuration.getChannelDescription());
	Serial.println(F(" "));
	Serial.print(F("SpeedParityBit     : "));  Serial.print(configuration.SPED.uartParity, BIN);Serial.print(" -> "); Serial.println(configuration.SPED.getUARTParityDescription());
	Serial.print(F("SpeedUARTDatte  : "));  Serial.print(configuration.SPED.uartBaudRate, BIN);Serial.print(" -> "); Serial.println(configuration.SPED.getUARTBaudRate());
	Serial.print(F("SpeedAirDataRate   : "));  Serial.print(configuration.SPED.airDataRate, BIN);Serial.print(" -> "); Serial.println(configuration.SPED.getAirDataRate());

	Serial.print(F("OptionTrans        : "));  Serial.print(configuration.OPTION.fixedTransmission, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getFixedTransmissionDescription());
	Serial.print(F("OptionPullup       : "));  Serial.print(configuration.OPTION.ioDriveMode, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getIODroveModeDescription());
	Serial.print(F("OptionWakeup       : "));  Serial.print(configuration.OPTION.wirelessWakeupTime, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getWirelessWakeUPTimeDescription());
	Serial.print(F("OptionFEC          : "));  Serial.print(configuration.OPTION.fec, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getFECDescription());
	Serial.print(F("OptionPower        : "));  Serial.print(configuration.OPTION.transmissionPower, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getTransmissionPowerDescription());

	Serial.println("----------------------------------------");

}
void printModuleInformation(struct ModuleInformation moduleInformation) {
	Serial.println("----------------------------------------");
	Serial.print(F("HEAD BIN: "));  Serial.print(moduleInformation.HEAD, BIN);Serial.print(" ");Serial.print(moduleInformation.HEAD, DEC);Serial.print(" ");Serial.println(moduleInformation.HEAD, HEX);

	Serial.print(F("Freq.: "));  Serial.println(moduleInformation.frequency, HEX);
	Serial.print(F("Version  : "));  Serial.println(moduleInformation.version, HEX);
	Serial.print(F("Features : "));  Serial.println(moduleInformation.features, HEX);
	Serial.println("----------------------------------------");

}
