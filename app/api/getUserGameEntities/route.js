import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    const { gameID } = await request.json();

    await client.connect();
    const db = client.db();
    const entitiesCursor = await db.collection("LogOfActions").find({ gameId: gameID });

    // Convert cursor to array
    const entitiesArray = await entitiesCursor.toArray();

    if (entitiesArray.length > 0) {
      const logs = entitiesArray.map(entity => ({
        log: entity.log,
        interface_Used: entity.Interface_Used,
      }));

      return NextResponse.json({
        success: true,
        message: "Entities log found",
        logs: logs,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid gameID or no logs found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error during log retrieval:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await client.close(); // Ensure the client is closed after operation
  }
}
