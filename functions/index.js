const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");


admin.initializeApp(functions.config().firebase);

const app = express();
app.get("/", (req, res) => {
  res.status(200).send({data: "worldy hellos"});
});

app.post("/addMessage", async (req, res) => {
  try {
    const original = req.query.text;
    const writeResult = await admin.firestore().collection("messages")
        .add({original: original});
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  } catch (err) {
    console.log(err);
    res.status(500).send({errMsg: err});
  }
});


exports.app = functions.https.onRequest(app);
