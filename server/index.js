const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const data = require('./data');
const mongoose = require('mongoose');
const Question = require('./model/question');


const { addUser, removeUser, getUser, getUsersInRoom , checkans , updatescores , newgame } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

mongoose
    .connect('mongodb+srv://yelpcampuser:epVNO1SdwXrq7C8u@tgame.yjhsb.mongodb.net/Tgame?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology:true
    })
    .then(() => console.log('DB Connected'));

app.use(cors({credentials : true}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", 'https://bollywood-game-sockets.onrender.com');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(router);

io.on('connect', (socket) => {
  socket.on('join', async ({ name, room }, callback) => {
    const {error , user} = await addUser({ id: socket.id, name, room })

    if(error) return callback(error);
    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    io.to(user.room).emit('gamedata' , {room : user.room , data : user})
    io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room) });

    callback();

  });

  socket.on('newgame', async (room, callback) => {
    // console.log(user);
    await newgame(room);
    const user = await getUser(socket.id);
    io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room)});
    io.to(user.room).emit('gamedata' , {room : user.room , data : user});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} requested for a new challenge` });
    callback();
  });

  

  socket.on('sendMessage', async (message, callback) => {
    const user = await getUser(socket.id);
    d = await checkans(message.trim().toUpperCase() , user)
    if (d.songans!==user.songans || d.actorans!==user.actorans || d.actressans!==user.actressans || d.movieans!==user.movieans){
      socket.emit('message', { user: 'admin', text: `${user.name} got one of the categories right!!`});
      await updatescores(user.room,user.id);
      io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room)});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} got one of the categories right!!` });
    }
    io.to(user.room).emit('gamedata' , {room : user.room , data : d})
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', async () => {
    const user = await removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));