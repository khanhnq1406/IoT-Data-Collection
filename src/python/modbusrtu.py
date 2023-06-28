from pymodbus.client.sync import ModbusSerialClient
from time import sleep
while True:
    client = ModbusSerialClient(
        method='rtu',
        port='COM7',
        baudrate=115200,
        timeout=3,
        parity='E',
        stopbits=1,
        bytesize=8
    )
    if client.connect():  # Trying for connect to Modbus Server/Slave
        '''Reading from a holding register with the below content.'''
        # res = client.read_holding_registers(address=15, count=1, unit=1)

        # '''Reading from a discrete register with the below content.'''
        # # res = client.read_discrete_inputs(address=1, count=1, unit=1)

        # if not res.isError():
        #     print(res.registers)
        # else:
        print("Connected")
    else:
        print('Cannot connect to the Modbus Server/Slave')
    sleep(1)