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
  /*Ta biết thời gian âm thanh truyền trong không khí ở 20°C là 344 m/s.
  Bằng quy tắc tam suất đơn giản ta có thể dễ dàng tính được sóng âm di chuyển 1 cm trong không khí sẽ mất 1000 / 344 * 100 ~= 29.1 ms. 
  Do thời gian được tính từ lúc phát tín hiệu tới khi sóng âm phản xạ lại, vì vậy ta chia đôi sẽ ra được quãng đường mà sóng âm đã đi.
  */
  distance = (duration / 2) / 29.1;
  waterLevel = 40 - distance;
  // Lấy giá trị đo được để tính tỷ lệ lỗi so với mức nước mong muốn
  error = Setpoint - distance;

  // Đưa giá trị lỗi vào PID để tính toán đầu ra
  Input = distance;
  myPID.Compute();
  if (espLightStatus[1] == "Start") {
    // Điều khiển tốc độ động cơ bơm nước theo giá trị đầu ra của PID
    if (Output > 100) {
      digitalWrite(in1, LOW);
      digitalWrite(in2, HIGH);
      analogWrite(enA, abs(Output));
    } else {
      digitalWrite(in1, LOW);
      digitalWrite(in2, LOW);
      analogWrite(enA, 0);
    }
    Serial.println("---------------------");
    Serial.print("Setpoint: ");
    Serial.println(Setpoint);
    Serial.print("distance: ");
    Serial.println(distance);
    Serial.print("waterLevel: ");
    Serial.println(waterLevel);
    Serial.print("Output: ");
    Serial.println(Output);
    Serial.print("error: ");
    Serial.println(error);
    Serial.println("---------------------");
  } else {
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    analogWrite(enA, 0);
  }
}