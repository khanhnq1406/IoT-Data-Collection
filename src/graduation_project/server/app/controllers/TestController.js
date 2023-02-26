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
    // await supabase
    //   .from("data_input")
    //   .update({ value: param.data1 })
    //   .eq("id", 1);

    // await supabase
    //   .from("data_input")
    //   .update({ value: param.data2 })
    //   .eq("id", 2);

    // await supabase
    //   .from("data_input")
    //   .update({ value: param.data3 })
    //   .eq("id", 3);

    // await supabase
    //   .from("data_input")
    //   .update({ value: param.data4 })
    //   .eq("id", 4);

    // await supabase
    //   .from("data_input")
    //   .update({ value: param.data5 })
    //   .eq("id", 5);

    // await supabase
    //   .from("data_input")
    //   .update({ value: param.data6 })
    //   .eq("id", 6);

    // await supabase
    //   .from("data_input")
    //   .update({ value: param.data7 })
    //   .eq("id", 7);

    // await supabase
    //   .from("data_input")
    //   .update({ value: param.data8 })
    //   .eq("id", 8);
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
