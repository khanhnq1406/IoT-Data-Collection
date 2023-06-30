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
// Time delay
unsigned long previousMillisDHT = 0;  // variable to store the previous time
const long intervalDHT = 5000;
void getDataSensor() {
  // unsigned long currentMillis = millis();
  // if (currentMillis - previousMillisDHT >= intervalDHT) {
    uint8_t error = read_dht(temperature, humidity, DHT11PIN, DHT11, 1);
    if (error) {
      Serial.println(error);
    } else {
      Serial.print("Temperature: ");
      Serial.println(temperature);
      Serial.print("Humidity: ");
      Serial.println(humidity);
    }
  //   previousMillisDHT = currentMillis;
  // }
  // temperature = random(30,31);
  // humidity = random(60,65);
  // gas = random(1000,2000);
  // gas = digitalRead(MQ_DPIN);
  
  gas = analogRead(MQ_PIN); /*Analog value read function*/
  Serial.print("Gas Sensor: ");
  Serial.println(gas); /*Read value printed*/
  if (gas > node3Recv.maxGas || node3Recv.maxTemperature < temperature || node3Recv.minTemperature > temperature) {
    digitalWrite(Buzzer, HIGH);
    Serial.println("Buzzer ON");
  } else {
    digitalWrite(Buzzer, LOW);
    Serial.println("Buzzer OFF");
  }
  if (node3Recv.serverStatus == 0) {
    Serial.println("Motor OFF");
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    analogWrite(enA, 0);
  } else if (node3Recv.serverStatus == 1) {
    Serial.println("Motor ON");
    digitalWrite(in1, LOW);
    digitalWrite(in2, HIGH);
    analogWrite(enA, 255);
  }

  messageSend.ID = 6;
  messageSend.Data1 = temperature;
  messageSend.Data2 = humidity;
  messageSend.Data3 = gas;
}