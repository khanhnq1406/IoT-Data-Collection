void updateLightStatus() {
  if (serverLightStatus[1].indexOf("Start") >= 0 && espLightStatus[1] != serverLightStatus[1]) {
    espLightStatus[1] = "Start";
    Serial.println("Debug 5: " + espLightStatus[1] + "..." + serverLightStatus[1]);
    updateStatus("Start", "Start", "Light2");
  }
  if (serverLightStatus[1].indexOf("Stop") >= 0 && espLightStatus[1] != serverLightStatus[1]) {
    espLightStatus[1] = "Stop";
    Serial.println("Debug 11: " + espLightStatus[1] + "..." + serverLightStatus[1]);
    updateStatus("Stop", "Stop", "Light2");
  }
}
void node2Handle() {
  // Đo khoảng cách từ cảm biến siêu âm đến mực nước hiện tại
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = (duration / 2) / 29.1;
  waterLevel = 50 - distance;
  // Lấy giá trị đo được để tính tỷ lệ lỗi so với mức nước mong muốn
  error = Setpoint - waterLevel;

  // Đưa giá trị lỗi vào PID để tính toán đầu ra
  Input = error;
  myPID.Compute();
  updateLightStatus();
  if (espLightStatus[1] == "Start") {
    // Điều khiển tốc độ động cơ bơm nước theo giá trị đầu ra của PID
    if (Output > 0) {
      digitalWrite(in1, HIGH);
      digitalWrite(in2, LOW);
      analogWrite(enA, Output);
    } else if (Output < 0) {
      digitalWrite(in1, LOW);
      digitalWrite(in2, HIGH);
      analogWrite(enA, abs(Output));
    } else {
      digitalWrite(in1, LOW);
      digitalWrite(in2, LOW);
      analogWrite(enA, 0);
    }
    Serial.print("Setpoint: ");
    Serial.println(Setpoint);
    Serial.print("distance: ");
    Serial.println(distance);
    Serial.print("Output: ");
    Serial.println(Output);
  } else {
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    analogWrite(enA, 0);
  }
}