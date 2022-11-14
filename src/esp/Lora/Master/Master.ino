/*
 * LoRa E32-TTL-100
 * Receive fixed transmission message as a specified point.
 * https://www.mischianti.org
 *
 * E32-TTL-100----- Arduino UNO or esp8266
 * M0         ----- 3.3v (To config) GND (To send) 7 (To dinamically manage)
 * M1         ----- 3.3v (To config) GND (To send) 6 (To dinamically manage)
 * TX         ----- PIN 2 (PullUP)
 * RX         ----- PIN 3 (PullUP & Voltage divider)
 * AUX        ----- Not connected (5 if you connect)
 * VCC        ----- 3.3v/5v
 * GND        ----- GND
 *
 */
#include "Arduino.h"
#include "LoRa_E32.h"
#include "time.h"
#include <string.h>
// ---------- FireBase --------------
#include <FirebaseESP8266.h>
#include  <ESP8266WiFi.h>
#define FIREBASE_HOST "https://iot-data-collection-5d7a4-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyCCMle_JkmnDA6A0aKU_7cZt5zZE905ggI"
#define WIFI_SSID "an123" // Thay đổi tên wifi của bạn
#define WIFI_PASSWORD "1237894567" // Thay đổi password wifi của bạn
FirebaseData fbdo;
// --------------------------------------

// ---------- esp8266 pins --------------
#include <SoftwareSerial.h>
SoftwareSerial mySerial(D2, D3); // e32 TX e32 RX
LoRa_E32 e32ttl(&mySerial, D5, D7, D6);
// -------------------------------------

//c
unsigned int Status_Button,Status_1;
unsigned int Button_1,Button_2,Button_3,Button_4;
int data_B1,data_B2,data_B3,data_B4;
int Temp;
// -------------------------------------
// ---------- Date Time --------------
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;
const int   daylightOffset_sec = 3600;
char dateTime[50];

// -------------------------------------

void printParameters(struct Configuration configuration);
void printModuleInformation(struct ModuleInformation moduleInformation);
//The setup function is called once at startup of the sketch
void setup()
{
  Serial.begin(9600);
  delay(1000);
  WiFi.begin (WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Dang ket noi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println ("");
  Serial.println ("Da ket noi WiFi!");
  Serial.println(WiFi.localIP());

  // Init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

//    while (!Serial) {
//        ; // wait for serial port to connect. Needed for native USB
//    }
    delay(100);
 
    e32ttl.begin();
 
//  e32ttl.resetModule();
    // After set configuration comment set M0 and M1 to low
    // and reboot if you directly set HIGH M0 and M1 to program
    ResponseStructContainer c;
    c = e32ttl.getConfiguration();
    Configuration configuration = *(Configuration*) c.data;
    configuration.ADDL = 3;
    configuration.ADDH = 0;
    configuration.CHAN = 8;
    configuration.SPED.uartBaudRate = UART_BPS_9600;
    configuration.SPED.uartParity = MODE_00_8N1; // Parity bit
    configuration.SPED.airDataRate = AIR_DATA_RATE_100_96 ;// Air data rate
    configuration.OPTION.transmissionPower = POWER_20;
    configuration.OPTION.fec = FEC_0_OFF;
    configuration.OPTION.fixedTransmission = FT_FIXED_TRANSMISSION;
    configuration.OPTION.wirelessWakeupTime = WAKE_UP_750;
    configuration.OPTION.ioDriveMode = IO_D_MODE_PUSH_PULLS_PULL_UPS;
    e32ttl.setConfiguration(configuration, WRITE_CFG_PWR_DWN_SAVE);

    printParameters(configuration);
    ResponseStatus resetModule();
  
    // ---------------------------
    Serial.println();
    Serial.println("Start listening!");
}
struct Message {
    char type[5];
    char message[8];
    byte temperature[4];
    byte Status_Button_S[4];
}; 
// The loop function is called in an endless loop
void loop()
{
    if (e32ttl.available()  > 1){

      ResponseStructContainer rsc = e32ttl.receiveMessage(sizeof(Message));
      struct Message message = *(Message*) rsc.data;
//      Serial.println(message.type);
      
      Status_Button = *(int*)(message.Status_Button_S);
      Temp=*(int*)(message.temperature);
//      Serial.println(*(int*)(message.temperature));
//      Serial.println(message.message);
//      Serial.println(Status_Button);
  //    free(rsc.data);
      rsc.close();
//        ResponseContainer rs = e32ttl.receiveMessage();
//        // First of all get the data
//        String message = rs.data;
// 
//        Serial.println(rs.status.getResponseDescription());
//        Serial.println(rs.data);
      Decode(); 
      Serial.print("Button_1 = ");
      Serial.println(Button_1);
      Serial.print("Button_2 = ");
      Serial.println(Button_2);
      Serial.print("Button_3 = ");
      Serial.println(Button_3);
      Serial.print("Button_4 = ");
      Serial.println(Button_4);
      Serial.print("TEMP = ");
      Serial.println(Temp);
    }
  printLocalTime();
  char ref[100] = "Temperature/";
  strcat(ref, dateTime);
  Firebase.setFloat( fbdo,ref, Temp);
  Firebase.setFloat ( fbdo,"Button 4", Button_4);
  Firebase.setFloat ( fbdo,"Button 3", Button_3);
  Firebase.setFloat ( fbdo,"Button 2", Button_2);
  Firebase.setFloat ( fbdo,"Button 1", Button_1);
  delay(1);
  
}
void Decode()
{
  if( (Status_Button & 0b01)  == 0b01)
  {
    Button_1 = HIGH;
  }
  else {
    Button_1 = LOW;
  }
  if( (Status_Button & 0b10)  == 0b10)
  {
    Button_2 = HIGH;
  }
  else {
    Button_2 = LOW;
  }
  if((Status_Button & 0b100)  == 0b100  )
  {
    Button_3 = HIGH;
  }
  else {
    Button_3 = LOW;
  }
  if((Status_Button & 0b1000 ) == 0b1000)
  {
    Button_4 = HIGH;
  }
  else {
    Button_4 = LOW;
  }
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

void printLocalTime(){
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  strftime(dateTime,50 , "%Y-%B-%d %H:%M:%S", &timeinfo);
}
