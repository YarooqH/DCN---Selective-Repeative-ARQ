# Selective Repeat ARQ
## Implemented using JS, Node, Express and Socket.io

Packet Delay (Timer) on the server is set to 3 seconds.

### How it Works?
If an acknowledge is not received of a certain packet by the server then the server sends the remaining packet along with the last packet of the window.

![Implementation](./assets/Implementation.gif)

