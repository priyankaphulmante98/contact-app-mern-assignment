const express = require("express");

require("./config/db");

const app = express();

app.use(express.json());

app.listen(5000, () => {
  console.log("port is running on 5000");
});
