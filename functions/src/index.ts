import "reflect-metadata";
import express = require("express"); // reason for using require https://stackoverflow.com/a/34522813
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {classToPlain, plainToClass} from "class-transformer";
import RoomModel from "./Models/RoomModel";
import UserModel from "./Models/UserModel";

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

app.put("/rooms", async (req, res) => {
  try {
    const roomID: string = req.body.roomID as string;
    const room = plainToClass(RoomModel, req.body.room,
        {excludeExtraneousValues: true});
    await db.collection("rooms").doc(roomID).set(classToPlain(room));
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send({errMsg: err.message});
  }
});

app.post("/users", async (req, res) => {
  try {
    const user: UserModel = plainToClass(UserModel, req.body, {excludeExtraneousValues: true});
    const userID = user.userID;

    const isValidDocID = userID && /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/.test(userID)
    if (!isValidDocID) {
      res.status(400).send("Invalid username string.");
      return;
    }

    let userIDQuerySnapShot = await db.collection("users")
      .where("userID", "==", userID)
      .get();
    if (!userIDQuerySnapShot.empty){
      res.status(409).send("User ID already taken.");
      return;
    }
    await db.collection("users").add(classToPlain(user));
    res.json({result: `User with ID: ${userID} added.`});

  } catch (err) {
    console.log(err);
    res.status(500).send({errMsg: err.message});
  }
});

app.put("/users", async (req, res) => {
  try {
    const {userID, name, avatarURL, goal} = req.body;

    let userQuerySnapShot = await db.collection("users")
      .where("userID", "==", userID)
      .get();
    if (userQuerySnapShot.empty){
      res.status(409).send("User ID not found.");
      return;
    }
    if (userQuerySnapShot.size > 1) {
      res.status(500).send("More than one User ID found. Operation Stopped");
      return;
    }

    const userDoc = userQuerySnapShot.docs[0]
    let user: UserModel = plainToClass(UserModel, userDoc.data(), {excludeExtraneousValues: true});
    if (name) {
      user.name = name;
    }
    if (avatarURL) {
      user.avatarURL = avatarURL
    }
    if (goal) {
      user.goal = goal
    }

    await db.collection("users").doc(userDoc.id).set(classToPlain(user));
    res.json({result: `User with ID: ${userID} updated.`});
  } catch (err) {
    console.log(err);
    res.status(500).send({errMsg: err.message});
  }
});

exports.app = functions.https.onRequest(app);

