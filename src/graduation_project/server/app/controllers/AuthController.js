const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://rstdxxyobzxqaggqcjrz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE"
);
class AuthController {
  // [GET] /
  async index(req, res, next) {
    console.log("GET /");
    try {
      const username = req.userId;
      let { data, error } = await supabase.from("Users").select("*");
      for (let index = 0; index < data.length; index++) {
        if (data[index].username === username) {
          const role = data[index].role;
          return res.json({ success: true, username, role });
        }
      }
      return res.json({ success: false, message: "User not found" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async login(req, res, next) {
    console.log("GET /login");
    const { username, password } = req.body;
    let { data, error } = await supabase.from("Users").select("*");
    for (let index = 0; index < data.length; index++) {
      if (data[index].username === username) {
        if (data[index].password === password) {
          const accessToken = jwt.sign(
            { userId: username },
            process.env.ACCESS_TOKEN_SECRET
          );
          return res.json({
            success: true,
            message: "User logged in successfully",
            accessToken,
          });
        } else {
          return res.json({
            success: false,
            message: "Incorrect username or password",
          });
        }
      }
    }
    return res.json({
      success: false,
      message: "Incorrect username or password",
    });
  }
}

module.exports = new AuthController();
