void syncTask() {
  // a simple timing mechanism to reduce server connectivity
  // 60 seconds check
  if (!OTADRIVE.timeTick(30))
    return;

  if (WiFi.status() != WL_CONNECTED)
    return;

  // do sync and update operations here
  OTADRIVE.updateFirmware();
}