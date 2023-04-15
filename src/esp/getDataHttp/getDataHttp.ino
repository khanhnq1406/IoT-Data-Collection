#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <algorithm>
#include <ArduinoJson.h>
#include "time.h"
void getData();
void updateData();
void insertData();

struct WifiConfig {
  //Room
  const char* roomSsid = "Room 302";
  const char* roomPassword = "0964237887";

  // Home
  const char* homeSsid = "Moc My";
  const char* homePassword = "123456789";
};
struct WifiConfig wifiConfig;
const char* ssid = wifiConfig.homeSsid;
const char* password = wifiConfig.homePassword;

// Config http
String apiGetData = "https://rstdxxyobzxqaggqcjrz.supabase.co/rest/v1/data_input?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE";
// String serverName = "https://data-collection-system-backend.onrender.com/test/getData";
String apiUploadData = "http://192.168.1.112:5000/esp/updateData";
String apiInsertData = "http://192.168.1.112:5000/esp/insertData";
HTTPClient httpGetData;
HTTPClient httpUploadData;
HTTPClient httpInsertData;

// Time delay
unsigned long previousMillis = 0;  // variable to store the previous time
const long interval = 1000;        // interval at which to blink (in milliseconds)

// Get time
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 25200;
const int daylightOffset_sec = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  randomSeed(micros());  // Seed the random number generator with the current time
  WiFi.mode(WIFI_STA);   //Optional
  WiFi.begin(ssid, password);
  Serial.println("\nConnecting");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());

  //init the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  httpGetData.begin(apiGetData.c_str());
  httpUploadData.begin(apiUploadData.c_str());
  httpInsertData.begin(apiInsertData.c_str());
}

void loop() {
  getData();
  unsigned long currentMillis = millis();
  // if (currentMillis - previousMillis >= interval) {
  //   updateData();
  // }
  if (currentMillis - previousMillis >= 5000) {
    insertData();
    previousMillis = currentMillis;
  }
  // save the last time
}

void getData() {
  unsigned long start = millis();
  int httpResponseCode = httpGetData.GET();
  if (httpResponseCode > 0) {
    // Serial.print("httpGetData Response code: ");
    // Serial.println(httpResponseCode);
    String payload = httpGetData.getString();
    char c;
    char no = '[';  //character I want removed.
    int count = 0;
    payload.remove(0, 1);
    no = ']';
    payload.remove(payload.length() - 1, 1);
    no = ' ';
    for (int i = 0; i < payload.length() - 1; ++i) {
      c = payload.charAt(i);
      if (c == no) {
        payload.remove(i, 1);
      }
    }
    no = '\n';
    for (int i = 0; i < payload.length() - 1; ++i) {
      c = payload.charAt(i);
      if (c == no) {
        payload.remove(i, 1);
        count++;
      }
    }
    int valArr[count + 1];
    for (int i = 0; i <= count; i++) {
      JSONVar myObject = JSON.parse(payload);
      JSONVar keys = myObject.keys();
      JSONVar id = myObject[keys[0]];
      valArr[i] = int(myObject[keys[1]]);
      // Serial.print("valArr ");
      // Serial.print(id);
      // Serial.print(" = ");
      // Serial.println(valArr[i]);
      int firstComma = payload.indexOf(',');
      payload.remove(0, payload.indexOf(',', firstComma + 1) + 1);
    }
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  unsigned long end = millis();
  unsigned long delta = end - start;
  // Serial.println(delta);
}
void updateData() {
  int data[8];
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  JsonArray& dataArray = root.createNestedArray("data");
  for (int i = 0; i < 8; i++) {
    data[i] = random(100);  // Generate a random number between 0 and 99
    dataArray.add(data[i]);
  }
  String postData;
  root.printTo(postData);

  httpUploadData.addHeader("Content-Type", "application/json");
  int httpResponseCode = httpUploadData.POST(postData);

  // Serial.print("httpResponseCode: ");
  // Serial.println(httpResponseCode);
}

void insertData() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }
  char currentTime[9];
  sprintf(currentTime, "%02d:%02d:%02d", timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
  char currentDate[11];
  sprintf(currentDate, "%02d-%02d-%04d", timeinfo.tm_mday, timeinfo.tm_mon + 1, timeinfo.tm_year + 1900);
  int data = random(100);
  // Create a JSON object
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  // Add some data to the JSON object
  root["date"] = currentDate;
  root["time"] = currentTime;
  root["data1"] = data;

  // Serialize JSON object to string
  String jsonString;
  root.printTo(jsonString);

  httpInsertData.addHeader("Content-Type", "application/json");
  int httpResponseCode = httpInsertData.POST(jsonString);
  Serial.print("httpResponseCode: ");
  Serial.println(httpResponseCode);
}