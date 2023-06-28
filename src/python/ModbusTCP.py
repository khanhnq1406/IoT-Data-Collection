from pyModbusTCP.client import ModbusClient

client = ModbusClient('192.168.3.10')

print(client.open())

# regs = client.read_coils(0,10)
# regs = client.write_single_coil(0,True)
regs = client.read_holding_registers(15,10)
print(regs)
client.write_multiple_registers
client.write_single_register(15,10)
regs = client.read_holding_registers(15,10)
print(regs)
client.close()


