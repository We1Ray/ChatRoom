const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = 81;

const fileupload = require("express-fileupload");
app.use(fileupload(), cors());

app.use(cors());
app.use(express.json());

const chatRouter = require("./routes/chat");
app.use("/chat", chatRouter);

const fileRouter = require("./routes/file");
app.use("/file", fileRouter);

const socketio = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socketio(server); //this is an instance of the socketio
const { chatSever } = require("./chat/chat");

chatSever(io);

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
