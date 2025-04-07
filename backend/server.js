import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import { Server } from "socket.io";
import { deleteMapEntryByValue, reverseLookup } from "./utils/mapUtils.js";
import cors from "cors";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.REACT_APP_FRONTEND,
        credentials: true
    })
);

// users
app.use("/api/users", userRoutes);
// friends
app.use("/api/friends", friendRoutes);
// chats
app.use("/api/chat", chatRoutes);
// messages
app.use("/api/message", messageRoutes);
// files
app.use("/api/files", fileRoutes);

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running....");
    });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () =>
    console.log(`Server started on port ${port}`)
);

// Socket IO logic

const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP_FRONTEND // CHANGE
    },
    pingTimeout: 60000
});

let activeUsers = new Set();
let socketToUser = new Map();

io.on("connection", socket => {
    console.log(`Connected to socket.io`);

    // active status and video calling
    socket.on("heartbeat", userId => {
        if (userId) {
            activeUsers.add(userId);

            socketToUser = deleteMapEntryByValue(socketToUser, userId);
            socketToUser.set(socket.id, userId);

            // console.log("active", activeUsers);
            // console.log("map", socketToUser);
            // console.log(userId, "connect user socket -> ", socket.id);
            io.emit("update-active-users", Array.from(activeUsers));

            // emit my id
            socket.emit("my-sock-id", socket.id);
        }
    });

    //vc
    socket.on("callToFriend", data => {
        console.log("Incoming call from ", data.from, " ", data.name);
        const friendSocket = reverseLookup(socketToUser, data.callToFriendId);
        if (friendSocket) {
            console.log("sending call to ", data.callToFriendId);
            console.log("friend Socket", friendSocket);
            io.to(friendSocket).emit("callToFriend", {
                signal: data.signalData,
                from: data.from,
                name: data.name
            });
        }
    });

    socket.on("reject-call", ({ to, name }) => {
        // to has same as above {signal,from,name}
        io.to(to.from).emit("callRejected", { name });
    });

    socket.on("answerCall", ({ signal, to, from }) => {
        console.log(`Answering call from ${from} to ${to}`);
        io.to(to).emit("callAccepted", { signal, from });
    });

    socket.on("call-ended", ({ to, name }) => {
        io.to(to).emit("callEnded", { name });
    });

    socket.on("disconnect", () => {
        activeUsers.delete(socketToUser.get(socket.id));
        socketToUser.delete(socket.id);

        // close vc
        socket.broadcast.emit("disconnectUser", { disUser: socket.id });

        io.emit("update-active-users", Array.from(activeUsers));

        // console.log("disconnect user socket -> ", socket.id);
        // console.log("disconnected");
        // console.log("active", activeUsers);
        // console.log("map", socketToUser);
    });

    // real time chats
    socket.on("setup", userData => {
        //create a room
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", room => {
        // join room i.e chat id
        socket.join(room);
        console.log("User joined room", room);
    });

    socket.on("typing", room => socket.to(room).emit("typing"));
    socket.on("stop typing", room => socket.to(room).emit("stop typing"));

    socket.on("new message", newMessageReceived => {
        let chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    // cleanup
    socket.off("setup", userData => {
        console.log("USER Disconnected");
        socket.leave(userData._id);
    });
});
