const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { setInterval } = require('timers');
const io = new Server(server);

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

    socket.on('startSending', (msg) => {
        var count = 1;
        lastPacket = msg;
        
        function packetDelay(msg){
            setTimeout(()=>{
                    io.emit('packetR', count);
                    count++;
                    if(count <= msg){
                        packetDelay(msg);
                }
            },3000)
        }
        packetDelay(msg);
    })

    socket.on('packetAck', (msg) => {
        // console.log(msg);
        ack.push(msg[1]);
        findMissingAck(ack);
    })
});

app.get('/', (req, res) => {
    res.sendFile('E:/Just Some Files/C#/index.html');
})

server.listen(3000, () => {
    console.log("Server is Running on 3000");
});


const findMissingAck = (li) => {
    // console.log(ack);
    for (let i = 0; i < li.length; i++) {
        if((li[i]-li[i-1]) >= 2){
            // console.log('li shit: ', li[i-1]+1);
            nack.push(li[i-1]+1);
        }        
    }
    checkIfPacketEnd();
}

const checkIfPacketEnd = () => {
    // console.log('ack:'+ ack[ack.length-1]);
    // console.log('lastpacket: ' + lastPacket);
    if(ack[ack.length-1] == lastPacket){
        nackStatus = true;        
        // console.log('nackStatus: ' + nackStatus);
        resendNACKPackets(nack);
    }
}

const resendNACKPackets = (li) => {
    // console.log(li);
    // console.log('nackStatis' + nackStatus);
    if(nackStatus) {
        // console.log('im in', li);
        for(let i = 0; i < li.length; i++ ){
            console.log(li[i]);
            io.emit('packetR', li[i]);
        }
    }
}