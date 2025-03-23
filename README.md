# Should I Watch This?

A simple movie and TV show recommendation app powered by the TMDb API. Users can search for movies or TV shows and receive a watch recommendation based on ratings. The app allows users to save movies to a watchlist after signing in.  

🚀 **Live App:** [Should I Watch This?](https://d3tzed57uik6cm.cloudfront.net/)  

This application is deployed on AWS using a fully serverless architecture, ensuring scalability and cost efficiency.  

## Features
- Search for movies or TV shows.
- Get a "Watch Recommendation" based on ratings.
- User authentication via AWS Cognito.
- Add movies/TV shows to a personal watchlist (stored in DynamoDB).
- Secure API endpoints with Cognito authentication.

## Tech Stack
- **Frontend**: Vite, React, Tailwind CSS
- **API**: TMDb API for fetching movie/TV data.
- **Backend**: AWS Serverless Architecture  
  - **AWS Lambda** – Handles API requests and processes movie data.  
  - **DynamoDB** – Stores user watchlist data.  
  - **Cognito** – Manages user authentication and signup/login.  
  - **API Gateway** – Routes API requests to Lambda and secures endpoints with Cognito authentication.  

## Deployment
This project is deployed as a serverless application using AWS services:
1. **Frontend** – Hosted on AWS S3 with public access via CloudFront.
2. **Backend** – AWS Lambda functions exposed through API Gateway.
3. **User Authentication** – AWS Cognito for signup, login, and securing API Gateway endpoints.  
4. **Data Storage** – DynamoDB for storing and reading user watchlists data.

## Future Enhancements
- Implement personalized recommendations.

## Contributions
Feel free to submit issues or contribute by creating a pull request.  
