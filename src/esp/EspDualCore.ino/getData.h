void getData() {
  Serial.println("Start getting data...");
  int httpResponseCode = httpGetData.GET();
  if (httpResponseCode > 0) {
    Serial.print("httpGetData Response code: ");
    Serial.println(httpResponseCode);
    String payload = httpGetData.getString();
    Serial.print("payload: ");
    Serial.println(payload);
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
        
      }
    }
    String valArr[count + 1];
    for (int i = 0; i <= 19; i++) {
      JSONVar myObject = JSON.parse(payload);
      JSONVar keys = myObject.keys();
      String id = JSON.stringify(myObject[keys[0]]);
      String val = JSON.stringify(myObject[keys[1]]);
      String name = JSON.stringify(myObject["name"]);
      String max = JSON.stringify(myObject["max"]);
      String min = JSON.stringify(myObject["min"]);
      if (name.lastIndexOf("Data7")>=0) {
        node3.maxTemperature = max.toFloat();
        node3.minTemperature = min.toFloat();
      }
      if (name.lastIndexOf("Data8")>=0) {
        node3.maxGas = max.toFloat();
        node3.minGas = min.toFloat();
      }
      if (id.toInt() == LIGHT1 || id.toInt() == LIGHT2 || 
          id.toInt() == LIGHT3 || id.toInt() == LIGHT4 || id.toInt() == LIGHT5) {
        int indexLight;
        switch (id.toInt()) {
          case LIGHT1: indexLight = 0; break;
          case LIGHT2: indexLight = 1; break;
          case LIGHT3: indexLight = 2; break;
          case LIGHT4: indexLight = 3; break;
          case LIGHT5: indexLight = 4; break;
        }
        serverLightStatus[indexLight] = JSON.stringify(myObject[keys[5]]);
        serverLightStatus[indexLight].remove(0, 1);
        serverLightStatus[indexLight].remove(serverLightStatus[indexLight].length() - 1, 1);
        // if (serverLightStatus[indexLight] != espLightStatus[indexLight]) {
        //   espLightStatus[indexLight] = serverLightStatus[indexLight];
        //   Serial.println(espLightStatus[indexLight]);

        //   // Send esp-side status
        //   StaticJsonBuffer<200> jsonBuffer;
        //   JsonObject& root = jsonBuffer.createObject();

        //   // Add some data to the JSON object
        //   root["espData"] = espLightStatus[indexLight];
        //   root["name"] = name;
        //   // Serialize JSON object to string
        //   String message;
        //   root.printTo(message);
        //   httpUpdateLightStatus.addHeader("Content-Type", "application/json");
        //   int httpResponseCode, countRes = 0;
        //   do {
        //     countRes++;
        //     httpResponseCode = httpUpdateLightStatus.POST(message);
        //   } while (httpResponseCode != 200 && countRes < 200);
        //   Serial.print("httpResponseCode: ");
        //   Serial.println(httpResponseCode);
        // }
      }
      payload.remove(0, payload.indexOf('}') + 2);
    }
  } else {
    Serial.print("Error code get data: ");
    Serial.println(httpResponseCode);
  }
}