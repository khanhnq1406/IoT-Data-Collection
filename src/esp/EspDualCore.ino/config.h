#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <algorithm>
#include <ArduinoJson.h>
#include "time.h"
#include <otadrive_esp.h>
#include <dhtESP32-rmt.h>
#include <PID_v1.h>
struct WifiConfig {
  //Room
  const char* roomSsid = "Room 302";
  const char* roomPassword = "0964237887";
  String roomIp = "http://192.168.3.100:5000";
  // Home
  const char* homeSsid = "Moc My";
  const char* homePassword = "123456789";
  const char* homeIp = "http://192.168.1.112:5000";
  //
  const char* lau3Ssid = "Lau3";
  const char* lau3Password = "khongcopass123";
  String lau3Ip = "http://192.168.89.115:5000";
  // Heekcaa
  const char* heekcaaSsid = "Heekcaa";
  const char* heekcaaPassword = "heekcaa220";
  String heekcaaIp = "http://192.168.2.32:5000";
  // others
  const char* someWhereSsid = "Yancoffee & Tea";
  const char* someWherePassword = "Cherrytea";
  //
  const char* AnSsid = "TOTOLINK_A720R";
  const char* AnPassword = "";

  const char* AnSsid1 = "iphone55";
  const char* AnPassword1 = "123789456";
};
struct WifiConfig wifiConfig;
const char* ssid = wifiConfig.AnSsid1;
const char* password = wifiConfig.AnPassword1;

// URL
String backendURL = "https://data-collection-system-backend.onrender.com";
// Config http
String localIp = backendURL;
String apiGetData = localIp + "/test/getData";
String apiUploadData = localIp + "/esp/updateData";
String apiUpdateLightStatus = localIp + "/esp/updateLightStatus";

HTTPClient httpGetData;
HTTPClient httpUploadData;
HTTPClient httpUpdateLightStatus;
// Time delay
unsigned long previousMillis = 0;     // variable to store the previous time
const long interval = 200;           // interval at which to blink (in milliseconds)
unsigned long previousMillisLed = 0;  // variable to store the last time the LED was updated
const long intervalLed = 200;         // interval at which to blink (milliseconds)
unsigned long previousMillisUpdate = 0;
const long intervalUpdate = 5000;
// Get time
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 25200;
const int daylightOffset_sec = 0;

// Light status
String serverLightStatus[5];
String espLightStatus[5];
const int LIGHT1 = 9;
const int LIGHT2 = 11;
const int LIGHT3 = 12;
const int LIGHT4 = 16;
const int LIGHT5 = 20;

// Node 3
struct Node3 {
  float temperature = 0.0; // Data 7
  float humidity = 0.0; 
  int gas = 0; // Data 8
  int maxTemperature = 0.0;
  int minTemperature = 0.0;
  int maxGas = 0.0;
  int minGas = 0.0;
  int maxSpeedMotor = 0;
  int minSpeedMotor = 0;
  int acceptRunMotor = 0;
  bool hasAlarm = false;
  int serverStatus = 0;
  int espStatus = 0;
};
struct Node3MasterSend {
  int maxTemperature = 0;
  int minTemperature = 0;
  int maxGas = 0;
  int minGas = 0;
  int serverStatus = 0;
  int espStatus = 0;
} node3MasterSend;
struct Node3 node3;

struct Node2MasterSend {
  int setpointSend;
  int motorStatus;
} node2MasterSend;

struct Node2Recv {
  int waterLevel;
  int error;
  int Output;
} node2Recv;
// int Setpoint;
// LoRa configure
#include "LoRa_E32.h"
#define RXD1 32
#define TXD1 33

// SERIAL 2 PINS
#define RXD2 16
#define TXD2 17

LoRa_E32 e32ttl1(RXD1, TXD1, &Serial1, UART_BPS_RATE_9600 ,SERIAL_8N1);
LoRa_E32 e32ttl2(RXD2, TXD2, &Serial2, UART_BPS_RATE_9600 ,SERIAL_8N1);

// #define 
#define TotalID  10
float Temp=0;
struct Message1 {
    int ID;
    int Data1;
    int Data2;
    int Data3;
    int Data4;
    int Data5;                 
    int Data6;                 
};
int ID = 2;
int Data1_R[TotalID];
int Data2_R[TotalID];
int Data3_R[TotalID];
int Data4_R[TotalID];

int temp =0;
bool flag1 = false;
int IDS=4;// a variable adrress
int run =0;

const long period = 750;
unsigned long time_;

struct Node1Recv {
  int product1;
  int product2;
  int product3;
  int faultyProduct;
  int hourWorking;
  int offHour;
} node1Recv;

struct Node1MasterSend {
  int motorStatus = 0;
} node1MasterSend;