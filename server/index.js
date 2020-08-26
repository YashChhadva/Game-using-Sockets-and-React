const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const data = require('./data')

const { addUser, removeUser, getUser, getUsersInRoom , checkans , updatescores , newgame } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    io.to(user.room).emit('gamedata' , {room : user.room , data : user.question})
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('newgame', (room, callback) => {
    // console.log(user);
    newgame(room);
    const user = getUser(socket.id);
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    io.to(user.room).emit('gamedata' , {room : user.room , data : user.question});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} requested for a new challenge` });
    callback();
  });

  

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    d1 = {...user.question}
    d = checkans(message.trim().toUpperCase() , user.question)
    if (d.songans!==d1.songans || d.actorans!==d1.actorans || d.actressans!==d1.actressans || d.movieans!==d1.movieans){
      socket.emit('message', { user: 'admin', text: `${user.name} got one of the categories right!!`});
      updatescores(user.room,user.name);
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} got one of the categories right!!` });
    }
    io.to(user.room).emit('gamedata' , {room : user.room , data : d})
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));