const socketIo = require("socket.io");

const meetCntrl = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*", // Change this for security in production
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("offer", (data) => {
      socket.to(data.room).emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.to(data.room).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.room).emit("ice-candidate", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = meetCntrl;
