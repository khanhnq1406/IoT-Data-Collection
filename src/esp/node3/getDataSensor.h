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
void getDataSensor() {
  uint8_t error = read_dht(temperature, humidity, DHT11PIN, DHT11, 0);
  if (error) {
    Serial.println(error);
  } else {
    Serial.print("Temperature: ");
    Serial.println(temperature);
    Serial.print("Humidity: ");
    Serial.println(humidity);
  }
  temperature = random(29,31);
  humidity = random(50,70);
  gas = random(1000,2000);
  // gas = digitalRead(MQ_DPIN);
  // gas = analogRead(MQ_PIN);  /*Analog value read function*/
  // Serial.print("Gas Sensor: ");
  // Serial.println(gas); /*Read value printed*/
  String buzzerBuf="";
  String motorBuf="";
  if (gas == 0 || node3Recv.maxTemperature < temperature || node3Recv.minTemperature > temperature) {
    digitalWrite(Buzzer, HIGH);
    Serial.println("Buzzer ON");
    buzzerBuf = "Buzzer ON";
  } else {
    digitalWrite(Buzzer, LOW);
    Serial.println("Buzzer OFF");
    buzzerBuf = "Buzzer OFF";
  }
  if (node3Recv.serverStatus == 0 ){
    Serial.println("Motor OFF");
    motorBuf = "Motor OFF";
  }
  else {
    Serial.println("Motor ON");
    motorBuf = "Motor ON";
  }
    Mgs_d = String("Temp: ") + String (node3Recv.maxTemperature) + "\n" + 
          String("Gas: ") + String (node3Recv.maxGas) + "\n" + 
          buzzerBuf + "\n" + 
          motorBuf + "\n";
    display.clearDisplay();
    display.setTextSize(2); // Draw 2X-scale text
    display.setTextColor(WHITE,BLACK);
    display.setCursor(0, 0);
    display.println(Mgs_d);
    display.display();      // Show initial text[]]
  messageSend.ID = 4;
  messageSend.Data1 = temperature;
  messageSend.Data2 = humidity;
  messageSend.Data3 = gas;
}