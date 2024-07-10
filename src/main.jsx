import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SupabaseAuthProvider } from "./integrations/supabase/auth.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SupabaseAuthProvider>
      <App />
    </SupabaseAuthProvider>
  </React.StrictMode>,
);