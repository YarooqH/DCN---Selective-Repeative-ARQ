const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { setInterval } = require('timers');
const io = new Server(server);

// var io = require('socket.io')(3000)

io.on('connection', (socket) => {
    console.log('a user connected');
    // setInterval(() => {
    //     io.emit('hello', 'packet')
    // },5000)
    io.emit('user', 'userIsDead');

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });

    socket.on('clientmsg', (msg) => {
        console.log('msg: ' + msg);
        io.emit('msg', msg);
    });
});

// const io = new Server(app);

app.get('/', (req, res) => {
    res.sendFile('E:/Just Some Files/C#/index.html');
})

server.listen(3000, () => {
    console.log("sad")
});

// console.log("nice");