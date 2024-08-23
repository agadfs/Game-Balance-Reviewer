import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import generateRandomToken from "@/src/tools/tokenGenerator";

export async function POST(request) {
  try {
    const { token } = await request.json();

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const user = await db.collection("Users").findOne({ currentToken: token });

    if (user) {
      client.close();
      return NextResponse.json({
        success: true,
        message: "Games found",
        games: user.games,
      });
    } else {
      client.close();
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
