# pip install -r requirements.txt
from time import sleep
import cv2
from pyzbar import pyzbar
camera = cv2.VideoCapture(0)
from pyModbusTCP.client import ModbusClient
from time import sleep
client = ModbusClient('192.168.3.10')
print(client.open())
# client.write_single_register(100,0)

barcode = ["8931101199916", "8931101199923" ,"8931101199954"]
PRODUCT1 = 0
PRODUCT2 = 1
PRODUCT3 = 2

while True:
    r, frame = camera.read() 
    barcodes = pyzbar.decode(frame)
    for barcode in barcodes:
        x,y,w,h = barcode.rect
        barcode_text=barcode.data.decode('utf-8')
        print (barcode_text)
        # print (barcode.type)
        if barcode_text == "8931101199916":
            result = client.write_single_register(0,1)
            print(result)
            print("code 1")
        elif barcode_text == "8931101199923":
            result =client.write_single_register(0,2)
            print(result)
            print("code 2")
        elif barcode_text == "8931101199947":
            result =client.write_single_register(0,3)
            print(result)
            print("code 3")
        else:
            result =client.write_single_register(0,4)
            print(result)
            print("error")
        cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
    cv2.imshow('Barcode reader',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): 
        break
camera.release()
cv2.destroyAllWindows()