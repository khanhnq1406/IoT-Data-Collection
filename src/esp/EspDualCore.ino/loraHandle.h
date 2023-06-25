
void printParameters(struct Configuration configuration);
void printModuleInformation(struct ModuleInformation moduleInformation);
void assignData();
void recvData();
void setupLora() {
  e32ttl1.begin();
  ResponseStructContainer c1;
  c1 = e32ttl1.getConfiguration();
  Configuration configuration1 = *(Configuration*)c1.data;
  configuration1.ADDL = 0x01;
  configuration1.ADDH = 0x00;
  configuration1.CHAN = 0x02;
  configuration1.SPED.uartBaudRate = UART_BPS_9600;
  configuration1.SPED.uartParity = MODE_00_8N1;            // Parity bit
  configuration1.SPED.airDataRate = AIR_DATA_RATE_100_96;  // Air data rate
  configuration1.OPTION.transmissionPower = POWER_20;
  configuration1.OPTION.fec = FEC_0_OFF;
  configuration1.OPTION.fixedTransmission = FT_FIXED_TRANSMISSION;
  configuration1.OPTION.wirelessWakeupTime = WAKE_UP_750;
  configuration1.OPTION.ioDriveMode = IO_D_MODE_PUSH_PULLS_PULL_UPS;
  e32ttl1.setConfiguration(configuration1, WRITE_CFG_PWR_DWN_SAVE);
  printParameters(configuration1);
  c1.close();

  // delay(100);

  e32ttl2.begin();
  ResponseStructContainer c2;
  c2 = e32ttl2.getConfiguration();
  Configuration configuration2 = *(Configuration*)c2.data;
  configuration2.ADDL = 0x02;
  configuration2.ADDH = 0x00;
  configuration2.CHAN = 0x02;
  configuration2.SPED.uartBaudRate = UART_BPS_9600;
  configuration2.SPED.uartParity = MODE_00_8N1;            // Parity bit
  configuration2.SPED.airDataRate = AIR_DATA_RATE_100_96;  // Air data rate
  configuration2.OPTION.transmissionPower = POWER_20;
  configuration2.OPTION.fec = FEC_0_OFF;
  configuration2.OPTION.fixedTransmission = FT_FIXED_TRANSMISSION;
  configuration2.OPTION.wirelessWakeupTime = WAKE_UP_750;
  configuration2.OPTION.ioDriveMode = IO_D_MODE_PUSH_PULLS_PULL_UPS;
  e32ttl2.setConfiguration(configuration2, WRITE_CFG_PWR_DWN_SAVE);
  printParameters(configuration2);
  ResponseStatus resetModule();
  c2.close();
}

void sendData() {
  if ((unsigned long)(millis() - time_) > period) {
    ResponseStatus rs;
    // Serial.println(IDS);
    switch (IDS) {
      case 4:
        // Serial.println("Send to node 3");
        rs = e32ttl1.sendFixedMessage(0, IDS, 4, &node3MasterSend, sizeof(Node3MasterSend));
        break;
      case 5:
        // Serial.println("Send to node 2");
        rs = e32ttl1.sendFixedMessage(0, IDS, 4, &node2MasterSend, sizeof(Node2MasterSend));
        break;
    }
    time_ = millis();
  }
  if (flag1 == true) {
    IDS++;
    delay(500);
    if (IDS > 4) IDS = 4;
    flag1 = false;
    Serial.println("         flag ");
  }
  recvData();
}

