TaskHandle_t Task1;
TaskHandle_t Task2;

#include "soc/timer_group_struct.h"
#include "soc/timer_group_reg.h"
#include "config.h"
#include "getData.h"
#include "updateData.h"
#include "syncTask.h"
#include "node3Handle.h"
#include "node2Handle.h"
#include "node1Handle.h"
#include "loraHandle.h"
void setup() {
  Serial.begin(115200);
  delay(1000);
  randomSeed(micros());  // Seed the random number generator with the current time
  WiFi.mode(WIFI_STA);   //Optional
  WiFi.begin(ssid, password);
  Serial.println("\nConnecting");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
  //init the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // Create http socket
  httpGetData.begin(apiGetData.c_str());
  httpUploadData.begin(apiUploadData.c_str());
  httpUpdateLightStatus.begin(apiUpdateLightStatus.c_str());
  // Config LED on board
  // pinMode(LED_BUILTIN, OUTPUT);  // set the LED pin mode

  setupLora();

  //create a task that will be executed in the Task1code() function, with priority 1 and executed on core 0
  xTaskCreatePinnedToCore(
    Task1code, /* Task function. */
    "Task1",   /* name of task. */
    10000,     /* Stack size of task */
    NULL,      /* parameter of the task */
    1,         /* priority of the task */
    &Task1,    /* Task handle to keep track of created task */
    0);        /* pin task to core 0 */
  delay(500);

  //create a task that will be executed in the Task2code() function, with priority 1 and executed on core 1
  xTaskCreatePinnedToCore(
    Task2code, /* Task function. */
    "Task2",   /* name of task. */
    10000,     /* Stack size of task */
    NULL,      /* parameter of the task */
    1,         /* priority of the task */
    &Task2,    /* Task handle to keep track of created task */
    1);        /* pin task to core 1 */
  delay(500);
}

void Task1code(void* pvParameters) {
  for (;;) {
    TIMERG0.wdt_wprotect = TIMG_WDT_WKEY_VALUE;
    TIMERG0.wdt_feed = 1;
    TIMERG0.wdt_wprotect = 0;
    sendData();
  }
}

void Task2code(void* pvParameters) {
  for (;;) {
    TIMERG0.wdt_wprotect = TIMG_WDT_WKEY_VALUE;
    TIMERG0.wdt_feed = 1;
    TIMERG0.wdt_wprotect = 0;
    unsigned long currentMillis = millis();

    // if (currentMillis - previousMillisUpdate >= intervalUpdate) {
      updateData();
      // syncTask();
      node2Handle();
      node3Handle();
      // node1Handle();
      getData();
      // updateLightStatus();
    //   previousMillisUpdate = currentMillis;
    // }
  }
}

void loop() {
  delay(1);
}
