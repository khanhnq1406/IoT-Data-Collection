/*
Error codes
0: OK
1: TOO_SOON
2: DRIVER
3: TIMEOUT
4: NACK
5: BAD_DATA
6: CHECKSUM
7: UNDERFLOW
8: OVERFLOW
*/
void updateStatus(String espData, String serverNameData, String name);
void getTemperature() {
  uint8_t error = read_dht(node3.temperature, node3.humidity, DHT11PIN, DHT11, 0);
  if (error) {
    Serial.println(error);
  } else {
    Serial.print("Temperature: ");
    Serial.println(node3.temperature);
    Serial.print("Humidity: ");
    Serial.println(node3.humidity);
  }
  node3.gas = digitalRead(MQ_DPIN);
  // node3.gas = analogRead(MQ_PIN);  /*Analog value read function*/
  Serial.print("Gas Sensor: ");
  Serial.println(node3.gas); /*Read value printed*/

  if (node3.gas == 0 || node3.maxTemperature < node3.temperature || node3.minTemperature > node3.temperature) {
    digitalWrite(Buzzer, HIGH);
  } else {
    digitalWrite(Buzzer, LOW);
  }
  if (node3.gas == 0 && (node3.maxTemperature < node3.temperature || node3.minTemperature > node3.temperature) && node3.hasAlarm == false) {
    node3.hasAlarm = true;
    espLightStatus[2] = "Start";
    serverLightStatus[2] = "Start";
    updateStatus("Start", "Start", "Light3");
  }
  if (node3.hasAlarm == true) {
    if (serverLightStatus[2].indexOf("Stop") >= 0 && espLightStatus[2] != serverLightStatus[2]) {
      espLightStatus[2] = "Stop";
      updateStatus("Stop", "Stop", "Light3");
    }
    if (serverLightStatus[2].indexOf("Start") >= 0 && espLightStatus[2] != serverLightStatus[2]) {
      espLightStatus[2] = "Start";
      updateStatus("Start", "Start", "Light3");
    }
  }
  if ((node3.gas == 1 || !(node3.maxTemperature < node3.temperature || node3.minTemperature > node3.temperature)) && node3.hasAlarm == true) {
    node3.hasAlarm = false;
    espLightStatus[2] = "Stop";
    serverLightStatus[2] = "Stop";
    updateStatus("Stop", "Stop", "Light3");
  }
  if (node3.hasAlarm == false) {
    if (serverLightStatus[2].indexOf("Start") >= 0 && espLightStatus[2] != serverLightStatus[2]) {
      espLightStatus[2] = "Start";
      updateStatus("Start", "Start", "Light3");
    }
    if (serverLightStatus[2].indexOf("Stop") >= 0 && espLightStatus[2] != serverLightStatus[2]) {
      espLightStatus[2] = "Stop";
      updateStatus("Stop", "Stop", "Light3");
    }
  }
}
void updateStatus(String espData, String serverNameData, String name) {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  // Add some data to the JSON object
  root["espData"] = espData;
  root["serverData"] = serverNameData;
  root["name"] = name;
  // Serialize JSON object to string
  String message;
  root.printTo(message);
  httpUpdateLightStatus.addHeader("Content-Type", "application/json");
  int httpResponseCode, countRes = 0;
  do {
    countRes++;
    httpResponseCode = httpUpdateLightStatus.POST(message);
  } while (httpResponseCode != 200 && countRes < 200);
  Serial.print("httpResponseCode: ");
  Serial.println(httpResponseCode);
}