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
        .from("data_table")
        .update({ value: data[index] })
        .eq("id", index + 1);
    }
    res.send(param);
  }

  async getData(req, res, next) {
    const { data, error } = await supabase
      .from("data_table")
      .select()
      .order("id", { ascending: true });
    if (data !== null) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const id = index + 1;
        const { data: alarm, error } = await supabase
          .from("alarm")
          .select()
          .eq("id", id);
        let message = 0;
        try {
          message = alarm[0].text;
        } catch {
          message = 0;
        }

        const hasWarning = message != 0;
        if (element.max == null) {
          continue;
        } else if (
          Number(element.value) >= Number(element.max) &&
          (!hasWarning || message.includes("Low"))
        ) {
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
          const message = `${element.name} High Limit`;
          const value = await supabase
            .from("data_table")
            .select("value, max")
            .eq("id", id);
          const { data, error } = await supabase
            .from("alarm")
            .update({
              date: dateString,
              time: timeString,
              text: message,
              status: "Active",
              value: value.data[0].value,
              limit: value.data[0].max,
            })
            .eq("id", id);
          await supabase.from("alarm_history").insert({
            date: dateString,
            time: timeString,
            text: message,
            status: "Active",
            value: value.data[0].value,
            limit: value.data[0].max,
            data_id: id,
          });
          console.log("Error max:", error, id);
        } else if (
          Number(element.value) <= Number(element.min) &&
          (!hasWarning || message.includes("High"))
        ) {
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
          const message = `${element.name} Low Limit`;
          const value = await supabase
            .from("data_table")
            .select("value, min")
            .eq("id", id);
          console.log("value ", value);
          const { data } = await supabase
            .from("alarm")
            .update({
              date: dateString,
              time: timeString,
              text: message,
              status: "Active",
              value: value.data[0].value,
              limit: value.data[0].min,
            })
            .eq("id", id);
          await supabase.from("alarm_history").insert({
            date: dateString,
            time: timeString,
            text: message,
            status: "Active",
            value: value.data[0].value,
            limit: value.data[0].min,
            data_id: id,
          });
          console.log("error min", message);
        } else if (
          Number(element.value) < Number(element.max) &&
          Number(element.value) > Number(element.min) &&
          hasWarning
        ) {
          const { data } = await supabase.from("alarm").select().eq("id", id);
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
          const message = data[0].text;
          const value = await supabase
            .from("data_table")
            .select("value")
            .eq("id", id);
          await supabase.from("alarm_history").insert({
            date: dateString,
            time: timeString,
            text: message,
            status: "OK",
            value: value.data[0].value,
            data_id: id,
          });
          await supabase
            .from("alarm")
            .update({
              date: "",
              time: "",
              text: "",
              status: "",
              value: null,
              limit: null,
            })
            .eq("id", id);
          console.log("Ok");
        }
      }
    }
    res.json(data);
  }
}

module.exports = new TestController();
