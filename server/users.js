const data  = require('./data.js')
const users = [];
const mongoose = require('mongoose');
const User = require('./model/user');
const Question = require('./model/question')

const randomquestion = async () => {
  // console.log(data);
  const data = await Question.find({});
  console.log(data);
  return data[Math.floor(Math.random()*(data.length))]
}
const addUser = async ({ id, name, room }) => {
  // console.log(users);
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // const existingUser = users.find((user) => user.room === room && user.name === name);
  const existingUser = await User.findOne({name , room})

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const notemptyroom = await User.findOne({room});
  // console.log(notemptyroom , 'notemptyroom')
  var user;
  if(notemptyroom){
    //  user = { id, name, room , question: notemptyroom.question , score: 0 };
    const nuser = new User({
      name,
      room,
      id,
      actor : notemptyroom.actor,
      actress : notemptyroom.actress,
      song : notemptyroom.song,
      movie : notemptyroom.movie,
      actorans : notemptyroom.actorans,
      actressans : notemptyroom.actressans,
      songans : notemptyroom.songans,
      movieans : notemptyroom.movieans,
      score : 0
      
    });
    user = await nuser.save();
    return {user};
    
  }else{
      var question = await randomquestion();
      console.log(question)
      // console.log(question)
      const nuser = new User({
        name,
        room,
        id,
        actor : question.actor,
        actress : question.actress,
        song : question.song,
        movie : question.movie,
        actorans : false,
        actressans : false,
        songans : false,
        movieans : false,
        score : 0
        
      });
      user = await nuser.save();
      return {user};
  // users.push(user);

  
}

}


const newgame = async (room) => {
  var newquestion = await randomquestion();
  await User.updateMany({room : room} , 
    {actor : newquestion.actor,
      actress : newquestion.actress,
      movie : newquestion.movie,
      song : newquestion.song ,
       actorans:false , actressans:false,movieans :false,songans:false})
}


const checkans = async (message , data) => {
  if(!data.actorans && data.actor === message){
    // data.actorans = true
    await User.updateMany({room : data.room} , {actorans : true})
  }

  if(!data.actressans && data.actress === message){
    await User.updateMany({room : data.room} , {actressans : true})
  }

  if(!data.movieans && data.movie === message){
    await User.updateMany({room : data.room} , {movieans : true})
  }

  if(!data.songans && data.song === message){
    await User.updateMany({room : data.room} , {songans : true})
  }



  const u = await User.findOne({id : data.id});
  return u;
}

const removeUser = async (id) => {
  // console.log("pased id" , id)
  const deluser = await User.findOneAndDelete({id : id});
  // console.log("deleted user is" , deluser);
  return deluser
}

// const getUser = (id) => users.find((user) => user.id === id);


const getUser = async (id) => {
  const user = await User.findOne({id : id});
  return user;
}

// const getUsersInRoom = (room) => users.filter((user) => user.room === room);
const getUsersInRoom = async (room) => {

  const users = await User.find({room});
  // console.log(users);
  return users
};

const updatescores = async (room , id) => {
    const user = await User.findOne({id})
    await User.findOneAndUpdate({id} , {score: user.score+100})
  }

module.exports = { addUser, removeUser, getUser, getUsersInRoom  , checkans , updatescores , newgame}