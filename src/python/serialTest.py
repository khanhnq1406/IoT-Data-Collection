import serial
import time
port = serial.Serial(port = 'COM5', baudrate = 9600, timeout=.1)

cmd = "product3 1"
res = port.write(cmd.encode())
# port.close()
# time.sleep(0.05)
data = port.readline() # nhận data từ arduino
print(data)
# print(res)