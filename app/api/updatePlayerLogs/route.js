import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
  try {
    const { username, log, gameID, updateType } = await request.json();

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Find the user who owns the game with the specified gameID
    const gameOwner = await db.collection("Users").findOne({
      "games.gameID": gameID,
    });

    if (!gameOwner) {
      client.close();
      return NextResponse.json(
        { success: false, message: "Game ID does not exist" },
        { status: 400 }
      );
    }

    // Find the game in the user's games array
    const game = gameOwner.games.find((game) => game.gameID === gameID);

    if (!game) {
      client.close();
      return NextResponse.json(
        { success: false, message: "Game not found in user's games" },
        { status: 404 }
      );
    }

    // Check if there is an existing unfinished log for the given username
    const existingLog = game.logs ? game.logs.find((l) => l.username === username && !l.finished) : null;

    if (updateType === "add") {
      if (!existingLog) {
        client.close();
        return NextResponse.json(
          { success: false, message: "No unfinished log to add for that username" },
          { status: 400 }
        );
      }

      // Append new log information to the existing log and update dateUpdated
      const updatedLog = {
        ...existingLog,
        log: `${existingLog.log}\n${log}`, // Combine old and new log entries
        dateUpdated: new Date().toISOString(),
      };

      await db.collection("Users").updateOne(
        { _id: gameOwner._id, "games.gameID": gameID, "games.logs.username": username },
        { $set: { "games.$.logs.$[log]": updatedLog } },
        { arrayFilters: [{ "log.username": username, "log.finished": false }] }
      );

      client.close();
      return NextResponse.json({
        success: true,
        message: "Log updated successfully",
        log: updatedLog,
      });
    } else if (updateType === "stop") {
      if (!existingLog) {
        client.close();
        return NextResponse.json(
          { success: false, message: "No unfinished log to stop" },
          { status: 400 }
        );
      }

      // Mark the log as finished and add dateFinished
      await db.collection("Users").updateOne(
        { _id: gameOwner._id, "games.gameID": gameID, "games.logs.username": username },
        { $set: { "games.$.logs.$[log].finished": true, "games.$.logs.$[log].dateFinished": new Date().toISOString() } },
        { arrayFilters: [{ "log.username": username, "log.finished": false }] }
      );

      client.close();
      return NextResponse.json({
        success: true,
        message: "Log marked as finished",
      });
    } else {
      client.close();
      return NextResponse.json(
        { success: false, message: "Invalid update type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during log update:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
