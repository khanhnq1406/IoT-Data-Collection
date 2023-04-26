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
      console.log(key[index]);
      console.log(value[index]);
      console.log((index % 3) + 1);
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
    console.log(alarm);
    res.json(alarm);
  }

  async getChartData(req, res) {
    const range = req.query.sliderValue.sliderValue;
    const firstTime = req.query.firstTime;
    console.log(range);
    if (firstTime === "true") {
      console.log("If");
      let { data: data_history, error } = await supabase
        .from("data_history")
        .select()
        .order("id", { ascending: false })
        .limit(range);
      data_history.reverse();
      console.log(data_history);
      res.json(data_history);
    } else {
      console.log("Else");
      let { data: data_history, error } = await supabase
        .from("data_history")
        .select()
        .order("id", { ascending: false })
        .limit(1);
      data_history.reverse();
      console.log(data_history);
      res.json(data_history);
    }
  }
}

module.exports = new DatabaseController();
