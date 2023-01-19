const http = require("http");
const { app } = require("./app");
const { redisStart } = require("./sessions");

const server = http.createServer(app);

async function startServer() {
  await redisStart();
  server.listen(4000, () => {
    console.log("server is listenig on port 4000");
  });
}

startServer();
