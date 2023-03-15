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
    console.log(data);
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
    console.log(data);
    res.send(data);
  }
}

module.exports = new TestController();
