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
    socket.on('startServer', () => {
        io.emit('initPacket', 'initPacket');
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('clientMsg', (msg) => {
        console.log('msg: ' + msg);
        io.emit('msg', msg);
    });

    socket.on('clientAck1', (msg) => {
        console.log(msg)
        io.emit('serverPacket', 'Packet');
    })

    socket.on('hi', (msg) => {
        var count = 1;
        
        function packetDelay(msg){
            setTimeout(()=>{
                // console.log(msg);
                io.emit('packetR', 'packet ' + count);
                count++;
                if(count <= msg){
                    packetDelay(msg);
                }
            },3000)
        }
        packetDelay(msg);
        
        // for (let i = 1; i <= msg; i++) {
            // console.log(i); 
            // console.log('msg:' + msg); 
            // setTimeout(() => {
            //     console.log(msg);
            //     io.emit('packetR', 'packet ' + i);                                
                // if(i == msg) {
                //     // clearInterval();
                // } else {
                // }
            // },3000)
        // }
    })

    // socket.on('clientAck', (msg) => {
    //     io.emit('serverPacket', 'Packet');
    // })
});

// const io = new Server(app);

app.get('/', (req, res) => {
    res.sendFile('E:/Just Some Files/C#/index.html');
})

server.listen(3000, () => {
    console.log("Server is Running on 3000");
});

// console.log("nice");