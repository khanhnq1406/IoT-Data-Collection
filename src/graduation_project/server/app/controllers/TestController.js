const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://rstdxxyobzxqaggqcjrz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE"
);
class TestController {
  // [GET] /
  async index(req, res, next) {
    const param = req.body;
    const data = Object.values(param);
    for (let index = 0; index < data.length; index++) {
      await supabase
        .from("data_input")
        .update({ value: data[index] })
        .eq("id", index + 1);
    }
    res.send(param);
  }

  async getData(req, res, next) {
    const { data, error } = await supabase
      .from("data_input")
      .select()
      .order("id", { ascending: true });
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const id = index + 1;
      const { data: alarm, error } = await supabase
        .from("alarm")
        .select()
        .eq("id", id);
      const hasWarning = alarm[0].date != 0;
      if (Number(element.value) >= 80 && !hasWarning) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const dateString = day + "/" + Number(month + 1) + "/" + year;
        const timeString = hour + ":" + minute + ":" + second;
        const message = `Data ${index + 1} High Limit`;
        const { data } = await supabase
          .from("alarm")
          .update({ date: dateString, time: timeString, text: message })
          .eq("id", id);
      } else if (Number(element.value) < 80 && hasWarning) {
        const { data } = await supabase
          .from("alarm")
          .update({ date: "", time: "", text: "" })
          .eq("id", id);
      }
    }
    res.json(data);
  }
}

module.exports = new TestController();
