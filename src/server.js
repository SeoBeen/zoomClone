import http from "http";
import { WebSocketServer } from 'ws';
import express from "express";
import path from 'path';

const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const server = http.createServer(app);

const wss = new WebSocketServer({ server });

function handleConnection(socket) {
    console.log(socket)
}

const sockets = [];

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
})

server.listen(4000);
