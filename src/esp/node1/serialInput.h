void serialInput() {
  String data_ ,mode_,val;
  int moc;
  int data;
  if(Serial.available() > 0)
  {
    val = Serial.readStringUntil('\n');
    for (int i = 0; i < val.length(); i++) {
    if (val.charAt(i) == ' ') {
        moc = i; //Tìm vị trí của dấu ""
      }
    }
    mode_=val;
    data_=val;
    mode_.remove(moc);
    data_.remove(0,moc+1);
    data=data_.toInt();
  }
  if(mode_ == "start")
  {
    dataSend = 1;
  }
  if(mode_ == "stop")
  {
     dataSend = 2;
  }
}