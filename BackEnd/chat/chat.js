const logger = require("../logger.js");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const chatSever = (io) => {
  //usually its server.on('request(event name)', requestListener( a function))
  io.on("connection", (socket) => {
    socket.on("join", ({ room, userInfo }, callback) => {
      const { error, user } = addUser({
        id: socket.id,
        room,
        userInfo,
      }); //add user function can only return 2 things a user with error property or user property
      if (!user || error) {
        return callback(error); //error handeling
      } else {
        // socket.broadcast.to(user.room).emit("message", {
        //   user: "admin",
        //   text: `${user.name}, has joined!`,
        // });
        socket.join(user.room.room_id);

        io.to(user.room.room_id).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
        callback();
      }
    });

    //gets an event from the front end, frontend emits the msg, backends receives it
    socket.on("sendMessage", ({ room, message, userInfo }, callback) => {
      const user = getUser(socket.id); //we havve access to socket from above
      if (!user) {
        const { error, user } = addUser({
          id: socket.id,
          room,
          userInfo,
        });
        if (error) {
          return callback(error); //error handeling
        } else {
          io.to(room.room_id).emit("message", {
            userInfo: userInfo,
            sendMessage: message,
          });

          io.to("public").emit("message", {
            userInfo: user.info,
            sendMessage: message,
            socket_user: socket.id,
          });

          callback();
        }
      } else {
        //when the user leaves we send a new message to roomData
        //we also send users since we need to know the new state of the users in the room;
        io.to(user.room.room_id).emit("message", {
          userInfo: user.info,
          sendMessage: message,
          socket_user: socket.id,
        });

        io.to("public").emit("message", {
          userInfo: user.info,
          sendMessage: message,
          socket_user: socket.id,
        });

        callback();
      }
    });

    //does not take any parameters since we are just unmounting here
    socket.on("disconnect", () => {
      const user = removeUser(socket.id); //remove user when they disconnect
      //admin sends a message to users in the room that _ user has left
      if (user) {
        // io.to(user.room).emit("message", {
        //   user: "Admin",
        //   text: `${user.info.name} has left.`,
        // });
        io.to(user.room.room_id).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });

    socket.on("error", (err) => {
      logger.error(err);
      console.log("error" + err);
    });
  });
};

module.exports = { chatSever };
