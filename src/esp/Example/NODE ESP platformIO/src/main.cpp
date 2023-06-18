#include <Arduino.h>
#include <otadrive_esp.h>
#include <WiFi.h>
#include "LoRa_E32.h"
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define IDNODE 3
// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define RXD1 32
#define TXD1 33

LoRa_E32 e32ttl(RXD1, TXD1, &Serial1, UART_BPS_RATE_9600 ,SERIAL_8N1);


struct WifiConfig {
  //Room
  const char* roomSsid = "Room 302";
  const char* roomPassword = "0964237887";
  String roomIp = "192.168.3.101:5000";
  // Home
  const char* homeSsid = "Moc My";
  const char* homePassword = "123456789";

  //Lau 3
  const char* lau3Ssid = "Lau3";
  const char* lau3Password = "khongcopass123";
  // others
  const char* someWhereSsid = "iphone55";
  const char* someWherePassword = "123789456";
};
String Mgs_d;
int ID = 0;
float Data1 = 0;
float Data2 = 0;
float Data3 = 0;
float Data4 = 0;

struct Message {
	    byte ID[4];
      byte Data1[4];
      byte Data2[4];
      byte Data3[4];
      byte Data4[4];    
};
struct WifiConfig wifiConfig;
const char* ssid = wifiConfig.someWhereSsid;
const char* password = wifiConfig.someWherePassword;

void readData();
void printModuleInformation(struct ModuleInformation moduleInformation);
void printParameters(struct Configuration configuration);
void sync_task();

void setup() {
  
  // pinMode(25, OUTPUT);
  // pinMode(26, OUTPUT);
  // pinMode(27, OUTPUT);

  // digitalWrite(25, HIGH);
  // delay(50);
  // digitalWrite(25, LOW);
  // digitalWrite(25, HIGH);
  // delay(300);
  // digitalWrite(25, LOW);

  // OTADRIVE.setInfo("1e3f556b-2923-4c95-94b4-2e18b90bfbd7", "v@1.1.13");
  Serial.begin(9600);

  // WiFi.begin(ssid, password);
  // while (WiFi.status() != WL_CONNECTED)
  // {
  //   delay(200);
  //   Serial.print(".");
  // }
  // Serial.println("\nConnected to the WiFi network");
  // Serial.print("Local ESP32 IP: ");
  // Serial.println(WiFi.localIP());

  // digitalWrite(25, HIGH);
  // digitalWrite(26, HIGH);
  // digitalWrite(27, HIGH);
  // delay(100);
  //   digitalWrite(25, LOW);
  // digitalWrite(26, LOW);
  // digitalWrite(27, LOW);
  // delay(100);
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

  Mgs_d = String(Data1) + "\n" +String(Data2) + "\n" + String(Data3)+ "\n" + String(Data4);
  display.setTextSize(2); // Draw 2X-scale text
  display.setTextColor(WHITE,BLACK);
  display.setCursor(0, 0);
  display.println(Mgs_d);
  display.display();      // Show initial text

}
int count;
void loop() {
  // digitalWrite(25, HIGH);
  // delay(60);
  // digitalWrite(25, LOW);
  // digitalWrite(26, HIGH);
  // delay(60);
  // digitalWrite(26, LOW);
  // digitalWrite(27, HIGH);
  // delay(60);
  // digitalWrite(27, LOW);
      //     struct Message1 {
      //   byte ID[4];
      //   byte Data1[4];
      //   byte Data2[4];
      //   byte Data3[4];
      //   byte Data4[4];   
      // } mgs;
      // *(int*)(mgs.ID) =  IDNODE;
      // *(float*)(mgs.Data1) = 1;
      // *(float*)(mgs.Data2) = 2;
      // *(float*)(mgs.Data3) = 3;
      // *(float*)(mgs.Data4) = 9;
      // ResponseStatus rs = e32ttl.sendFixedMessage(0, 2, 2,&mgs, sizeof(Message1));
      // delay(500             );


   if(ID  == 0)
  {
    if (e32ttl.available()  > 1){
    readData();
    ID = 1;
    }
  }
  else
  {
        struct Message1 {
        byte ID[4];
        byte Data1[4];
        byte Data2[4];
        byte Data3[4];
        byte Data4[4];   
      } mgs;
      *(int*)(mgs.ID) =  IDNODE;
      *(float*)(mgs.Data1) = 1;
      *(float*)(mgs.Data2) = 2;
      *(float*)(mgs.Data3) = 3;
      *(float*)(mgs.Data4) = 9;
      ResponseStatus rs = e32ttl.sendFixedMessage(0, 2, 2,&mgs, sizeof(Message1));
      delay(500             );
      
      if(rs.getResponseDescription() == "Success")
      {
        ID = 0;
        Serial.println("rst");
      }
  }
    Mgs_d = String(Data1) + "   ID"+ "\n" +String(Data2) + "   "+String(IDNODE) + "\n" + String(Data3)+ String(count++) + "\n" + String(Data4);
    //  Mgs_d = String(Data1) +  "   ID"+ "\n" +String(Data2)  +  "   "+ +String(IDNODE) + "\n" + String(Data3)+ "\n" + String(Data4);
    display.setTextSize(2); // Draw 2X-scale text
    display.setTextColor(WHITE,BLACK);
    display.setCursor(0, 0);
    display.println(Mgs_d);
    display.display();      // Show initial text[]]
  // // Serial.println("This is version 1");
  // sync_task();
  if(count >10) count =0;
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
	// Serial.println("----------------------------------------");
	// Serial.print(F("HEAD BIN: "));  Serial.print(moduleInformation.HEAD, BIN);Serial.print(" ");Serial.print(moduleInformation.HEAD, DEC);Serial.print(" ");Serial.println(moduleInformation.HEAD, HEX);

	// Serial.print(F("Freq.: "));  Serial.println(moduleInformation.frequency, HEX);
	// Serial.print(F("Version  : "));  Serial.println(moduleInformation.version, HEX);
	// Serial.print(F("Features : "));  Serial.println(moduleInformation.features, HEX);
	// Serial.println("----------------------------------------");

}
void readData()
{
    ResponseStructContainer rsc = e32ttl.receiveMessage(sizeof(Message));
    struct Message message = *(Message*) rsc.data;
    ID = *(int*)(message.ID);
    Data1 = *(float*)(message.Data1);
    Data2 = *(float*)(message.Data2);
    Data3 = *(float*)(message.Data3);
    Data4 = *(float*)(message.Data4);
    // Serial.print("ID = "); Serial.println(ID); 
    // Serial.print("Data1 = "); Serial.println(Data1); 
    // Serial.print("Data2 = "); Serial.println(Data2);
    // Serial.print("Data3 = "); Serial.println(Data3);
    // Serial.print("Data4 = "); Serial.println(Data4);
    rsc.close();
}
void sync_task() {
  // a simple timing mechanism to reduce server connectivity
  // 60 seconds check
  if (!OTADRIVE.timeTick(30))
    return;

  if (WiFi.status() != WL_CONNECTED)
    return;

  // do sync and update operations here
  OTADRIVE.updateFirmware();
}