const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://rstdxxyobzxqaggqcjrz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE"
);
class EspController {
  async updateData(req, res) {
    const param = req.body;
    const key = Object.keys(param);
    // console.log(param["Data1"]);
    for (let index = 0; index < key.length; index++) {
      const name = param[key[index]].name;
      const value = param[key[index]].value;
      const id = param[key[index]].id;
      await supabase
        .from("data_table")
        .update({ value: value })
        .eq("name", name);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const dateString =
        (String(day).length == 1 ? "0" + day : day) +
        "/" +
        (String(Number(month + 1)).length == 1
          ? "0" + Number(month + 1)
          : Number(month + 1)) +
        "/" +
        year;
      const timeString =
        (String(hour).length == 1 ? "0" + hour : hour) +
        ":" +
        (String(minute).length == 1 ? "0" + minute : minute) +
        ":" +
        (String(second).length == 1 ? "0" + second : second);
      await supabase.from("data_history").insert({
        date: dateString,
        time: timeString,
        value: value,
        data_id: id,
      });
    }
    res.send("OK");
  }

  async insertData(req, res) {
    const param = req.body;
    const { data, error } = await supabase
      .from("data_history")
      .insert({ date: param.date, time: param.time, value: param.data1 });
    res.send("OK");
  }
  async updateLightStatus(req, res) {
    const param = req.body;
    // const value = Object.values(param);
    const name = param.name.replaceAll(`"`, "");
    const espData = param.espData;
    console.log(name, ":", espData);
    const { data, error } = await supabase
      .from("data_table")
      .update({ espData: espData })
      .eq("name", name);
    res.send("OK");
  }
  async getLightStatus(req, res) {
    let { data: control, error } = await supabase
      .from("data_table")
      .select("serverData")
      .eq("id", "9");
    res.send(control[0].serverData);
  }
}
module.exports = new EspController();
