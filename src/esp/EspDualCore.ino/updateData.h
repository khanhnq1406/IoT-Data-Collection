void updateData() {
  StaticJsonBuffer<2000> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  
  for (int i = 1; i <= 20; i++) {
    int dataValue = random(40, 51);
    if (i != LIGHT1 && i != LIGHT2 && i != LIGHT3 && i != LIGHT4 && i != LIGHT5) {
      String dataName = "Data" + String(i);
      Serial.println(dataName);
      JsonObject& dataObject = root.createNestedObject(dataName); 
      dataObject["name"] = dataName;
      dataObject["value"] = dataValue;
      dataObject["id"] = i;
    }
  }
  String postData;
  root.printTo(postData);
  Serial.println(postData);
  httpUploadData.addHeader("Content-Type", "application/json");
  int httpResponseCode = httpUploadData.POST(postData);
}