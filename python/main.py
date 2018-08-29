import serial
ser = serial.Serial('COM3', 9600)  
print("Se inicio el server de pyhon") 

ser.write(b"#0#192.168.1.3")
ser.write(b"#1#001122334455")

while True:
	x = ser.read(15)      
	print(x) 
		
ser.close()             