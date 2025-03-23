import fetch from 'node-fetch';  // Import node-fetch

export const handler = async (event) => {
  // Get 'query' and 'type' parameters from the event
  const query = event.queryStringParameters?.query || '';
  const type = event.queryStringParameters?.type || 'movie';
  const callType = type === 'movie' ? 'movie' : 'tv';

  // API URL for fetching movies from TMDb (you need to replace this with your actual API endpoint and API_KEY)
  const API_URL = 'https://api.themoviedb.org/3/search';
  const API_KEY = process.env.TMDB_API_KEY;

  // Build the endpoint URL for fetching movies (searching by query)
  const endpoint = `${API_URL}/${callType}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

  try {
    // Fetch movies from TMDb
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle if the response fails
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    // Return the fetched movies in the response body
    const responseBody = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",  // You can set this to your specific domain
        "Access-Control-Allow-Headers": "Content-Type, Authorization",  // Allow these headers
        "Access-Control-Allow-Methods": "OPTIONS,GET",  // Allow methods if needed
      },
      body: JSON.stringify({
        message: 'Movies fetched successfully',
        query: query,
        movies: data.results || [],  // return the list of movies
      }),
    };

    return responseBody;
  } catch (error) {
    // Log any errors
    console.error('Error fetching movies:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching movies', error: error.message }),
    };
  }
};
