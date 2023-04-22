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
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#define DHTPIN 14
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);
// ---------- esp8266 pins --------------
#include <SoftwareSerial.h>
SoftwareSerial mySerial(D2, D3); // e32 TX e32 RX
LoRa_E32 e32ttl(&mySerial);// -------------------------------------
  int delay_number[200]={0};
  unsigned long t_[20 0]={0};
  int first_state[200]={0};
// ---------- data--------------
unsigned int Status_Led;
int data_L1,data_L2,data_L3,data_L4;
float Temp=0;
int StatusLed_1,StatusLed_2,StatusLed_3,StatusLed_4;
int Status_Led_SV;
int CodeDataS=0;
unsigned long Time_=0,Time2_=0;
int flag1=0,flag2=0,flag3=0;
int Send_number =0;
int CodeData=0;
// -------------------------------------

void printParameters(struct Configuration configuration);
void printModuleInformation(struct ModuleInformation moduleInformation);
void ScanData();
int Merge_DataLed();
void dkhienLed();
void SendData_Master(int ADDL, int ADDH ,int CHAN );
void ReadData_Master();
void Decode();
int managedDelay(unsigned int delay_, unsigned int TimeOut_);
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
    pinMode(12,OUTPUT);
    pinMode(13,OUTPUT);
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
    ResponseStatus resetModule();
    // ---------------------------
    dht.begin();
}
 struct Message {
//    char type[5];
//    char message[8];
    byte Temperature_R[4];
    byte Status_Led_R[4];
    byte Status_Led_SV[4];
    byte Mode_R[4];
} message;

