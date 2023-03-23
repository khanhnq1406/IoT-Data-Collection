#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <algorithm>
#include <ArduinoJson.h>
const char* ssid = "Room 302";
const char* password = "0964237887";
String serverName = "https://rstdxxyobzxqaggqcjrz.supabase.co/rest/v1/data_input?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE";
unsigned long lastTime = 0;
unsigned long timerDelay = 100;

void setup() {
  Serial.begin(115200);
  delay(1000);

  WiFi.mode(WIFI_STA);  //Optional
  WiFi.begin(ssid, password);
  Serial.println("\nConnecting");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      String serverPath = serverName;

      // Your Domain name with URL path or IP address with path
      http.begin(serverPath.c_str());

      // If you need Node-RED/server authentication, insert user and password below
      //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");

      // Send HTTP GET request
      int httpResponseCode = http.GET();

      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        char c;
        char no = '[';  //character I want removed.
        int count = 0;
        for (int i = 0; i < payload.length() - 1; ++i) {
          c = payload.charAt(i);
          if (c == no) {
            payload.remove(i, 1);
            break;
          }
        }
        no = ']';
        for (int i = 0; i < payload.length() - 1; ++i) {
          c = payload.charAt(i);
          if (c == no) {
            payload.remove(i, 1);
            break;
          }
        }

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
        int valArr[count+1];
        for (int i = 0; i <= count; i++) {
          // Serial.println(payload);
          JSONVar myObject = JSON.parse(payload);
          JSONVar keys = myObject.keys();
          JSONVar id = myObject[keys[0]];
          // JSONVar value = myObject[keys[1]];
          // String tempStr = JSON.stringify(value);
          valArr[i] = int(myObject[keys[1]]);
          Serial.print("valArr ");
          Serial.print(id);
          Serial.print(" = ");
          Serial.println(valArr[i]);
          int firstComma = payload.indexOf(',');
          payload.remove(0,payload.indexOf(',',firstComma+1)+1);
        }
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
