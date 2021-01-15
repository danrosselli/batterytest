/*
  Charge Discharge Battery

  Send voltage and cycle information to nodejs server by USB port
  
  created 10 Jan 2021
  by Daniel Rosselli

  This example code is in the public domain.

*/

#define touchSensor 5
#define rele 2
#define voltmeter A0

bool touchCurrentState = LOW;
bool touchLastState = LOW;
bool releCurrentState = HIGH;

float vOUT = 0.0;
int value = 0;

int ticker = 0;

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(rele, OUTPUT);
  pinMode(touchSensor, INPUT);
  
  digitalWrite(rele, HIGH);
  Serial.begin(9600);
}

// the loop function runs over and over again forever
void loop() {

  touchCurrentState = digitalRead(touchSensor);
  
  // le o valor do voltimetro e calcula
  value = analogRead(voltmeter);
  vOUT = (25 / 1024.0) * value; // 25v dividido por 1024 de resolução, multiplicado pelo valor lido do input
  /*
  if (ticker%60 == 0) {
    Serial.print(ticker);
    Serial.print(" | ");
    Serial.print("Voltage:");
    Serial.println(vOUT);
  }
  */
  
  // se a voltagem na célula cair abaixo de 0.25 volts e o relê esteja em modo de motor ligado
  if (vOUT < 0.30 && releCurrentState == HIGH) {
    // coloca o rele no modo de carregamento da bateria
    releCurrentState = LOW;
    digitalWrite(rele, releCurrentState);
    //Serial.print("Discharge_Time:");
    Serial.println(ticker);
    ticker = 0; 
  }

  // esta no modo de carregamento da bateria
  if (ticker >= 30 && releCurrentState == LOW) {
    // se já carregou por 30 segundos, então coloca no modo de descarregamento
    releCurrentState = HIGH;
    digitalWrite(rele, releCurrentState);
    //Serial.print("Tempo de carga em segundos: ");
    //Serial.println(ticker);
    ticker = 0; 
    
  }
  
  // nao utilizo mais o touch sensor para teste manual
  /*
  if (touchCurrentState == HIGH && touchLastState == LOW) {

    //Serial.println("Pressed");
    
    touchLastState = HIGH;

    if (releCurrentState == HIGH)
      releCurrentState = LOW;
    else
      releCurrentState = HIGH;

    ticker = 0;
    digitalWrite(rele, releCurrentState);
 
  }
  
  if (touchCurrentState == LOW && touchLastState == HIGH) {
    touchLastState = LOW;
  }
  */

  ticker++;
  delay(1000);
  
}
