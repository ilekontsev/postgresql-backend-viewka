const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoute = require("../Routes/authRoute");
const messageRoute = require("../Routes/messageRoute");

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/", authRoute);
app.use("/message", messageRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
