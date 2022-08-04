import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux";
import {socket, initSocketConnection} from '../client/socketio';
import { TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import '../css/main-styles.css';
import '../client';
import { createChat, fetchChats } from '../client';

export default function TalkControl({roomId, updateBadge}) {
    const userInfo = useSelector((state) => state.userReducer.User);
    const [state, setState] = useState({name: userInfo.nickname, message: ''});
    const [chat, setChat] = useState([]);
    const talkListRef = useRef();

    useEffect(()=>{
      initSocketConnection();
      if (roomId !== null && roomId !== undefined) {
        socket.emit('joinRoom', roomId, userInfo.nickname);
        var date = new Date();
        var time = date.getTime();
        fetchChats(roomId).then((res) => {
          var result = res.filter((chat) => {
              var d = new Date(chat.createAt);
              return d.getTime() < time;
            }).map(chat => {
            return({id : chat._id, name : chat.userName, message : chat.message, datetime :chat.createAt})
            });
          setChat(result);
          updateBadge(roomId, true);
        }
        );
      }
    },[roomId, userInfo]);

    useEffect(()=>{
      socket.on('message', (id, name, message, datetime)=>{
        setChat((chat) => chat.concat({id, name, message, datetime}));
      });
    },[]);
    useEffect(() => {
      if (talkListRef.current) {
        talkListRef.current.scrollTop = talkListRef.current.scrollHeight;
      }
    }, [chat])
    const onTextChange = (e) =>{
      setState({...state, message : e.target.value});
    }
    const sendMessage = () => {
      const {name, message} = state;
      createChat(roomId, name, message).then((res) => 
      {
        socket.emit('message', roomId, res._id, name, message, res.createAt);
        setState({name, message : ''});
      });
    }
    const onMessageSubmit = (e)=>{
      e.preventDefault();
      sendMessage();
    }
    const onKeyPress = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    }
    const dateToTimeString = (date) => {
      var d = new Date(date);
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      var time = `${hours}:${minutes}`;
      return time;
    }

    const dateDisplay = (dateString) => {
      let d = new Date(dateString);
      const year = String(d.getFullYear());
      const month = String(d.getMonth());
      const date = String(d.getDate());
      var convertedDate = `${year}년 ${month}월 ${date}일`;
      return (
        <span className="span-date">{convertedDate}</span>
      )
    }

    const renderChat = () => {
      var prevTime = null;
      var chatElement = chat.map(({id, name, message, datetime}, index) => {
        var insertDate = false;
        if (prevTime === null) {
          prevTime = datetime;
        }
        let prevDate = new Date(prevTime);
        let curDate = new Date(datetime);
        insertDate = index === 0 || prevDate.getDate() !== curDate.getDate();
        prevTime = datetime; 
        return(
          <div className='div-render-chat'>
          {insertDate === true ? (<div className='div-date'>{dateDisplay(datetime)}</div>) : null}
          {name === userInfo.nickname ? (
            <div className='div-talk-right'>
              <div className='div-div-talk-right' key={id}>
                <h6 className='time-right'>{dateToTimeString(datetime)}</h6>
                <div className='talk-bubble-right'>{message}</div>
              </div>
            </div>
          ) : (
            <div className='div-talk-left'>
              <div className='div-div-talk-left' key={id}>
                <div className='div-talk-box'>
                  <h5 className='nickname'>{name}:</h5>
                </div>
                <div className='talk-bubble'>{message}</div>
                <h6 className='time-left'>{dateToTimeString(datetime)}</h6>
              </div>
            </div>
          )}
          </div>
      )});
      return chatElement;
    }
    const sendMessageForm = () => {
      return (
        <div className="div-talk-input-form">
            <TextField className='text-field-message' label="Send Message.." onChange={(e) => onTextChange(e)} value={state.message} onKeyDown={(e) => onKeyPress(e)}/>
            <Button className='btn-send' variant='solid' endIcon={<SendIcon/>} onClick={(e) => onMessageSubmit(e)}/>
        </div>
      );
    }
    const defaultMessage = () => {
      return(
        <div className="div-talk-default">
          <p className="p-default">선택된 대화가 없습니다.</p>
        </div>
      );
    }
    const talkList = () => {
      return(
        <div className="div-talk-list" ref={talkListRef}>
          {renderChat()}
        </div>
      );
    }
    return(
        <div className="talk-container">
            {
              roomId !== undefined ? talkList() : defaultMessage()
            }
            {
              roomId !== undefined ? sendMessageForm() : null
            }
        </div>
    );
}