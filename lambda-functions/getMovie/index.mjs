import fetch from 'node-fetch';

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow any origin or specify your domain
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
  };
  const movieId = event.queryStringParameters?.id;
  const type = event.queryStringParameters?.type || 'movie';

  if (!movieId) {
    return {
      statusCode: 422,
      headers: headers,
      body: JSON.stringify({ message: 'Movie ID is required' }),
    };
  }

  const API_URL = `https://api.themoviedb.org/3/${type}/${movieId}`;
  const API_KEY = process.env.TMDB_API_KEY;

  const endpoint = `${API_URL}?language=en-US`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        message: 'Movie fetched successfully',
        movie: data,
      }),
    };
  } catch (error) {
    console.error('Error fetching movie:', error);

    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: 'Error fetching movie', error: error.message }),
    };
  }
};
