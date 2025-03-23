const awsCognito = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_veVbdzDmq",
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri:  import.meta.env.VITE_REDIRECT_URI,
  response_type: "code",
  scope: "email openid phone profile",
};

export default awsCognito;
