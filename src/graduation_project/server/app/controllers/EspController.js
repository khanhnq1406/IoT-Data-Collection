const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://rstdxxyobzxqaggqcjrz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE"
);
class EspController {
  async updateData(req, res) {
    const param = req.body;
    const value = Object.values(param);
    for (let index = 0; index < value[0].length; index++) {
      const element = value[0][index];
      const { data, error } = await supabase
        .from("data_input")
        .update({ value: element })
        .eq("id", index + 1);
    }
    res.send("OK");
  }

  async insertData(req, res) {
    const param = req.body;
    const { data, error } = await supabase
      .from("data_history")
      .insert({ date: param.date, time: param.time, value: param.data1 });
    console.log(error);
    res.send("OK");
  }
}
module.exports = new EspController();