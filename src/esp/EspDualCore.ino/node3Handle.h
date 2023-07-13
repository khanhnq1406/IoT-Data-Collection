void updateStatus(String espData, String serverNameData, String name);
void node3Handle() {
  
  node3MasterSend.maxTemperature = node3.maxTemperature;
  node3MasterSend.minTemperature = node3.minTemperature;
  node3MasterSend.maxGas = node3.maxGas;
  node3MasterSend.minGas = node3.minGas;
  node3MasterSend.espStatus = node3.espStatus;
  node3MasterSend.serverStatus = node3.serverStatus;
  // Serial.println(String("maxTemperature: ") + String(node3.maxTemperature));
  // Serial.println(String("minTemperature: ") + String(node3.minTemperature));
  // Serial.println(String("maxGas: ") + String(node3.maxGas));
  // Serial.println(String("minGas: ") + String(node3.minGas));
  // Serial.println(String("espStatus: ") + String(node3.espStatus));
  // Serial.println(String("serverStatus: ") + String(node3.serverStatus));
  
  if ((node3.maxGas < node3.gas || node3.minGas > node3.gas) && (node3.maxTemperature < node3.temperature || node3.minTemperature > node3.temperature) && node3.hasAlarm == false) {
    node3.hasAlarm = true;
    espLightStatus[2] = "Start";
    serverLightStatus[2] = "Start";
    node3.espStatus = node3.serverStatus = 1;
    updateStatus("Start", "Start", "Light3");
    Serial.println("Line 23");
  }
  if (node3.hasAlarm == true) {
    if (serverLightStatus[2].indexOf("Stop") >= 0 && espLightStatus[2] != serverLightStatus[2]) {
      espLightStatus[2] = "Stop";
      node3.espStatus = node3.serverStatus = 0;
      updateStatus("Stop", "Stop", "Light3");
      Serial.println("Line 30");  
    }
    if (serverLightStatus[2].indexOf("Start") >= 0 && espLightStatus[2] != serverLightStatus[2]) {
      espLightStatus[2] = "Start";
      node3.espStatus = node3.serverStatus = 1;
      updateStatus("Start", "Start", "Light3");
      Serial.println("Line 36");
    }
  }
  if ((!(node3.maxGas < node3.gas || node3.minGas > node3.gas) || !(node3.maxTemperature < node3.temperature || node3.minTemperature > node3.temperature)) && node3.hasAlarm == true) {
    node3.hasAlarm = false;
    espLightStatus[2] = "Stop";
    serverLightStatus[2] = "Stop";
    node3.espStatus = node3.serverStatus = 0;
    updateStatus("Stop", "Stop", "Light3");
    Serial.println("Line 45");
  }
  if (node3.hasAlarm == false) {
    if (serverLightStatus[2].indexOf("Start") >= 0 && espLightStatus[2] != serverLightStatus[2]) {
      espLightStatus[2] = "Start";
      node3.espStatus = node3.serverStatus = 1;
      updateStatus("Start", "Start", "Light3");
      Serial.println("Line 52");
    }
    if (serverLightStatus[2].indexOf("Stop") >= 0 && espLightStatus[2] != serverLightStatus[2]) {
      espLightStatus[2] = "Stop";
      node3.espStatus = node3.serverStatus = 0;
      updateStatus("Stop", "Stop", "Light3");
      Serial.println("Line 58");
    }
  }
  Serial.println("End node3HandleFunction");
}
void updateStatus(String espData, String serverNameData, String name) {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  Serial.println("Start update status node 3");
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
    Serial.println(String("reResponse node 3: ") + String(countRes));
    countRes++;
    httpResponseCode = httpUpdateLightStatus.POST(message);
  } while (httpResponseCode != 200 && countRes < 10);
  Serial.print("httpResponseCode: ");
  Serial.println(httpResponseCode);
}

