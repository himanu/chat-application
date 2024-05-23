const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { signUpController, signInController, verifyTokenController } = require("./controllers/auth/index.controller");
const connectToDB = require("./db");
const { getUserFromToken } = require("./utils");
const verifyUser = require("./middlewares/auth");
const { getUserController } = require("./controllers/user/index.controller");
const { getConversationsController } = require("./controllers/conversation/index.controller");
const socketHandler = require("./socket");
const path = require("path");
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
      origin: "*", // Replace with your client URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
  }
});

const root_directory = path.dirname("");
app.use(express.json());
app.use(express.static(path.join(root_directory, "client", "build")));


app.post('/signup', signUpController);
app.post('/login', signInController);
app.get('/verfiy-token', verifyTokenController);
app.get('/users', verifyUser, getUserController);
app.get('/conversations', verifyUser, getConversationsController);

app.get("*", (req, res) => {
    console.log("sending file");
    res.sendFile(path.resolve(root_directory, "client", "build", "index.html"));
})

// socket.io connection middleware
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const user = await getUserFromToken(token);
        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
})
// Socket.io connection handling
io.on("connection", (socket) => socketHandler(socket, io));

server.listen(PORT, () => {
    connectToDB();
    console.log(`Server listening on ${PORT}`);
});
