#include <Arduino.h>
#include <otadrive_esp.h>
#include <WiFi.h>
struct WifiConfig {
  //Room
  const char* roomSsid = "Room 302";
  const char* roomPassword = "0964237887";
  String roomIp = "192.168.3.101:5000";
  // Home
  const char* homeSsid = "Moc My";
  const char* homePassword = "123456789";

  //Lau 3
  const char* lau3Ssid = "Lau3";
  const char* lau3Password = "khongcopass123";
  // others
  const char* someWhereSsid = "Yancoffee & Tea";
  const char* someWherePassword = "Cherrytea";
};
struct WifiConfig wifiConfig;
const char* ssid = wifiConfig.lau3Ssid;
const char* password = wifiConfig.lau3Password;
void setup() {
  OTADRIVE.setInfo("799528b0-d8d0-409d-862c-a40a1e102186", "v@1.1.1");
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());

  pinMode(LED_BUILTIN, OUTPUT);
}

void sync_task() {
  // a simple timing mechanism to reduce server connectivity
  // 60 seconds check
  if (!OTADRIVE.timeTick(60))
    return;

  if (WiFi.status() != WL_CONNECTED)
    return;

  // do sync and update operations here
  OTADRIVE.updateFirmware();
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
  Serial.println("This is version 2");
  sync_task();
}