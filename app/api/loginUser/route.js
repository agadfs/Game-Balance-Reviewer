import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import generateRandomToken from '@/src/tools/tokenGenerator';

export async function POST(request) {
  try {
    const { password, name } = await request.json();

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const user = await db.collection('Users').findOne({ name, password });

    if (user) {
      const currentDate = new Date();
      const tokenExpirationDate = new Date(user.tokenExpiration);

      if (tokenExpirationDate > currentDate) {
        client.close();
        return NextResponse.json({ success: true, message: 'Login successful', token: user.currentToken });
      } else {
        const newToken = generateRandomToken();
        const newTokenExpiration = new Date(currentDate.getTime() + 30 * 60000).toISOString();

        await db.collection('Users').updateOne(
          { _id: user._id },
          { $set: { currentToken: newToken, tokenExpiration: newTokenExpiration } }
        );

        client.close();
        return NextResponse.json({ success: true, message: 'New token generated', token: newToken });
      }
    } else {
      client.close();
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
