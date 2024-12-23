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
import { Server } from "socket.io";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// users
app.use("/api/users", userRoutes);
// friends
app.use("/api/friends", friendRoutes);
// chats
app.use("/api/chat", chatRoutes);
// messages
app.use("/api/message", messageRoutes);

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
        origin: "http://localhost:3000" // CHANGE
    },
    pingTimeout: 60000
});

io.on("connection", socket => {
    console.log(`Connected to socket.io`);

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
});
