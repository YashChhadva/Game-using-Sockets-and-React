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
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
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
