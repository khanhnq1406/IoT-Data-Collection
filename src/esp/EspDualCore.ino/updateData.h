void updateData() {
  int data[8];
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  JsonArray& dataArray = root.createNestedArray("data");
  for (int i = 0; i < 8; i++) {
    data[i] = random(100);  // Generate a random number between 0 and 99
    dataArray.add(data[i]);
  }
  String postData;
  root.printTo(postData);

  httpUploadData.addHeader("Content-Type", "application/json");
  int httpResponseCode = httpUploadData.POST(postData);
}