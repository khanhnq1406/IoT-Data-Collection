/*
 * LoRa E32-TTL-100
 * Send fixed transmission message to a specified point.
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
 
// ---------- esp8266 pins --------------
#include <SoftwareSerial.h>
SoftwareSerial mySerial(D2, D3); // e32 TX e32 RX
LoRa_E32 e32ttl(&mySerial, D5, D7, D6);
// -------------------------------------

// ---------- data--------------
int Button_1=1,Button_2=0,Button_3=1,Button_4=0;
int data_B1,data_B2,data_B3,data_B4;
int Temp=0;
// -------------------------------------

void printParameters(struct Configuration configuration);
void printModuleInformation(struct ModuleInformation moduleInformation);
//The setup function is called once at startup of the sketch
void setup()
{
    Serial.begin(9600);
//    while (!Serial) {
//        ; // wait for serial port to connect. Needed for native USB
//    }
    delay(100);
 
    e32ttl.begin();
 
    // After set configuration comment set M0 and M1 to low
    // and reboot if you directly set HIGH M0 and M1 to program
    ResponseStructContainer c;
    c = e32ttl.getConfiguration();
    Configuration configuration = *(Configuration*) c.data;
    configuration.ADDL = 1;
    configuration.ADDH = 0;
    configuration.CHAN = 4;
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
    // ---------------------------
}
 struct Message {
    char type[5];
    char message[8];
    byte temperature[4];
    byte Status_Button[4];
} message;

// The loop function is called in an endless loop
void loop()
{
  
    delay(5000);
     ScanData();
    struct Message {
        char type[5] = "TEMP";
        char message[8] = "Kitchen";
        byte temperature[4];
        byte Status_Button_S[4];
    } message;
  
    *(int*)(message.temperature) = Temp;
    *(int*)(message.Status_Button_S)= Merge_DataButton();
//    Serial.println("Send message to 00 03 04");
    ResponseStatus rs = e32ttl.sendFixedMessage(0,03, 0x08,&message, sizeof(Message));
//    ResponseStatus rs = e32ttl.sendFixedMessage(0,03, 0x08, "Message to 00 03 04 device");
  Merge_DataButton();
    //Serial.println(rs.getResponseDescription());
}
void ScanData()
{
  Button_1 = random(0,2);
  Button_2 = random(0,2);
  Button_3 = random(0,2);
  Button_4 = random(0,2);
  Temp= random(37,100);
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
void data()
{
  if(Button_1)
  {
    data_B1=0x01;
  }
  else
  {
    data_B1=0x00;
  }
  if(Button_2)
  {
    data_B2=0b10;
  }
  else
  {
    data_B2=0x00;
  }
  if(Button_3)
  {
    data_B3=0b100;
  }
  else
  {
    data_B3=0x00;
  }
  if(Button_4)
  {
    data_B4=0b1000;
  }
  else
  {
    data_B4=0x00;
  }
}
int Merge_DataButton()
{
   data();
   unsigned int Status_Button;
   Status_Button = data_B1 | data_B2 | data_B3 | data_B4;
//   Serial.println(Status_Button);
   return Status_Button;
}
void printParameters(struct Configuration configuration) {
    Serial.println("----------------------------------------");
 
    Serial.print(F("HEAD : "));  Serial.print(configuration.HEAD, BIN);Serial.print(" ");Serial.print(configuration.HEAD, DEC);Serial.print(" ");Serial.println(configuration.HEAD, HEX);
    Serial.println(F(" "));
    Serial.print(F("AddH : "));  Serial.println(configuration.ADDH, BIN);
    Serial.print(F("AddL : "));  Serial.println(configuration.ADDL, BIN);
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
