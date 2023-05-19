void getData() {
  unsigned long start = millis();
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
      Serial.print("name: ");
      Serial.println(name);
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
          // int httpResponseCode;
          // do {
          //   httpResponseCode = httpUpdateLightStatus.POST(message);
          // } while (httpResponseCode != 200);
          // Serial.print("httpResponseCode: ");
          // Serial.println(httpResponseCode);
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