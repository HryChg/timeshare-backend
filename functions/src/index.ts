import express = require("express"); // reason for using require https://stackoverflow.com/a/34522813
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const app = express();
app.get("/", (req: any, res: any) => {
  res.status(200).send({data: "worldly hellos"});
});

app.post("/timers", async (req, res) => {
  try {
    // @ts-ignore
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


exports.apps = functions.https.onRequest(app);

