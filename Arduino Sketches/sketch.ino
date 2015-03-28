
/********************************************** 
  This is a sketch to use the CC3000 WiFi chip 
  
  Written by Younes Barhouni for eDreams-iot
 **********************************************/
 
// Libraries
#include <Adafruit_CC3000.h>
#include <ccspi.h>
#include <SPI.h>
#include <string.h>
#include "utility/debug.h"
#include "DHT.h"
#include<stdlib.h>

// Define CC3000 chip pins
#define ADAFRUIT_CC3000_IRQ   3
#define ADAFRUIT_CC3000_VBAT  5
#define ADAFRUIT_CC3000_CS    10

// DHT sensor
#define DHTPIN 7
#define DHTTYPE DHT22

// Create CC3000 instances
Adafruit_CC3000 cc3000 = Adafruit_CC3000(ADAFRUIT_CC3000_CS, ADAFRUIT_CC3000_IRQ, ADAFRUIT_CC3000_VBAT,
                                         SPI_CLOCK_DIV2); // you can change this clock speed
                                         
// DHT instance
DHT dht(DHTPIN, DHTTYPE);

// WLAN parameters
#define WLAN_SSID       "WLAN_SSID"
#define WLAN_PASS       "WLAN_PASS"
#define WLAN_SECURITY   WLAN_SEC_WPA2

// Host and API parameters
#define WEBSITE  "http://ipAdress"
#define API_key  "yourAPIkey"
#define feedID  "yourFeedID"

uint32_t ip;

void setup(void)
{
  // Initialize
  Serial.begin(115200);
  
  Serial.println(F("\nInitializing..."));
  if (!cc3000.begin())
  {
    Serial.println(F("Couldn't begin()! Check your wiring?"));
    while(1);
  }
 
}

void loop(void)
{
  // Connect to WiFi network
  cc3000.connectToAP(WLAN_SSID, WLAN_PASS, WLAN_SECURITY);
  Serial.println(F("Connected!"));
  
  /* Wait for DHCP to complete */
  Serial.println(F("Request DHCP"));
  while (!cc3000.checkDHCP())
  {
    delay(100);
  }  

  // Set the website IP
  uint32_t ip = cc3000.IP2U32(WEBSITE);
  cc3000.printIPdotsRev(ip);
  
  // Get data & transform to integers
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float s = analogRead(0);
  
  int temperature = (int) t;
  int humidity = (int) h;
  int sound = (int) s;
  
  // Prepare JSON for node server & get length
  int length = 0;

  String data = "";
  data = data + "\n" + "{\"name\" : \"deviceName\" ,\"temperature\" : \"" + String(temperature) + "\" ,\"humidity\" : \"" + String(humidity) + "\" ,\"sound\" : \"" + String(sound) + "\"}";
  
  length = data.length();
  Serial.print("Data length");
  Serial.println(length);
  Serial.println();
  
  
  
  // Send request
  Adafruit_CC3000_Client client = cc3000.connectTCP(ip, 80);
  if (client.connected()) {
    Serial.println("Connected!");
    client.println("POST /api/records/ HTTP/1.1");
    client.println("Host: http://217.70.188.247:3000");
    client.println(F("Accept: application/json"));
    client.println(F("User-Agent: Arduino-edreams"));
    client.println(F("Content-Type: application/json"));
    client.println("Content-Length: " + String(length));
    client.print("Connection: close");
    client.println();
    client.print(data);
    client.println();
  } else {
    Serial.println(F("Connection failed"));    
    return;
  }
  
  Serial.println(F("-------------------------------------"));
  while (client.connected()) {
    while (client.available()) {
      char c = client.read();
      Serial.print(c);
    }
  }
  client.close();
  Serial.println(F("-------------------------------------"));
  
  Serial.println(F("\n\nDisconnecting"));
  cc3000.disconnect();
  
  // Wait 10 seconds until next update
  delay(10000);
  
}