import socket
import time

#create an INET, STREAMing socket (IPv4, TCP/IP)
try:
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
except socket.error:
    print('Failed to create socket')

print('Socket Created')

ROBOT_IP= "192.168.3.10"
ROBOT_PORT = 502
#Connect the socket object to the robot using IP address (string) and port (int)
client.connect((ROBOT_IP,ROBOT_PORT))

print('Socket Connected to ' + ROBOT_IP )
res = client.send(bytes("Abc"+'\0','ascii'))
print(res)
#Read the response sent by robot upon connecting
# msg = client.recv(1024).decode('ascii')
# print(msg)


