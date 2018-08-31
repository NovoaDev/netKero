#include <LiquidCrystal.h>

#define BOTTON_SI 2
#define BOTTON_NO 3
#define DIGITAL_LEDAZUL 4
#define DIGITAL_LEDVERDE 5
#define DIGITAL_LEDROJO 6
#define DIGITAL_BUZZER 13

LiquidCrystal lcd(7, 8, 9, 10, 11, 12);

String sEquipos;
String sMAC;
String inString; 
String sDatosPrefijo;
String sDatosFinal;
int iLargoDatos;
int iPulsadorSI;
int iPulsadorNO;
bool bRefrescarLCD;
bool bPregunta;

void setup() {
  Serial.begin(9600);

  pinMode(BOTTON_SI, INPUT);
  pinMode(BOTTON_NO, INPUT);
  pinMode(DIGITAL_LEDVERDE, OUTPUT);
  pinMode(DIGITAL_LEDAZUL, OUTPUT);
  pinMode(DIGITAL_LEDROJO, OUTPUT);
  pinMode(DIGITAL_BUZZER, OUTPUT);

  //Valores inciales 
  bRefrescarLCD = false;
  iPulsadorSI = LOW;
  iPulsadorNO = LOW;

  sEquipos = "0";
  sMAC = "";

  ledVERDEAZULROJO(LOW, HIGH, LOW);
  
  lcd.begin(16, 2);
  printLCD("netKero", "By: Lola");
  
  delay(2000);
}

void loop() {
  inString =  Serial.readStringUntil('\n'); 
  sDatosPrefijo = inString.substring(0, 3);
  iLargoDatos = inString.length();
  sDatosFinal = inString.substring(3, iLargoDatos);

  if (sDatosPrefijo == "#0#") { sEquipos = sDatosFinal; }
  if (sDatosPrefijo == "#1#") { sMAC = sDatosFinal; }
  if (sMAC !="") { 
    preguntarListas();
    bRefrescarLCD = true;
  } else {
    if (bRefrescarLCD) { 
      printLCD("netKero", "ON-LINE ; "+sEquipos);
      ledVERDEAZULROJO(LOW, HIGH, LOW); 
      bRefrescarLCD = false;
      sMAC = "";
    }
  }
}

void preguntarListas() {
  printLCD("** NEW DEVICE **", "MAC:"+sMAC);
  bPregunta = true;
  
  while(bPregunta) {
    sonarBuzzer();
    iPulsadorSI = digitalRead(BOTTON_SI);
    iPulsadorNO = digitalRead(BOTTON_NO);
  
    if (iPulsadorSI == HIGH) {
      ledVERDEAZULROJO(HIGH, LOW, LOW);
      printLCD("*** ACCEPTED ***" , "MAC:"+sMAC);
      Serial.println("#01#"+sMAC);
      salirWhile();
    } 
  
    if (iPulsadorNO == HIGH) {  
      ledVERDEAZULROJO(LOW, LOW, HIGH);
      printLCD("**** DENIED ****" , "MAC:"+sMAC);
      Serial.println("#02#"+sMAC);
      salirWhile();
    }
  } 
}

void salirWhile() {  
  sMAC = "";
  bPregunta = false;
  delay(3000);
}

void sonarBuzzer() {  
  tone(DIGITAL_BUZZER, 500);
  ledVERDEAZULROJO(HIGH, LOW, HIGH); 
  delay(400);               
  noTone(DIGITAL_BUZZER);
  ledVERDEAZULROJO(LOW, LOW, LOW); 
  delay(400); 
}

void printLCD(String sLinea1, String sLinea2) {  
  lcd.clear();
  lcd.print(sLinea1);
  lcd.setCursor(0, 1);
  lcd.print(sLinea2);
}

void ledVERDEAZULROJO(int iPinVerde, int iPinAzul, int iPinRojo) {  
  digitalWrite(DIGITAL_LEDVERDE, iPinVerde);
  digitalWrite(DIGITAL_LEDAZUL, iPinAzul);
  digitalWrite(DIGITAL_LEDROJO, iPinRojo);
}
