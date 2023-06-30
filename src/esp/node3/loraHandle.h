void printParameters(struct Configuration configuration);
void printModuleInformation(struct ModuleInformation moduleInformation);
void readData();
int count = 0;
void loraHandle() {
  if(ID  == 0)
  {
    // Serial.println(String("e32ttl: ") + String(e32ttl.available()));
    if (e32ttl.available()  > 1){
    readData();
    ID = 1;
    }
  }
  else
  {
      ResponseStatus rs = e32ttl.sendFixedMessage(0, 2, 2,&messageSend, sizeof(Message));
      delay(900);
      
      if(rs.getResponseDescription() == "Success")
      {
        ID = 0;
        Serial.println("rst");
      }
  }

  // // Serial.println("This is version 1");
  // sync_task();
  if(count >10) count =0;
}

void printParameters(struct Configuration configuration) {
	Serial.println("----------------------------------------");

	Serial.print(F("HEAD : "));  Serial.print(configuration.HEAD, BIN);Serial.print(" ");Serial.print(configuration.HEAD, DEC);Serial.print(" ");Serial.println(configuration.HEAD, HEX);
	Serial.println(F(" "));
	Serial.print(F("AddH : "));  Serial.println(configuration.ADDH, DEC);
	Serial.print(F("AddL : "));  Serial.println(configuration.ADDL, DEC);
	Serial.print(F("Chan : "));  Serial.print(configuration.CHAN, DEC); Serial.print(" -> "); Serial.println(configuration.getChannelDescription());
	Serial.println(F(" "));
	Serial.print(F("SpeedParityBit     : "));  Serial.print(configuration.SPED.uartParity, BIN);Serial.print(" -> "); Serial.println(configuration.SPED.getUARTParityDescription());
	Serial.print(F("SpeedUARTDatte  : "));  Serial.print(configuration.SPED.uartBaudRate, BIN);Serial.print(" -> "); Serial.println(configuration.SPED.getUARTBaudRate());
	Serial.print(F("SpeedAirDataRate   : "));  Serial.print(configuration.SPED.airDataRate, BIN);Serial.print(" -> "); Serial.println(configuration.SPED.getAirDataRate());

	Serial.print(F("OptionTrans        : "));  Serial.print(configuration.OPTION.fixedTransmission, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getFixedTransmissionDescription());
	Serial.print(F("OptionPullup       : "));  Serial.print(configuration.OPTION.ioDriveMode, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getIODroveModeDescription());
	Serial.print(F("OptionWakeup       : "));  Serial.print(configuration.OPTION.wirelessWakeupTime, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getWirelessWakeUPTimeDescription());
	Serial.print(F("OptionFEC          : "));  Serial.print(configuration.OPTION.fec, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getFECDescription());
	Serial.print(F("OptionPower        : "));  Serial.print(configuration.OPTION.transmissionPower, BIN);Serial.print(" -> "); Serial.println(configuration.OPTION.getTransmissionPowerDescription());

	Serial.println("----------------------------------------");

}
void printModuleInformation(struct ModuleInformation moduleInformation) {
	// Serial.println("----------------------------------------");
	// Serial.print(F("HEAD BIN: "));  Serial.print(moduleInformation.HEAD, BIN);Serial.print(" ");Serial.print(moduleInformation.HEAD, DEC);Serial.print(" ");Serial.println(moduleInformation.HEAD, HEX);

	// Serial.print(F("Freq.: "));  Serial.println(moduleInformation.frequency, HEX);
	// Serial.print(F("Version  : "));  Serial.println(moduleInformation.version, HEX);
	// Serial.print(F("Features : "));  Serial.println(moduleInformation.features, HEX);
	// Serial.println("----------------------------------------");

}
void readData()
{
    ResponseStructContainer rsc = e32ttl.receiveMessage(sizeof(Node3Recv));
    node3Recv = *(Node3Recv*) rsc.data;
    Serial.print("node3Recv.espStatus = "); Serial.println(node3Recv.espStatus); 
    Serial.print("node3Recv.serverStatus = "); Serial.println(node3Recv.serverStatus);
    Serial.print("node3Recv.maxTemperature = "); Serial.println(node3Recv.maxTemperature); 
    Serial.print("node3Recv.minTemperature = "); Serial.println(node3Recv.minTemperature); 
    Serial.print("node3Recv.maxGas = "); Serial.println(node3Recv.maxGas); 
    Serial.print("node3Recv.minGas = "); Serial.println(node3Recv.minGas); 
    rsc.close();
}