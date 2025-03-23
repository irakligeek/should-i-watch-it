import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "react-oidc-context";
import awsCognito from "./aws-cognito.jsx";

const oidcConfig = {
  ...awsCognito,
  automaticSilentRenew: true,
  loadUserInfo: true,
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
