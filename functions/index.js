const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");


admin.initializeApp(functions.config().firebase);

const app = express();
app.get("/", (req, res) => {
  res.status(200).send({data: "worldy hellos"});
});

app.post("/timers", async (req, res) => {
  try {
    const startTimeMillis = parseInt(req.query.startTime);
    const startTime = admin.firestore.Timestamp.fromMillis(startTimeMillis);
    const writeResult = await admin.firestore()
        .collection("timers")
        .add({"startTime": startTime});
    res.json({result: `Timer with ID: ${writeResult.id} added.`});
  } catch (err) {
    console.log(err);
    res.status(500).send({errMsg: err});
  }
});

exports.app = functions.https.onRequest(app);
