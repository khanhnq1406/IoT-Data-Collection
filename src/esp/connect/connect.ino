#include <WiFi.h>
#include <WebSocketClient.h>
 
const char* ssid     = "#######";
const char* password = "####";
 
char path[] = "/";
char host[] = "192.168.#.##";
 
WebSocketClient webSocketClient;
WiFiClient client;

void connnect(){
   if (client.connect(host, 5000)) {
    Serial.println("Connected");
  } else {
    Serial.println("Connection failed.");
  }
 
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  } else {
    Serial.println("Handshake failed.");
  }
}
void setup() {
  Serial.begin(115200);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
 
  delay(5000);
 
 connnect();
 
}
 
void loop() {
  String data;
 
  if (client.connected()) {
 
    webSocketClient.sendData("Info to be echoed back");
 
    webSocketClient.getData(data);
    if (data.length() > 0) {
      Serial.print("Received data: ");
      Serial.println(data);
    }
 
  } else {
    Serial.println("Client disconnected.");
    connnect();
  }
 
  delay(3000);
 
}
