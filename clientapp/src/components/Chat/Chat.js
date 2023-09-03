import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Game from '../Game/Game.js';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [actor , setActor] = useState('A');
  const [actress , setActress] = useState('A');
  const [movie , setMovie] = useState('A');
  const [song , setSong] = useState('A');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'https://bollywood-game-server.onrender.com/';
  const welcome_message = "Welcome to the game! This is similar to hangman game except that you have to be a bollywood buff to be good at this. All the circles are hints. Top right circle is the actor name. Top right is the actress name. Bottom left is the movie name. If you find it difficult to guess the names, then you can find it in the developer settings. Sorry for the trouble"

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
      else{
        alert(welcome_message)
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(()=>{
    alert("Please wait for a few seconds. Sometimes it takes time for the server to be back up.")
  },[location.search])
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    socket.on("gamedata", ({data}) => {
      data.actorans ? setActor(data.actor) : setActor(data.actor[0]);
      data.actressans ? setActress(data.actress) : setActress(data.actress[0]);
      data.songans ? setSong(data.song) : setSong(data.song[0]);
      data.movieans ? setMovie(data.movie) : setMovie(data.movie[0]);
    });

    // socket.on("increasescore" , ({user}) => {
    //   console.log(user);
    //    var userscpy = [...users]
    //    console.log('users'  + users);
    //    console.log(userscpy);
    //    for(var i=0;i<users.length;i++){
    //      if(userscpy[i].name === user){
    //        userscpy[i].score+=100;
    //      }
    //    }
       
    //    setUsers(userscpy);
    // })
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  const newgame = (event) =>{
    event.preventDefault();
    socket.emit('newgame' , room , ()=>{console.log('new game')} );
  }

  return (
    <div>
      <div className="background">
	      <h1>SABSE FILMY</h1>
      </div>
    <div className="outerContainer">
      <TextContainer users={users}/>
      <Game actor={actor} actress = {actress} movie = {movie} song = {song} btnfn = {newgame}/>
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      
    </div>
    </div>
  );
}

export default Chat;
