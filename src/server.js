import http from "http";
//import { WebSocketServer } from 'ws';
import express from "express";
import path from 'path';
import { Server } from "socket.io";

const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);
//const wss = new WebSocketServer({ server });

wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
    });
})

function handleConnection(socket) {
    console.log(socket)
}

/* const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anno";

    console.log("Connected to Browser");
    socket.on("close", () => {
        console.log("Disconnected from the Browser");
    });
    socket.on("message", msg => {
        //console.log(message.toString('utf8'));
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
                sockets.forEach(aSocket => {
                    aSocket.send(`${socket.nickname}: ${message.payload} `);
                });
            case "nickname":
                socket["nickname"] = message.payload;
            //console.log(message.payload);
        }
        //console.log(parsed, message.toString('utf-8'));
    });
}) */

httpServer.listen(4000);
