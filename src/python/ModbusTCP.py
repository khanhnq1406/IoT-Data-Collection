# from pyModbusTCP.client import ModbusClient

# client = ModbusClient('192.168.3.10')

# print(client.open())

# # regs = client.read_coils(0,10)
# # regs = client.write_single_coil(0,1)
# regs = client.read_holding_registers(1,10)
# print(regs)
# client.write_single_register(0,2)
# # regs = client.read_holding_registers(100,1)
# # print(regs)
# client.close()

from pymodbus.client.sync import ModbusTcpClient

client = ModbusTcpClient('192.168.3.10')
print(client.connect())
stt = client.read_coils(0,0)
print(stt)
