import "reflect-metadata";
import express = require("express"); // reason for using require https://stackoverflow.com/a/34522813
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {classToPlain, plainToClass} from "class-transformer";
import {RoomModel} from "./Models/RoomModel";


admin.initializeApp();
const app = express();
const db = admin.firestore();


app.get("/", (req: any, res: any) => {
  res.status(200).send({data: "worldly hellos"});
});

app.post("/timers", async (req, res) => {
  try {
    const startTimeMillis = parseInt(req.query.startTime as string);
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

app.post("/rooms", async (req, res) => {
  try {
    const room = plainToClass(RoomModel, req.body,
        {excludeExtraneousValues: true});
    const writeResult = await admin.firestore()
        .collection("rooms").add(classToPlain(room));
    res.json({result: `Room with ID: ${writeResult.id} added.`});
  } catch (err) {
    console.log(err);
    res.status(500).send({errMsg: err.message});
  }
});

app.get("/rooms", async (req, res) => {
  try {
    const roomID: string = req.query.roomID as string;
    const roomsRef = db.collection("rooms").doc(roomID);
    const room = await roomsRef.get();
    res.json({result: room.data()});
  } catch (err) {
    console.log(err);
    res.status(500).send({errMsg: err.message});
  }
});

app.delete("/rooms", async (req, res) => {
  try {
    const roomID: string = req.query.roomID as string;
    await db.collection("rooms").doc(roomID).delete();
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send({errMsg: err.message});
  }
});

exports.app = functions.https.onRequest(app);

