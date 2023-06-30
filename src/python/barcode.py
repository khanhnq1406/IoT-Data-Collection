# pip install -r requirements.txt
from time import sleep
import cv2
from pyzbar import pyzbar
camera = cv2.VideoCapture(0)
from pyModbusTCP.client import ModbusClient

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
        print (barcode.type)
        if barcode_text == "8931101199916":
            print("Xylanh 1")
            client.write_single_register(0,1)
        elif barcode_text == "8931101199923":
            print("Xylanh 2")
            client.write_single_register(0,2)
        elif barcode_text == "8931101199947":
            print("Xylanh 3")
            client.write_single_register(0,3)
        else:
            print("Error")
            client.write_single_register(0,4)
        cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
    cv2.imshow('Barcode reader',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): 
        break
camera.release()
cv2.destroyAllWindows()