void recvData() {
  if (e32ttl2.available() > 1) {
    ResponseStructContainer rsc = e32ttl2.receiveMessage(sizeof(Message1));
    // delay(100);
    struct Message1 mge = *(Message1*)rsc.data;
    // ID = (int)mge.ID;
    // Data1_R[ID] = (int)mge.Data1;
    // Data2_R[ID] = (int)mge.Data2;
    // Data3_R[ID] = (int)mge.Data3;
    // Data4_R[ID] = (int)mge.Data4;
    Serial.print("                  ID = ");
    Serial.println(mge.ID);
    Serial.print("                  Data1[");
    Serial.print(mge.ID);
    Serial.print("] = ");
    Serial.println(mge.Data1);
    Serial.print("                  Data2[");
    Serial.print(mge.ID);
    Serial.print("] = ");
    Serial.println(mge.Data2);
    Serial.print("                  Data3[");
    Serial.print(mge.ID);
    Serial.print("] = ");
    Serial.println(mge.Data3);
    Serial.print("                  Data4[");
    Serial.print(mge.ID);
    Serial.print("] = ");
    Serial.println(mge.Data4);
    Serial.print("                  Data4[");
    Serial.print(mge.ID);
    Serial.print("] = ");
    Serial.println(mge.Data5);
    Serial.print("                  Data4[");
    Serial.print(mge.ID);
    Serial.print("] = ");
    Serial.println(mge.Data6);
    if (mge.ID == 4) {
      node3.temperature = mge.Data1;
      node3.humidity = mge.Data2;
      node3.gas = mge.Data3;
      Serial.println(String(node3.temperature) + "\t" + String(node3.humidity) + "\t" + String(node3.gas));
    }
    if (mge.ID == 5) {
      node2Recv.waterLevel = mge.Data1;
      node2Recv.error = mge.Data2;
      node2Recv.Output = mge.Data3;
      Serial.println(String(node2Recv.waterLevel) + "\t" + String(node2Recv.error) + "\t" + String(node2Recv.Output));
    }
    flag1 = true;
  }
}
void printParameters(struct Configuration configuration) {
  Serial.println("----------------------------------------");

  Serial.print(F("HEAD : "));
  Serial.print(configuration.HEAD, BIN);
  Serial.print(" ");
  Serial.print(configuration.HEAD, DEC);
  Serial.print(" ");
  Serial.println(configuration.HEAD, HEX);
  Serial.println(F(" "));
  Serial.print(F("AddH : "));
  Serial.println(configuration.ADDH, BIN);
  Serial.print(F("AddL : "));
  Serial.println(configuration.ADDL, BIN);
  Serial.print(F("Chan : "));
  Serial.print(configuration.CHAN, DEC);
  Serial.print(" -> ");
  Serial.println(configuration.getChannelDescription());
  Serial.println(F(" "));
  Serial.print(F("SpeedParityBit     : "));
  Serial.print(configuration.SPED.uartParity, BIN);
  Serial.print(" -> ");
  Serial.println(configuration.SPED.getUARTParityDescription());
  Serial.print(F("SpeedUARTDatte  : "));
  Serial.print(configuration.SPED.uartBaudRate, BIN);
  Serial.print(" -> ");
  Serial.println(configuration.SPED.getUARTBaudRate());
  Serial.print(F("SpeedAirDataRate   : "));
  Serial.print(configuration.SPED.airDataRate, BIN);
  Serial.print(" -> ");
  Serial.println(configuration.SPED.getAirDataRate());

  Serial.print(F("OptionTrans        : "));
  Serial.print(configuration.OPTION.fixedTransmission, BIN);
  Serial.print(" -> ");
  Serial.println(configuration.OPTION.getFixedTransmissionDescription());
  Serial.print(F("OptionPullup       : "));
  Serial.print(configuration.OPTION.ioDriveMode, BIN);
  Serial.print(" -> ");
  Serial.println(configuration.OPTION.getIODroveModeDescription());
  Serial.print(F("OptionWakeup       : "));
  Serial.print(configuration.OPTION.wirelessWakeupTime, BIN);
  Serial.print(" -> ");
  Serial.println(configuration.OPTION.getWirelessWakeUPTimeDescription());
  Serial.print(F("OptionFEC          : "));
  Serial.print(configuration.OPTION.fec, BIN);
  Serial.print(" -> ");
  Serial.println(configuration.OPTION.getFECDescription());
  Serial.print(F("OptionPower        : "));
  Serial.print(configuration.OPTION.transmissionPower, BIN);
  Serial.print(" -> ");
  Serial.println(configuration.OPTION.getTransmissionPowerDescription());

  Serial.println("----------------------------------------");
}
void printModuleInformation(struct ModuleInformation moduleInformation) {
  Serial.println("----------------------------------------");
  Serial.print(F("HEAD BIN: "));
  Serial.print(moduleInformation.HEAD, BIN);
  Serial.print(" ");
  Serial.print(moduleInformation.HEAD, DEC);
  Serial.print(" ");
  Serial.println(moduleInformation.HEAD, HEX);

  Serial.print(F("Freq.: "));
  Serial.println(moduleInformation.frequency, HEX);
  Serial.print(F("Version  : "));
  Serial.println(moduleInformation.version, HEX);
  Serial.print(F("Features : "));
  Serial.println(moduleInformation.features, HEX);
  // Serial.print(F("MODE        : "));Serial.println(e32ttl.getMode());
  Serial.println("----------------------------------------");
}
void assignData() {
  if (ID == 4) {
    node3.temperature = Data1_R[4];
    node3.humidity = Data2_R[4];
    node3.gas = Data3_R[4];
    Serial.println(String(node3.temperature) + "\t" + String(node3.humidity) + "\t" + String(node3.gas));
  }
}