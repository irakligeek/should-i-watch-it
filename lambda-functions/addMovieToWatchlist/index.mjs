import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow any origin or specify your domain
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Allowed methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
  };
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { userId, movieId, type } = body;

    if (!userId || !movieId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const command = new PutCommand({
      TableName: "MoviesWatchlist",
      Item: { userId, movieId, type },
      ConditionExpression: "attribute_not_exists(movieId)"
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: "Movie added to watchlist!" }),
    };
  } catch (error) {
    console.error("Error adding movie:", error); // Ensure logs appear in CloudWatch

    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        message: "Error adding movie",
        error: error.message || "Unknown error", // Ensures visibility
      }),
    };
  }
};
