import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, addDoc } from "firebase/firestore"; 
export async function GET(request) {
  function generateJWTToken() {
    const payload = {
      sub: 'sync',
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // Expiration time set to 10 minutes
    };

    const secretKey = process.env.MOTIONTAG_SECRET_KEY;
    return jwt.sign(payload, secretKey);
  }

  async function fetchStorylineWithPaging(pageAfter = null) {
    const token = generateJWTToken();
    let url = process.env.MOTIONTAG_URL;

    if (pageAfter) {
      url += `?page[after]=${pageAfter}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Response status:', response.status);

    if (response.ok) {
      const data = await response.json();

      if (data.links && data.links.next) {
        const nextPageAfter = data.links.next.split('page%5Bafter%5D=')[1];
        await fetchStorylineWithPaging(nextPageAfter);
      }

      return data;
    } else {
      throw new Error('Failed to load storyline with paging');
    }
  }

  function convertNestedArraysToObjects(data) {
    const transformData = (obj) => {
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          // If it's an array, check its contents
          obj[key] = obj[key].map((item, index) => {
            if (Array.isArray(item)) {
              // Replace nested arrays with an object that holds the array
              return { [`array_${index}`]: item };
            } else if (typeof item === 'object') {
              return transformData(item);
            }
            return item;
          });
        } else if (typeof obj[key] === 'object') {
          obj[key] = transformData(obj[key]);
        }
      }
      return obj;
    };
    return transformData(data);
  }
  
  async function saveToFirestore(storylineData) {
    try {
      // Convert nested arrays to objects before saving to Firestore
      const cleanedData = convertNestedArraysToObjects(storylineData);
  
      // Save each record in the storyline data to Firestore
      for (const record of cleanedData.data) {
        const docRef = await addDoc(collection(db, 'All Recorded Trips'), {
          ...record,
          timestamp: new Date(), // Add timestamp for reference
        });
        console.log('Document written with ID: ', docRef.id);
      }
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  

  try {
    console.log('Fetching storyline with paging...');
    const pageAfter = request.nextUrl.searchParams.get('pageAfter') || null;
    const storylineData = await fetchStorylineWithPaging(pageAfter);

    // Save the fetched data into the Firestore collection
    await saveToFirestore(storylineData);

    return NextResponse.json(storylineData, { status: 200 });
  } catch (error) {
    console.error('Error during motion tag fetch:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
