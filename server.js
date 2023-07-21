const express = require('express')
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const ACTIONS = require('./src/Actions');
const path = require('path');

const server = http.createServer(app);  // Passing express obj to server
const io = new Server(server);  // Instance to server class, (pass socket server).. Server is ready here

app.use(express.static('build')); //express.static is inbuilt middleware.. opensbuilt folder.. index.html is automatically picked and displayed in browser
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));  
})

const userSocketMap = {};   //whenever new user joins, his username and socketid will be stored in map. (Deleted if server restarts)

function getAllConnectedClients(roomId) {            // To return array of socketIds
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {      // Input we get is of type map. from changes map input to array
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    });       
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({roomId, username}) => {       // Received from EditorPage of new user
        userSocketMap[socket.id] = username;
        socket.join(roomId);        // Join the socket in room using roomId. Creates new room if roomId doesn't exists.
        const clients = getAllConnectedClients(roomId);     // to get all clients in the room. (Toast with user joined shows up when a new user is joined)
        console.log(clients);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });     //using server object send ACTION to every socket(user).
        });
    });
    
    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code});    // Send code to all clients except myself (therefore socket.in)
    });

    socket.on(ACTIONS.SYNC_CODE, ({socketId, code}) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});    // Send code to all clients except myself (therefore socket.in)
    });

    // Event before getting disconnected from ROOM. Client is disconnecting
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];    // Creates to array all the rooms on server
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
