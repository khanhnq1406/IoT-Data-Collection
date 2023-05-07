#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <algorithm>
#include <ArduinoJson.h>
#include "time.h"
void getData();
void updateData();
void insertData();
void lightStatus();
struct WifiConfig {
  //Room
  const char* roomSsid = "Room 302";
  const char* roomPassword = "0964237887";

  // Home
  const char* homeSsid = "Moc My";
  const char* homePassword = "123456789";

  // others
  const char* someWhereSsid = "Yancoffee & Tea";
  const char* someWherePassword = "Cherrytea";
};
struct WifiConfig wifiConfig;
const char* ssid = wifiConfig.homeSsid;
const char* password = wifiConfig.homePassword;

// Config http
String apiGetData = "https://rstdxxyobzxqaggqcjrz.supabase.co/rest/v1/data_table?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE";
// String serverName = "https://data-collection-system-backend.onrender.com/test/getData";
String localIp = "https://data-collection-system-backend.onrender.com";
;
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
const long interval = 1000;           // interval at which to blink (in milliseconds)
unsigned long previousMillisLed = 0;  // variable to store the last time the LED was updated
const long intervalLed = 200;         // interval at which to blink (milliseconds)
unsigned long previousMillisInsert = 0; 
const long intervalInsert = 5000;         
// Get time
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 25200;
const int daylightOffset_sec = 0;

// Light status
String serverLightStatus = "";
String espLightStatus = "";

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

  // Create http socket
  httpGetData.begin(apiGetData.c_str());
  httpUploadData.begin(apiUploadData.c_str());
  httpInsertData.begin(apiInsertData.c_str());
  httpGetLightStatus.begin(apiGetLightStatus.c_str());
  httpUpdateLightStatus.begin(apiUpdateLightStatus.c_str());

  // Config LED on board
  pinMode(LED_BUILTIN, OUTPUT);  // set the LED pin mode
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    updateData();
    getData();
    previousMillis = currentMillis;
  }
  // Control light
  controlLight();
  
  if (currentMillis - previousMillisInsert >= intervalInsert) {
    insertData();
  }
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
    String valArr[count + 1];
    for (int i = 0; i <= count; i++) {
      JSONVar myObject = JSON.parse(payload);
      JSONVar keys = myObject.keys();
      String id = JSON.stringify(myObject[keys[0]]);
      String val = JSON.stringify(myObject[keys[1]]);
      if (id == "9") {
        serverLightStatus = JSON.stringify(myObject[keys[5]]);
        serverLightStatus.remove(0, 1);
        serverLightStatus.remove(serverLightStatus.length() - 1, 1);
        if (serverLightStatus != espLightStatus) {
          espLightStatus = serverLightStatus;
          Serial.println(espLightStatus);

          // Send esp-side status
          StaticJsonBuffer<200> jsonBuffer;
          JsonObject& root = jsonBuffer.createObject();

          // Add some data to the JSON object
          root["espData"] = espLightStatus;

          // Serialize JSON object to string
          String message;
          root.printTo(message);
          httpUpdateLightStatus.addHeader("Content-Type", "application/json");
          int httpResponseCode;
          do {
            httpResponseCode = httpUpdateLightStatus.POST(message);
          } while (httpResponseCode != 200);
          Serial.print("httpResponseCode: ");
          Serial.println(httpResponseCode);
        }
      }
      // Serial.print("payload: ");
      // Serial.println(payload);
      // Serial.print("myObject: ");
      // Serial.println(myObject);
      // Serial.print("keys ");
      // Serial.println(keys);
      // Serial.print("id: ");
      // Serial.println(id);
      // Serial.print("val: ");
      // Serial.println(val);
      // int firstComma = payload.indexOf('}');
      // Serial.print("firstComma: ");
      // Serial.println(firstComma);
      payload.remove(0, payload.indexOf('}') + 2);
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
  int data = random(30, 40);
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

void controlLight() {
  if (espLightStatus == "Start") {
    digitalWrite(LED_BUILTIN, HIGH);  // turn on the LED
  } else if (espLightStatus == "Stop") {
    digitalWrite(LED_BUILTIN, LOW);  // turn off the LED
  } else if (espLightStatus == "Reset") {
    unsigned long currentMillis = millis();                  // get the current timeF
    if (currentMillis - previousMillisLed >= intervalLed) {  // check if the interval has elapsed
      previousMillisLed = currentMillis;                     // save the last time the LED was updated
      digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));  // toggle the LED state
    }
  }
}
// void lightStatus() {
//   int httpResponseCode = httpGetLightStatus.GET();
//   if (httpResponseCode > 0) {
//     pressLightStatus = httpGetLightStatus.getString();
//     pressLightStatus.remove(0, 1);
//     pressLightStatus.remove(pressLightStatus.length() - 1, 1);
//     JSONVar myObject = JSON.parse(pressLightStatus);
//     JSONVar keys = myObject.keys();
//     JSONVar id = myObject[keys[0]];
//     String valArr = JSON.stringify(myObject[keys[0]]);
//     valArr.remove(0, 1);
//     valArr.remove(valArr.length() - 1, 1);
//     Serial.println("valArr: ");
//     Serial.println(valArr);
//     if (valArr == "start") {
//       digitalWrite(LED_BUILTIN, HIGH);  // turn on the LED
//     } else if (valArr == "stop") {
//       digitalWrite(LED_BUILTIN, LOW);  // turn off the LED
//     } else if (valArr == "reset") {
//       unsigned long currentMillis = millis();                  // get the current timeF
//       if (currentMillis - previousMillisLed >= intervalLed) {  // check if the interval has elapsed
//         previousMillisLed = currentMillis;                     // save the last time the LED was updated
//         digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));  // toggle the LED state
//       }
//     }
//   }
//   if (pressLightStatus != displayLightStatus) {
//     displayLightStatus = pressLightStatus;
//     httpUpdateLightStatus.addHeader("Content-Type", "application/json");
//     int httpResponseCode = httpUpdateLightStatus.POST(displayLightStatus);
//     Serial.print("httpResponseCode: ");
//     Serial.println(httpResponseCode);
//     Serial.print("displayLightStatus: ");
//     Serial.println(displayLightStatus);
//   }
// }