void updateLightStatus() {
  if (serverLightStatus[1].indexOf("Start") >= 0 && espLightStatus[1] != serverLightStatus[1]) {
    espLightStatus[1] = "Start";
    updateStatus("Start", "Start", "Light2");
  }
  if (serverLightStatus[1].indexOf("Stop") >= 0 && espLightStatus[1] != serverLightStatus[1]) {
    espLightStatus[1] = "Stop";
    updateStatus("Stop", "Stop", "Light2");
  }
}
void node2Handle() {
  updateLightStatus();
  if (espLightStatus[1] == "Start") {
    node2MasterSend.motorStatus = 1;
  }
  else {
    node2MasterSend.motorStatus = 0;
  }
}