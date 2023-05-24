#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <algorithm>
#include <ArduinoJson.h>
#include "time.h"
#include <otadrive_esp.h>
struct WifiConfig {
  //Room
  const char* roomSsid = "Room 302";
  const char* roomPassword = "0964237887";
  String roomIp = "http://192.168.3.101:5000";
  // Home
  const char* homeSsid = "Moc My";
  const char* homePassword = "123456789";
  const char* homeIp = "http://192.168.1.112:5000";
  // 
  const char* lau3Ssid = "Lau3";
  const char* lau3Password = "khongcopass123";
  // Heekcaa
  const char* heekcaaSsid = "Heekcaa";
  const char* heekcaaPassword = "heekcaa220";
  String heekcaaIp = "http://192.168.2.32:5000";
  // others
  const char* someWhereSsid = "Yancoffee & Tea";
  const char* someWherePassword = "Cherrytea";
};
struct WifiConfig wifiConfig;
const char* ssid = wifiConfig.heekcaaSsid;
const char* password = wifiConfig.heekcaaPassword;

// Config http
// String apiGetData = "https://rstdxxyobzxqaggqcjrz.supabase.co/rest/v1/data_table?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE";
String localIp = wifiConfig.heekcaaIp;
String apiGetData =  localIp + "/test/getData";
String apiUploadData = localIp + "/esp/updateData";
String apiInsertData = localIp + "/esp/insertData";
String apiUpdateLightStatus = localIp + "/esp/updateLightStatus";
String apiGetLightStatus = "https://rstdxxyobzxqaggqcjrz.supabase.co/rest/v1/control?select=pressData&id=eq.1&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE";

HTTPClient httpGetData;
HTTPClient httpUploadData;
HTTPClient httpInsertData;
HTTPClient httpUpdateLightStatus;
HTTPClient httpGetLightStatus;
// Time delay
unsigned long previousMillis = 0;     // variable to store the previous time
const long interval = 10000;           // interval at which to blink (in milliseconds)
unsigned long previousMillisLed = 0;  // variable to store the last time the LED was updated
const long intervalLed = 200;         // interval at which to blink (milliseconds)
unsigned long previousMillisInsert = 0; 
const long intervalInsert = 5000;         
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

