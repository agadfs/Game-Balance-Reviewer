import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt'; // For hashing passwords
import generateRandomToken from '@/src/tools/tokenGenerator';

export async function POST(request) {
  try {
    const { password, name, email } = await request.json();

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Check if the email already exists
    const existingUser = await db.collection('Users').findOne({ $or: [{ email }, { name }] });

    if (existingUser) {
      client.close();
      return NextResponse.json({ success: false, message: 'Email or Name already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = {
      name,
      email,
      password: hashedPassword,
      currentToken: generateRandomToken(), // Generate an initial token
      tokenExpiration: new Date(Date.now() + 30 * 60000).toISOString(), // Token expiration time (30 minutes from now)
    };

    // Insert the new user into the database
    await db.collection('Users').insertOne(newUser);

    client.close();

    return NextResponse.json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
