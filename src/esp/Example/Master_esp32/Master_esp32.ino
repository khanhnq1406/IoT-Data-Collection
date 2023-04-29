#include "LoRa_E32.h"
#define RXD1 32
#define TXD1 33

// SERIAL 2 PINS
#define RXD2 16
#define TXD2 17

LoRa_E32 e32ttl1(RXD1, TXD1, &Serial1, UART_BPS_RATE_9600 ,SERIAL_8N1);
LoRa_E32 e32ttl2(RXD2, TXD2, &Serial2, UART_BPS_RATE_9600 ,SERIAL_8N1);

// #include <SoftwareSerial.h>
// SoftwareSerial mySerial2(35,32);
// SoftwareSerial mySerial1(33,25);
// LoRa_E32 e32ttl1(&mySerial1);
// LoRa_E32 e32ttl2(&mySerial2,9600);

// #include <Adafruit_GFX.h>    
// #include <Adafruit_ST7735.h> x  
// #include <SPI.h>
// #define TFT_MOSI 13 //D2//DI
// #define TFT_SCLK 14 //D1//SC
// #define TFT_CS   0 //D3//CS
// #define TFT_RST  2 //D4//RST
// #define TFT_DC  16 //D5//RS

// #define TFT_MOSI 51 //SD1//DI
// #define TFT_SCLK 52 //SLK//SC
// #define TFT_CS   53 //CMD//CS
// #define TFT_RST  46 //SD3//RST
// #define TFT_DC  44 //SD2//RS
// dinh nghia cac mau 
// #define MY_WHITE ST77XX_WHITE
// #define MY_RED ST77XX_BLUE
// #define MY_SKY ST77XX_YELLOW
// #define MY_GREEN ST77XX_GREEN
// #define MY_PINK ST77XX_MAGENTA
// #define MY_PLUE ST77XX_RED
// //size 128X128
// #define BLACK 0x0000    
// #define BLUE  0x001F    
// #define RED  0xF800    
// #define GREEN 0x07E0
// #define CYAN 0x07FF
// #define MAGENTA 0xF81F  
// #define YELLOW 0xFFE0
// #define WHITE 0xFFFF 
// Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_MOSI, TFT_SCLK, TFT_RST);
void printParameters(struct Configuration configuration);
void printModuleInformation(struct ModuleInformation moduleInformation);
// #define 
#define TotalID  10
float Temp=0;
struct Message1 {
    byte ID[4];
    byte Data1[4];
    byte Data2[4];
    byte Data3[4];
    byte Data4[4];                 
};
int ID = 2;
float Data1_R[TotalID];
float Data2_R[TotalID];
float Data3_R[TotalID];
float Data4_R[TotalID];

