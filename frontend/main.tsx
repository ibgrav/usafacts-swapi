import "./styles/global.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { App } from "./components/app/app";

// defined in index.html
const root = document.getElementById("root") as HTMLDivElement;

createRoot(root).render(
  <StrictMode>
    {/* For prod: add better unknown error handling - maybe a 404 or help page */}
    <ErrorBoundary fallbackRender={() => <h1>An unknown error has occured.</h1>}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
