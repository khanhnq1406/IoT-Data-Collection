void updateData() {
  StaticJsonBuffer<2000> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  JsonObject& dataObject7 = root.createNestedObject("Temperature"); 
  dataObject7["name"] = "Temperature";
  dataObject7["value"] = node3.temperature;
  dataObject7["id"] = 7;

  JsonObject& dataObject8 = root.createNestedObject("PPM"); 
  dataObject8["name"] = "PPM";
  dataObject8["value"] = node3.gas;
  dataObject8["id"] = 8;
  
  JsonObject& dataObject10 = root.createNestedObject("Humidity"); 
  dataObject10["name"] = "Humidity";
  dataObject10["value"] = node3.humidity;
  dataObject10["id"] = 10;

  JsonObject& dataObject4 = root.createNestedObject("WaterLevel"); 
  dataObject4["name"] = "Water Level";
  dataObject4["value"] = waterLevel;
  dataObject4["id"] = 4;

  JsonObject& dataObject5 = root.createNestedObject("Error"); 
  dataObject5["name"] = "Error";
  dataObject5["value"] = error;
  dataObject5["id"] = 5;

  JsonObject& dataObject6 = root.createNestedObject("PWM"); 
  dataObject6["name"] = "PWM";
  dataObject6["value"] = Output;
  dataObject6["id"] = 6;

  String postData;
  root.printTo(postData);
  Serial.println(postData);
  httpUploadData.addHeader("Content-Type", "application/json");
  int httpResponseCode = httpUploadData.POST(postData);
  Serial.print("updateData Status: ");
  Serial.println(httpResponseCode);
}