int temp =0;
float Data1_S[TotalID];
float Data2_S[TotalID];
float Data3_S[TotalID];
float Data4_S[TotalID];
bool flag1 = false;
int IDS=2;// a variable adrress
int run =0;
// the setup function runs once when you press reset or power the board
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  e32ttl1.begin();
  ResponseStructContainer c1;
  c1 = e32ttl1.getConfiguration();
  Configuration configuration1= *(Configuration*) c1.data;
	configuration1.ADDL = 0x01;
	configuration1.ADDH = 0x00;
	configuration1.CHAN = 0x02;
  configuration1.SPED.uartBaudRate = UART_BPS_9600;
  configuration1.SPED.uartParity = MODE_00_8N1; // Parity bit
  configuration1.SPED.airDataRate = AIR_DATA_RATE_100_96; // Air data rate
  configuration1.OPTION.transmissionPower = POWER_20;
  configuration1.OPTION.fec = FEC_0_OFF;
  configuration1.OPTION.fixedTransmission = FT_FIXED_TRANSMISSION;
  configuration1.OPTION.wirelessWakeupTime = WAKE_UP_750;
  configuration1.OPTION.ioDriveMode = IO_D_MODE_PUSH_PULLS_PULL_UPS;
  e32ttl1.setConfiguration(configuration1, WRITE_CFG_PWR_DWN_SAVE);	
  printParameters(configuration1);
	c1.close();

  // delay(100);

  e32ttl2.begin();
  ResponseStructContainer c2;
  c2 = e32ttl2.getConfiguration();
  Configuration configuration2 = *(Configuration*) c2.data;
  configuration2.ADDL = 0x02;
  configuration2.ADDH = 0x00;
  configuration2.CHAN = 0x02;
  configuration2.SPED.uartBaudRate = UART_BPS_9600;
  configuration2.SPED.uartParity = MODE_00_8N1; // Parity bit
  configuration2.SPED.airDataRate = AIR_DATA_RATE_100_96; // Air data rate
  configuration2.OPTION.transmissionPower = POWER_20;
  configuration2.OPTION.fec = FEC_0_OFF;
  configuration2.OPTION.fixedTransmission = FT_FIXED_TRANSMISSION;
  configuration2.OPTION.wirelessWakeupTime = WAKE_UP_750;
  configuration2.OPTION.ioDriveMode = IO_D_MODE_PUSH_PULLS_PULL_UPS;
  e32ttl2.setConfiguration(configuration2, WRITE_CFG_PWR_DWN_SAVE);
  printParameters(configuration2);
  ResponseStatus resetModule();
	c2.close();

}
void loop()
{
     ResponseStatus rs;
         struct Message {
            byte ID[4];
            byte Data1[4];
            byte Data2[4];
            byte Data3[4];
            byte Data4[4];   
          } message;

      Data1_S[IDS] = random(0,200);
      Data2_S[IDS] = random(0,200);
      Data3_S[IDS] = random(0,200);
      Data4_S[IDS] = random(0,200);

      *(int*)(message.ID) =  IDS;
      *(float*)(message.Data1) = Data1_S[IDS];
      *(float*)(message.Data2) = Data2_S[IDS];
      *(float*)(message.Data3) = Data3_S[IDS];
      *(float*)(message.Data4) = Data4_S[IDS];

      rs = e32ttl1.sendFixedMessage(0, IDS, 4,&message, sizeof(Message));

      // Serial.print("IDS"); Serial.println(IDS);
      // Serial.print("Data1_S[IDS]"); Serial.println(Data1_S[IDS]);
      // Serial.print("Data2_S[IDS]"); Serial.println(Data2_S[IDS]);
      // Serial.print("Data3_S[IDS]"); Serial.println(Data3_S[IDS]);
      // Serial.print("Data4_S[IDS]"); Serial.println(Data4_S[IDS]);

      // ResponseStatus rs = e32ttl1.sendFixedMessage(0, 2, 2,&message, sizeof(Message));
      // rs = e32ttl1.sendFixedMessage(0, 4, 4,&message, sizeof(Message));
    // tft.setCursor(56, 0);  // Set position (x,y)
    // tft.setTextColor(ST7735_YELLOW, ST7735_BLACK);  // Set color of text. First is the color of text and after is color of background
    // tft.setTextSize(2);  // Set text size. Goes from 0 (the smallest) to 20 (very big)
    // tft.println(IDS);
    // tft.setCursor(0, 20);  // Set position (x,y)
    // tft.setTextColor(ST7735_YELLOW, ST7735_BLACK);  // Set color of text. First is the color of text and after is color of background
    // tft.setTextSize(2);  // Set text size. Goes from 0 (the smallest) to 20 (very big)
    // tft.println(String(Data1_S[IDS])+"\n"+String(Data2_S[IDS])+"\n"+String(Data3_S[IDS])+"\n"+String(Data4_S[IDS]));    
    // delay(500);
     if( flag1== true)
     {
       IDS++;
       delay(500);
       if(IDS == 6) IDS = 2;
       flag1 = false;
        Serial.println("         flag ");

      }



    if (e32ttl2.available()  > 1){
      ResponseStructContainer rsc = e32ttl2.receiveMessage(sizeof(Message1));
      struct Message1 mge = *(Message1*) rsc.data;;
      ID = *(int*)(mge.ID);
      Data1_R[ID] = *(float*)(mge.Data1);
      Data2_R[ID] = *(float*)(mge.Data2);
      Data3_R[ID] = *(float*)(mge.Data3);
      Data4_R[ID] = *(float*)(mge.Data4);
      Serial.print("ID = "); Serial.println(ID); 
      Serial.print("Data1[");Serial.print(ID);Serial.print("] = "); Serial.println(Data1_R[ID]); 
      Serial.print("Data2[");Serial.print(ID);Serial.print("] = "); Serial.println(Data2_R[ID]);
      Serial.print("Data3[");Serial.print(ID);Serial.print("] = "); Serial.println(Data3_R[ID]);
      Serial.print("Data4[");Serial.print(ID);Serial.print("] = "); Serial.println(Data4_R[ID]);
      flag1 = true;

    }

    // }
          Serial.print("      ID = ");  Serial.println(IDS); 

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
    // Serial.print(F("MODE        : "));Serial.println(e32ttl.getMode());
    Serial.println("----------------------------------------");
}