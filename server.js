const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// var io = require('socket.io')(3000)

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });

    socket.on('message', (msg) => {
    console.log('msg: ' + msg);
    });
    // app.send('Dead')
    // socket.emit('message', 'Hello world');
    // socket.on('disconnect', () => {
    //     console.log('user disconnected');
    // });    
});

// const io = new Server(app);

app.get('/', (req, res) => {
    res.sendFile('E:/Just Some Files/C#/index.html');
})

server.listen(3000, () => {
    console.log("sad")
});

// console.log("nice");