/**
 * Many hosting providers will set the PORT environment variable for you (or it's passed/set in the Dockerfile).
 * Will default to port 8080 for local development.
 */
export const PORT = parseInt(process.env.PORT || "8080", 10);

export const SWAPI_URL = "https://swapi.dev/api";
