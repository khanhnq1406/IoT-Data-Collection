// Khai báo các biến liên quan đến cảm biến siêu âm
const int trigPin = 18;
const int echoPin = 19;

// Khai báo các biến liên quan đến module điều khiển động cơ L298N
const int enA = 21;
const int in1 = 22;
const int in2 = 23;

// Khai báo các biến PID
double Setpoint=0, Input=0, Output=0;
double Kp = 20, Ki = 0, Kd = 0.1;
PID myPID(&Input, &Output, &Setpoint, Kp, Ki, Kd, REVERSE);
long duration, distance, waterLevel;
double error;
void getDataSensor() {
  Setpoint = node2Recv.setpoint;
  
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
  String buzzerMotor = "";
  if (node2Recv.motorStatus == 1) {
    // Điều khiển tốc độ động cơ bơm nước theo giá trị đầu ra của PID
    if (Output > 100) {
      digitalWrite(in1, LOW);
      digitalWrite(in2, HIGH);
      analogWrite(enA, abs(Output));
      buzzerMotor = "Motor ON";
    } else {
      digitalWrite(in1, LOW);
      digitalWrite(in2, LOW);
      analogWrite(enA, 0);
      buzzerMotor = "Motor ON";
    }
  } else {
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    analogWrite(enA, 0);
    buzzerMotor = "Motor OFF";
  }
  // Serial.println("---------------------");
  //   Serial.print("Setpoint: ");
  //   Serial.println(Setpoint);
  //   Serial.print("distance: ");
  //   Serial.println(distance);
  //   Serial.print("waterLevel: ");
  //   Serial.println(waterLevel);
  //   Serial.print("Output: ");
  //   Serial.println(Output);
  //   Serial.print("error: ");
  //   Serial.println(error);
  //   Serial.println("---------------------");

        Mgs_d = String("WL: ") + String (waterLevel) + "\n" + 
                String("ERR: ") + String (error) + "\n" + 
                buzzerMotor + "\n" + 
                String("SP: ") + String (Setpoint) + "\n";
    display.clearDisplay();
    display.setTextSize(2); // Draw 2X-scale text
    display.setTextColor(WHITE,BLACK);
    display.setCursor(0, 0);
    display.println(Mgs_d);
    display.display();      // Show initial text[]]
  messageSend.ID = 5;
  messageSend.Data1 = waterLevel;
  messageSend.Data2 = error;
  messageSend.Data3 = Output;
  messageSend.Data4 = 4;
}