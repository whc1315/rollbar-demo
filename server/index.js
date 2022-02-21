require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");

const Rollbar = require("rollbar");
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("hit");
  // rollbar.log("Someone hit the server!");
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const aDCLArr = ["Common Air Denisty - Sea Level: 0.0764, 5280ft: 0.0627"];

app.get("/api/liftCoefficient", (req, res) => {
  rollbar.info("Someone got all the Lift Coefficients");
  res.status(200).send(aDCLArr);
});

app.post("/api/liftCoefficient", (req, res) => {
  const { liftForce, surfaceArea, flowSpeed, airDensity } = req.body;
  let l = liftForce;
  let a = surfaceArea;
  let v = flowSpeed;
  let p = airDensity;
  let answer = l / (p * (v * v) * (a / 2));
  aDCLArr.push(answer);

  res.status(200).send(aDCLArr);
});

app.delete("/api/liftCoefficient/:idx", (req, res) => {
  if (req.params.idx === "0") {
    rollbar.error("Someone tried to delete Air Densitys!");
    return res.status(403).send(aDCLArr);
  }
  rollbar.info(`Someone deleted Lift Coefficient ${aDCLArr[+req.params.idx]}`);
  aDCLArr.splice(+req.params.idx, 1);

  res.status(200).send(aDCLArr);
});

const port = process.env.PORT || process.env.SERVER_PORT;

app.listen(5500, () => console.log(`Lift off on 5500!`));
