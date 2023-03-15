require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const app = express();
let port = process.env.PORT || 5000 || 80;
let server_host = "localhost" || "0.0.0.0";
const route = require("./routes");
const cors = require("cors");
app.use(methodOverride("_method"));

const { createClient } = require("@supabase/supabase-js");
const databaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR4eHlvYnp4cWFnZ3FjanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcxNTkzMzEsImV4cCI6MTk5MjczNTMzMX0.2xTXc4xRDI3fO2HaLSRo6YdwEjeigZvIFafnOfH5BtE";

const supabase = createClient(
  "https://rstdxxyobzxqaggqcjrz.supabase.co",
  databaseKey
);

//use midleware to get data
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Routes init
route(app);

app.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port ${port}`);
});
