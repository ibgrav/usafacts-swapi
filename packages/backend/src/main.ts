import { createServer } from "./create-server";
import { PORT } from "./lib/constants";

const { server } = createServer();

// listen on 0.0.0.0 to expose the server to the outside container (Docker) network
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening http://127.0.0.1:${PORT}`);
});

// For Prod: Test to ensure server is shut down gracefully
const exitServer = () => {
  server.close(() => {
    console.log(" Backend server closed");
  });
};

// handled ctrl+c and dev restarts
process.on("SIGINT", exitServer);
process.on("SIGTERM", exitServer);
