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
};
struct WifiConfig wifiConfig;
const char* ssid = wifiConfig.roomSsid;
const char* password = wifiConfig.roomPassword;

// Config http
String localIp = wifiConfig.roomIp;
String apiGetData = localIp + "/test/getData";
String apiUploadData = localIp + "/esp/updateData";
String apiUpdateLightStatus = localIp + "/esp/updateLightStatus";

HTTPClient httpGetData;
HTTPClient httpUploadData;
HTTPClient httpUpdateLightStatus;
// Time delay
unsigned long previousMillis = 0;     // variable to store the previous time
const long interval = 2000;           // interval at which to blink (in milliseconds)
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
  float maxTemperature = 0.0;
  float minTemperature = 0.0;
  float maxGas = 0.0;
  float minGas = 0.0;
  int maxSpeedMotor = 0;
  int minSpeedMotor = 0;
  int acceptRunMotor = 0;
  bool hasAlarm = false;
};
struct Node3 node3;
#define DHT11PIN 4
#define MQ_PIN A0 // Define the analog pin for MQ-2 sensor
#define MQ_DPIN 5 // Define the analog pin for MQ-2 sensor
#define Buzzer 18

// struct Node2 {

// };
// Khai báo các biến liên quan đến cảm biến siêu âm
const int trigPin = 18;
const int echoPin = 19;

// Khai báo các biến liên quan đến module điều khiển động cơ L298N
const int enA = 21;
const int in1 = 22;
const int in2 = 23;

// Khai báo các biến PID
double Setpoint=0, Input=0, Output=0;
double Kp = 20, Ki = 0, Kd = 0.1;
PID myPID(&Input, &Output, &Setpoint, Kp, Ki, Kd, REVERSE);
long duration, distance, waterLevel;
double error;

