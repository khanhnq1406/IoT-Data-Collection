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
}

module.exports = new DatabaseController();
