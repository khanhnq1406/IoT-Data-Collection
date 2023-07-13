# from pyModbusTCP.client import ModbusClient
# import serial
# import time
# port = serial.Serial(port = 'COM5', baudrate = 9600, timeout=.1)

# client = ModbusClient('192.168.3.10')

# print(client.open())
# regs = client.read_holding_registers(2,1)

# cmd = "product1 " + str(regs[0])
# res = port.write(cmd.encode())
# client.close()

from pymodbus.client.sync import ModbusTcpClient
from time import sleep
client = ModbusTcpClient('192.168.3.10')
print(client.connect())
stt = client.write_register(0,1)
# stt = client.read(2,1)
client.close()
print(stt)