// The loop function is called in an endless loop
void loop()
{
  // ReadData_Master();
  // delay(1);
    ScanData();
    dkhienLed();
    // 103 co dữ liệu từ sv
    Serial.print("CodeDataS  = "); Serial.println(CodeDataS );
    if( CodeDataS == 100 || CodeDataS == 103)
    {
      Serial.println("                  send data ");
      if(CodeDataS == 103) 
        CodeData= 111;
      else 
        CodeData =101;
        SendData_Master(0, 3 ,0x08 );
      if(managedDelay(1,600))
      {
        Send_number ++;
      }
      if(Send_number >=4 )
        CodeDataS =0;
    }
    else
    {
      Serial.println("              read data ");
      ReadData_Master();
      flag1=0;
      flag2=0;
      flag3=0;
    }
}
int managedDelay(unsigned int delay_, unsigned int TimeOut_) {
  // Serial.print("t  = "); Serial.println(t_[delay_] );
  // Serial.print("first_state "); Serial.println(first_state[delay_]);
  // Serial.print("Status "); Serial.println(status);
  if(first_state[delay_] <3)
  {
    first_state[delay_]++;
  }
  if(first_state[delay_] <= 1)
  {
    t_[delay_]=millis();
  }
  if((unsigned long) (millis() - t_[delay_]) > TimeOut_)
  {
    t_[delay_]=0;
    first_state[delay_] =0;
    return 1;
  }
  else 
  {
    return 0;
  }
}
void ReadData_Master()
{
  if (e32ttl.available()  > 1){
    
    ResponseStructContainer rsc = e32ttl.receiveMessage(sizeof(Message));
    struct Message message = *(Message*) rsc.data;
    CodeDataS = *(int*)(message.Mode_R);
    if(CodeDataS == 103)
    {
      Status_Led_SV = *(int*)(message.Status_Led_SV);
      Decode();
      Serial.print("CodeDataS  = ");
      Serial.println(CodeDataS);
    }
    rsc.close();
  } 
}
void SendData_Master(int ADDL, int ADDH ,int CHAN )
{
    struct Message {
//      char type[5] = "TEMP";
//      char message[8] = "Kitchen";
    byte Temperature_R[4];
    byte Status_Led_R[4];
    byte Status_Led_SV[4];
    byte Mode_R[4];// khi gui du lieu can gui ma 101 cho master|| khi nhan 100 tuc phai gui du lieu cho master
  } message;
  
  *(float*)(message.Temperature_R) = Temp;
  if(CodeDataS != 103){
  *(int*)(message.Status_Led_R)= Merge_DataLed();
  }

  *(int*)(message.Mode_R)= CodeData;
  ResponseStatus rs = e32ttl.sendFixedMessage(ADDL, ADDH, CHAN,&message, sizeof(Message));
}
void ScanData()
{
//  Led_1 = random(0,2);
//  Led_2 = random(0,2);
//  Led_3 = random(0,2);
//  Led_4 = random(0,2);
String data_ ,mode_,val;
int moc;
int data;
    if(Serial.available() > 0)
  {
    val = Serial.readStringUntil('\n');
    for (int i = 0; i < val.length(); i++) {
    if (val.charAt(i) == ' ') {
        moc = i; //Tìm vị trí của dấu ""
      }
    }
   mode_=val;
   data_=val;
   mode_.remove(moc);
   data_.remove(0,moc+1);
   data=data_.toInt();
  }
   if(mode_ == "led1")
   {
    StatusLed_1 = data;
   }
   if(mode_ == "led2")
   {
    StatusLed_2 = data;
   }
   if(mode_ == "led3")
   {
    StatusLed_3 = data;
   }
//   Serial.print("Led_1 = ");
//  Serial.println(StatusLed_1);
//  Serial.print("Led_2 = ");
//  Serial.println(StatusLed_2);
//  Serial.print("Led_3 = ");
//  Serial.println(StatusLed_3);
//  Serial.print("Led_4 = ");
//  Serial.println(StatusLed_4);
//  Temp= random(37,100);
//   =  dht.readHumidity();
  Temp = dht.readTemperature();
  Serial.print("Led_1 = ");
  Serial.println(StatusLed_1);
  Serial.print("Led_2 = ");
  Serial.println(StatusLed_2);
  Serial.print("Led_3 = ");
  Serial.println(StatusLed_3);
  Serial.print("Led_4 = ");
  Serial.println(StatusLed_4);
  Serial.print("TEMP = ");
  Serial.println(Temp);
}
void Decode()
{
  if( (Status_Led_SV & 0b01)  == 0b01)
  {
    StatusLed_1 = HIGH;
  }
  else {
    StatusLed_1 = LOW;
  }
  if( (Status_Led_SV & 0b10)  == 0b10)
  {
    StatusLed_2 = HIGH;
  }
  else {
    StatusLed_2 = LOW;
  }
  if((Status_Led_SV & 0b100)  == 0b100  )
  {
    StatusLed_3 = HIGH;
  }
  else {
    StatusLed_3 = LOW;
  }
  if((Status_Led_SV & 0b1000 ) == 0b1000)
  {
    StatusLed_4 = HIGH;
  }
  else {
    StatusLed_4 = LOW;
  }
}
void data_Led()
{
  if(StatusLed_1)
  {
    data_L1=0x01;
  }
  else
  {
    data_L1=0x00;
  }
  if(StatusLed_2)
  {
    data_L2=0b10;
  }
  else
  {
    data_L2=0x00;
  }
  if(StatusLed_3)
  {
    data_L3=0b100;
  }
  else
  {
    data_L3=0x00;
  }
  if(StatusLed_4)
  {
    data_L4=0b1000;
  }
  else
  {
    data_L4=0x00;
  }
}
int Merge_DataLed()
{
   data_Led();
   Status_Led_SV = data_L1 | data_L2 | data_L3 | data_L4;
//   Serial.println(Status_Led_SV);
   return Status_Led_SV;
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
    Serial.print(F("MODE        : "));Serial.println(e32ttl.getMode());
    Serial.println("----------------------------------------");
}
void dkhienLed() {
  digitalWrite(12,StatusLed_1);
  digitalWrite(13,StatusLed_2);
  }