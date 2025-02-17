const http = require("http");
const { sendMessageNotif } = require("../utils/sendNotif");

const initSocketServer = (app) => {
  const clients = {};

  const server = http.createServer(app);
  const io = require("socket.io")(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);

    socket.on("online", (id) => {
      console.log(`User ${id} is online`);
      if (id) {
        clients[id] = socket;
        io.emit("updateOnlineList", Object.keys(clients));
        console.log(`Registered client: ${id}`);
      }
    });

    // socket.on("pushNotif", (msg) => {
    //   const receiverId = msg.receiverId;
    //   if (clients[receiverId]) {
    //     clients[receiverId].emit("pushNotif", msg);
    //   } else {
    //     console.log(`User ${receiverId} is not connected`);
    //   }
    // });

    socket.on("message", (msg) => {
      console.log(`Received message: ${JSON.stringify(msg)}`);
      const receiverId = msg.receiverId;
      console.log(`Message receiver ID: ${receiverId}`);
      if (clients[receiverId]) {
        clients[receiverId].emit("message", msg);
        console.log(`Message sent to ${receiverId}`);
      } else {
        // sendMessageNotif(msg, receiverId);
        console.log(`User ${receiverId} is not connected`);
      }
    });

    socket.on("unsend", (msg) => {
      console.log(`Received message: ${JSON.stringify(msg)}`);
      const receiverId = msg.receiverId;
      console.log(`Message receiver ID: ${receiverId}`);
      if (clients[receiverId]) {
        clients[receiverId].emit("unsend", msg);
        console.log(`Message unsent to ${receiverId}`);
      } else {
        console.log(`User ${receiverId} is not connected`);
      }
    });

    socket.on("pin", (msg) => {
      console.log(`Received message: ${JSON.stringify(msg)}`);
      const receiverId = msg.receiverId;
      console.log(`Message receiver ID: ${receiverId}`);
      if (clients[receiverId]) {
        clients[receiverId].emit("pin", msg);
        console.log(`Message pin to ${receiverId}`);
      } else {
        console.log(`User ${receiverId} is not connected`);
      }
    });

    socket.on("unpin", (msg) => {
      console.log(`Received message: ${JSON.stringify(msg)}`);
      const receiverId = msg.receiverId;
      console.log(`Message receiver ID: ${receiverId}`);
      if (clients[receiverId]) {
        clients[receiverId].emit("unpin", msg);
        console.log(`Message unpin to ${receiverId}`);
      } else {
        console.log(`User ${receiverId} is not connected`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} has disconnected`);
      for (const [id, clientSocket] of Object.entries(clients)) {
        if (clientSocket === socket) {
          delete clients[id];
          console.log(`Removed client: ${id}`);
          break;
        }
      }
      io.emit("updateOnlineList", Object.keys(clients));
    });

    socket.on("error", (error) => {
      console.error(`Socket error: ${error.message}`);
    });
  });

  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on("error", (error) => {
    console.error(`Server error: ${error.message}`);
  });
};

module.exports = { initSocketServer };
