// Khai báo các biến liên quan đến cảm biến siêu âm
const int trigPin = 18;
const int echoPin = 19;

// Khai báo các biến liên quan đến module điều khiển động cơ L298N
const int enA = 21;
const int in1 = 22;
const int in2 = 23;

// Khai báo các biến PID
double Setpoint = 0, Input = 0, Output = 0;
double Kp = 60, Ki = 0, Kd = 0.087;
PID myPID(&Input, &Output, &Setpoint, Kp, Ki, Kd, DIRECT);
long duration, distance, waterLevel;
double error;
const int TANK_HEIGHT = 27;
void getDataSensor() {
  Setpoint = node2Recv.setpoint;
  // Setpoint = 20;
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
  waterLevel = TANK_HEIGHT - distance;
  // Lấy giá trị đo được để tính tỷ lệ lỗi so với mức nước mong muốn
  error = Setpoint - waterLevel;
  // Đưa giá trị lỗi vào PID để tính toán đầu ra
  Input = waterLevel;
  myPID.Compute();
  String buzzerMotor = "";
  // node2Recv.motorStatus = 1;
  if (node2Recv.motorStatus == 1) {
    // Điều khiển tốc độ động cơ bơm nước theo giá trị đầu ra của PID
      digitalWrite(in1, LOW);
      digitalWrite(in2, HIGH);
      analogWrite(enA, abs(Output));
      buzzerMotor = "Motor ON";
      // Serial.println("Motor ON");
  } else {
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    analogWrite(enA, 0);
    buzzerMotor = "Motor OFF";
    // Serial.println("Motor OFF with 0");
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
  messageSend.ID = 5;
  messageSend.Data1 = waterLevel;
  messageSend.Data2 = error;
  messageSend.Data3 = Output;
  messageSend.Data4 = 4;
}