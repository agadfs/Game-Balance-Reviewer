import jwt from 'jsonwebtoken'; 
import { NextResponse } from 'next/server';


export async function GET(request) {
  function generateJWTToken() {
    const payload = {
      sub: 'sync', // Fixed value for the 'sub' claim
      exp: Math.floor(Date.now() / 1000) + (60 * 10), // Expiration time set to 10 minutes from now
    };

    const secretKey = process.env.SECRET_KEY; // Replace with your actual secret key

    return jwt.sign(payload, secretKey);
  }

  async function fetchStorylineWithPaging(pageAfter = null) {
    // Create the JWT token
    const token = generateJWTToken();

    // Define the base API endpoint
    let url = 'https://bdmobility-sdk.motion-tag.de/sync/storyline';

    // Append the page[after] query parameter if provided
    if (pageAfter) {
      url += `?page[after]=${pageAfter}`;
    }

    // Make the GET request with the authorization header
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Response status:', response.status);
    if (response.ok) {
      const data = await response.json();

      // Parse the 'page[after]' for pagination
      if (data.links && data.links.next) {
        const nextPageAfter = data.links.next;
        const parts = nextPageAfter.split('page%5Bafter%5D=');

        // Recursively fetch the next page if there is another page
        await fetchStorylineWithPaging(parts[1]);
      } else {
        // No more pages: we've reached the last page
        console.log('No more pages. This is the last page.');
      }

      return data;
    } else {
      throw new Error('Failed to load storyline with paging');
    }
  }

  try {
    console.log('Fetching storyline with paging...');
    // Use request.nextUrl.searchParams to access query params in Next.js App Router
    const pageAfter = request.nextUrl.searchParams.get('pageAfter') || null;
    const storylineData = await fetchStorylineWithPaging(pageAfter);
    return NextResponse.json(storylineData, { status: 200 });
  } catch (error) {
    console.error("Error during motion tag fetch:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
