import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import AWS from "aws-sdk";

const lambda = new AWS.Lambda();
const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  const userId = event.queryStringParameters?.userId;
  if (!userId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "User ID is required" }),
    };
  }

  const params = {
    TableName: "MoviesWatchlist",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  try {
    const command = new QueryCommand(params);
    const data = await dynamoDb.send(command);

    const moviePromises = data.Items.map(async (item) => {
      const movieId = item.movieId.S;
      const type = item.type.S;  // Get the type of the movie (e.g., 'movie' or 'tv')

      // Call another Lambda function for each movie with its type
      const getMovieParams = {
        FunctionName: "getMovie",  // Replace with your Lambda function name
        Payload: JSON.stringify({
          queryStringParameters: { id: movieId, type },  // Pass movieId and type
        }),
      };

      try {
        const result = await lambda.invoke(getMovieParams).promise();
        if (result.StatusCode === 200) {
          const responseBody = JSON.parse(result.Payload);
          const movieData = JSON.parse(responseBody.body);
          return movieData?.movie || null;
        }
      } catch (error) {
        console.error(`Error fetching movie ${movieId}:`, error);
      }
      return null;
    });

    const movies = (await Promise.all(moviePromises)).filter(Boolean);

    if (movies.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "No movies found for this user" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Movies fetched successfully", movies }),
    };
  } catch (error) {
    console.error("Error fetching user movies:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error retrieving movies", error: error.message }),
    };
  }
};
