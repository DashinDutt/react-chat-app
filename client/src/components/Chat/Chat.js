import React, { useState, useEffect, Component
} from 'react';
import Button from '@material-ui/core/Button';


import queryString from 'query-string';
import io from 'socket.io-client';


import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';


import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'https://uttkarsh-react-chat.herokuapp.com/';
  const [darkmode, setDarkMode] = useState('outerContainer');
  const [isdarkmode, setIsDarkMode] = useState('false');

  const toggleDarkMode = () => {
      if (darkmode === 'outerContainer'){
          setDarkMode('outerContainerDark');
          setIsDarkMode('true');
      }
      else{
          setDarkMode('outerContainer');
          setIsDarkMode('false');
      }
  }

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
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  
  return (
    <div className={darkmode}>
      <div className='container'>
          <InfoBar room={room} darkModeStatus={isdarkmode}/>
          <Messages messages={messages} name={name} darkModeStatus={isdarkmode}/>
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} darkModeStatus={isdarkmode}/>
      </div>
      <TextContainer users={users} darkModeStatus={isdarkmode}/>
      <div>
      <Button variant='outlined' color='primary' onClick={toggleDarkMode}>Toggle Dark Mode</Button>
      </div>
    </div>
  );
}

export default Chat;
