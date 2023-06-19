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

  JsonObject& dataObject1 = root.createNestedObject("Product1"); 
  dataObject1["name"] = "Product1";
  dataObject1["value"] = random(100);
  dataObject1["id"] = 1;

  JsonObject& dataObject2 = root.createNestedObject("Product2"); 
  dataObject2["name"] = "Product2";
  dataObject2["value"] = random(100);
  dataObject2["id"] = 2;

  JsonObject& dataObject3 = root.createNestedObject("Product3"); 
  dataObject3["name"] = "Product3";
  dataObject3["value"] = random(100);
  dataObject3["id"] = 3;

  JsonObject& dataObject13 = root.createNestedObject("FaultyProduct"); 
  dataObject13["name"] = "FaultyProduct";
  dataObject13["value"] = random(100);
  dataObject13["id"] = 13;

  JsonObject& dataObject14 = root.createNestedObject("Running"); 
  dataObject14["name"] = "Running";
  dataObject14["value"] = random(100);
  dataObject14["id"] = 14;

  JsonObject& dataObject15 = root.createNestedObject("OffHour"); 
  dataObject15["name"] = "OffHour";
  dataObject15["value"] = random(100);
  dataObject15["id"] = 15;

  String postData;
  root.printTo(postData);
  Serial.println(postData);
  httpUploadData.addHeader("Content-Type", "application/json");
  int httpResponseCode = httpUploadData.POST(postData);
  Serial.print("updateData Status: ");
  Serial.println(httpResponseCode);
}