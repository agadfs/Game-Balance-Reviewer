import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
  try {
    const { username, log, gameID } = await request.json();

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

    // Check if there is an existing log for the given username
    const existingLog = game.logs ? game.logs.find((l) => l.username === username) : null;

    if (existingLog && !existingLog.finished) {
      client.close();
      return NextResponse.json(
        { success: false, message: "Existing log is not finished" },
        { status: 400 }
      );
    }

    // Create a new log object
    const newLog = {
      username,
      log,
      dateStarted: new Date().toISOString(),
      finished: false, // New log is not finished by default
    };

    // Update the game to add the new log
    await db.collection("Users").updateOne(
      { _id: gameOwner._id, "games.gameID": gameID },
      { $push: { "games.$.logs": newLog } }
    );

    client.close();
    return NextResponse.json({
      success: true,
      message: "Log added successfully",
      log: newLog,
    });
  } catch (error) {
    console.error("Error during adding log:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
