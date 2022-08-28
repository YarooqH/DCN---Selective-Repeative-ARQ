const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { setInterval } = require('timers');
const io = new Server(server);

// var io = require('socket.io')(3000)
let nack = [];
let ack = [];
let nackStatus = false;
let lastPacket;

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
        lastPacket = msg;
        
        function packetDelay(msg){
            setTimeout(()=>{
                // console.log(msg);
                // if(count == 1 || ackCount == count)
                // if(count == 1 | !nackStatus){
                    io.emit('packetR', count);
                    // ackCount = count;
                    count++;
                    if(count <= msg){
                        packetDelay(msg);
                }
            // } 
                // else if (nackStatus){
                //     io.emit('packetR', nack);
                // }
            },3000)
        }
        packetDelay(msg);
    })

    socket.on('packetAck', (msg) => {
        console.log(msg);
        ack.push(msg[1]);
        findMissingAck(ack);
    })

    // socket.emit('nack', (msg) => {
    //     resendNACKPackets(nack);
    // })

    // socket.emit('hello', 'nice');
});

// const io = new Server(app);
app.get('/', (req, res) => {
    res.sendFile('E:/Just Some Files/C#/index.html');
})

server.listen(3000, () => {
    console.log("Server is Running on 3000");
});

// console.log("nice");

const findMissingAck = (li) => {
    console.log(ack);
    for (let i = 0; i < li.length; i++) {
        if((li[i]-li[i-1]) >= 2){
            console.log('li shit: ', li[i-1]+1);
            nack.push(li[i-1]+1);
        }        
    }
    checkIfPacketEnd();
}

const checkIfPacketEnd = () => {
    console.log('ack:'+ ack[ack.length-1]);
    console.log('lastpacket: ' + lastPacket);
    if(ack[ack.length-1] == lastPacket){
        nackStatus = true;        
        console.log('nackStatus: ' + nackStatus);
        resendNACKPackets(nack);
    }
}

const resendNACKPackets = (li) => {
    console.log(li);
    console.log('nackStatis' + nackStatus);
    if(nackStatus) {
        console.log('im in', li);
        for(let i = 0; i < li.length; i++ ){
            console.log(li[i]);
            io.emit('packetR', li[i]);
        }
    }
}