import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
  try {
    const { token, game } = await request.json();

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Check if the gameID already exists in any user's games array
    const gameExists = await db.collection("Users").findOne({
      "games.gameID": game.gameID,
    });

    if (gameExists) {
      client.close();
      return NextResponse.json(
        { success: false, message: "Game ID already exists" },
        { status: 400 }
      );
    }

    // Find the user by currentToken
    const user = await db.collection("Users").findOne({ currentToken: token });

    if (user) {
      // Define the new game object
      const newGame = {
        name: game.name,
        genre: game.genre,
        platform: game.platform,
        gameID: game.gameID,
        dateCreated: new Date().toISOString(), // Set the current date and time
      };

      // Update the user's games array by adding the new game
      await db.collection("Users").updateOne(
        { _id: user._id },
        { $push: { games: newGame } }
      );

      client.close();
      return NextResponse.json({
        success: true,
        message: "Game added successfully",
        games: [...(user.games || []), newGame], // Return the updated games array
      });
    } else {
      client.close();
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error during adding game:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
