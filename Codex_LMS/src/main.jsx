import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CoreApp from "./CoreApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CoreApp />
  </StrictMode>
);
