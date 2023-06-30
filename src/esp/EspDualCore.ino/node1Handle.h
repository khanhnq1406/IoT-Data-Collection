void updateNode1Status() {
  if (serverLightStatus[0].indexOf("Start") >= 0 && espLightStatus[0] != serverLightStatus[0]) {
    espLightStatus[0] = "Start";
    updateStatus("Start", "Start", "Light1");
  }
  if (serverLightStatus[0].indexOf("Stop") >= 0 && espLightStatus[0] != serverLightStatus[0]) {
    espLightStatus[0] = "Stop";
    updateStatus("Stop", "Stop", "Light1");
  }
}
void node1Handle() {
  updateNode1Status();
  if (espLightStatus[0] == "Start") {
    node1MasterSend.motorStatus = 1;
  }
  else {
    node1MasterSend.motorStatus = 0;
  }
}