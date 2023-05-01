const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://rstdxxyobzxqaggqcjrz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE"
);
class DatabaseController {
  // [GET] /
  async getFullname(req, res, next) {
    const username = req.query.username;
    let { data: Users, error } = await supabase
      .from("Users")
      .select("first_name,last_name")
      .eq("username", username);
    res.json(Users);
  }

  async getWarning(req, res) {
    let { data: alarm, error } = await supabase
      .from("alarm")
      .select("*")
      .neq("date", "");
    return res.json(alarm);
  }

  async setAlarmValue(req, res) {
    const param = req.body;
    const value = Object.values(param);
    const key = Object.keys(param);

    for (let index = 0; index < value.length; index++) {
      // console.log(key[index]);
      // console.log(value[index]);
      // console.log((index % 3) + 1);
      if (key[index].includes("min"))
        await supabase
          .from("data_input")
          .update({ min: value[index] })
          .eq("id", (index % 3) + 1);
      if (key[index].includes("max"))
        await supabase
          .from("data_input")
          .update({ max: value[index] })
          .eq("id", (index % 3) + 1);
    }
    res.send(param);
  }

  async getAlarmRange(req, res) {
    let { data: alarm, error } = await supabase
      .from("data_input")
      .select("min,max")
      .order("id", { ascending: true })
      .not("max", "is", null);
    // console.log(alarm);
    res.json(alarm);
  }

  async getChartData(req, res) {
    const range = req.query.sliderValue.sliderValue;
    const firstTime = req.query.firstTime;
    // console.log(range);
    if (firstTime === "true") {
      // console.log("If");
      let { data: data_history, error } = await supabase
        .from("data_history")
        .select()
        .order("id", { ascending: false })
        .limit(range);
      try {
        data_history.reverse();
      } catch {
        console.log("Get chart data error");
      }
      res.json(data_history);
    } else {
      // console.log("Else");
      let { data: data_history, error } = await supabase
        .from("data_history")
        .select()
        .order("id", { ascending: false })
        .limit(1);
      try {
        data_history.reverse();
      } catch {
        console.log("Get chart data error");
      }
      res.json(data_history);
    }
  }
  async setStart(req, res) {
    const { data, error } = await supabase
      .from("data_input")
      .update({ serverData: "Start" })
      .eq("id", "9");
    console.log("Start");
    res.send("OK");
  }

  async setStop(req, res) {
    const { data, error } = await supabase
      .from("data_input")
      .update({ serverData: "Stop" })
      .eq("id", "9");
    console.log("Stop");
    res.send("OK");
  }

  async setReset(req, res) {
    const { data, error } = await supabase
      .from("data_input")
      .update({ serverData: "Reset" })
      .eq("id", "9");
    console.log("Reset");
    res.send("OK");
  }

  async getLightStatus(req, res) {
    let { data: control, error } = await supabase
      .from("control")
      .select("displayData")
      .eq("id", "1");
    res.json(control);
  }

  async setAlarmStatus(req, res) {
    const id = req.body.id;
    const status = req.body.status;
    const text = req.body.text;
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
    const message = text;
    let value;
    try {
      value = await supabase
        .from("alarm")
        .select("value, limit")
        .eq("text", text);
    } catch {
      console.log("Get value error");
    }
    await supabase.from("alarm_history").insert({
      date: dateString,
      time: timeString,
      text: message,
      status: status,
      value: value.data[0].value,
      limit: value.data[0].limit,
    });
    await supabase
      .from("alarm")
      .update({
        date: dateString,
        time: timeString,
        text: message,
        status: status,
        value: value.data[0].value,
        limit: value.data[0].limit,
      })
      .eq("text", text);
    if (status === "Disable") {
      await supabase
        .from("alarm")
        .update({
          date: "",
          time: "",
          text: "",
          status: "",
          value: value.data[0].value,
          limit: "",
        })
        .eq("text", text);
    }
  }

  async getAlarmTable(req, res) {
    const date = req.query.sortAlarm.date;
    const time = req.query.sortAlarm.time;
    const text = req.query.sortAlarm.text;
    const status = req.query.sortAlarm.status;
    console.log(req.query.sortAlarm);

    if (time == "Ascending") {
      console.log("Ascending");
      let { data: alarm_history, error } = await supabase
        .from("alarm_history")
        .select()
        .order("time", { ascending: true });
      return res.json(alarm_history);
    } else if (time == "Descending") {
      console.log("Descending");
      let { data: alarm_history, error } = await supabase
        .from("alarm_history")
        .select()
        .order("time", { ascending: false });
      return res.json(alarm_history);
    } else if (date == "Ascending") {
      console.log("Ascending");
      let { data: alarm_history, error } = await supabase
        .from("alarm_history")
        .select()
        .order("date", { ascending: true });
      return res.json(alarm_history);
    } else if (date == "Descending") {
      console.log("Descending");
      let { data: alarm_history, error } = await supabase
        .from("alarm_history")
        .select()
        .order("date", { ascending: false });
      return res.json(alarm_history);
    } else {
      console.log("None");
      let { data: alarm_history, error } = await supabase
        .from("alarm_history")
        .select()
        .filter("date", "ilike", `%${date}%`)
        .filter("time", "ilike", `%${time}%`)
        .filter("text", "ilike", `%${text}%`)
        .filter("status", "ilike", `%${status}%`);
      return res.json(alarm_history);
    }
  }
}

module.exports = new DatabaseController();
