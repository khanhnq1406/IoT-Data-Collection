from pyModbusTCP.client import ModbusClient

client = ModbusClient('192.168.0.120')

print(client.open())

regs = client.read_coils(15, 10)
print(regs)
client.close()

