const data  = require('./data.js')
const users = [];

const randomquestion = () => {
  // console.log(data);
  return data[Math.floor(Math.random()*(data.length))];
}

const addUser = ({ id, name, room }) => {
  // console.log(users);
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const notemptyroom = users.find((user) => user.room === room);
  var user
  if(notemptyroom){
     user = { id, name, room , question: notemptyroom.question , score: 0 };
  }else{
     user = { id, name, room , question : randomquestion() , score: 0 };
  }
  users.push(user);

  return { user };
}


const newgame = (room) => {
  var newquestion = randomquestion();
  for(var i=0;i<users.length;i++){
    if(users[i].room===room){
      users[i].question = newquestion;
    }
  }
}

const checkans = (message , data) => {
  if(!data.actorans && data.actor === message){
    data.actorans = true
  }

  if(!data.actressans && data.actress === message){
    data.actressans = true
  }

  if(!data.movieans && data.movie === message){
    data.movieans = true
  }

  if(!data.songans && data.song === message){
    data.songans = true
  }



  return data;
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const updatescores = (room , name) => {
  for(var i=0;i<users.length;i++){
    if(users[i].name===name && users[i].room===room){
      users[i].score+=100;
    }
  }
  console.log(users);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom  , checkans , updatescores , newgame};