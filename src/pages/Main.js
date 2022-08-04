import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups, fetchRooms, fetchChats, createGroup, createRoom, deleteRoom, fetchInfo, createConnectInfo, updateConnectInfo } from '../client';
import { socket, initSocketConnection } from '../client/socketio';
import { logout, setGroup, setRoom, setConnectInfo, readMessage, pushMessage, initList } from "../redux/action";

import '../css/styles.css';
import '../css/main-styles.css';
import FormDialog from '../components/formDialog';
import GroupList from '../components/groupList';
import CustomButton from '../components/button';
import AlertDialog from '../components/alertDialog';
import TalkControl from '../components/talkControl';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';

function Main (){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userReducer.User);
  const groupData = useSelector((state) => state.chatReducer.Data.groupData);
  const roomData = useSelector((state) => state.chatReducer.Data.roomData);
  const connectInfoData = useSelector((state) => state.chatReducer.Data.connectInfoData);
  const listState = useSelector((state) => state.chatReducer.ListState);

  //#region States
  const [isLoaded, setLoaded] = useState(false);
  const [AddGroupOpen, setOpenGroupDialog] = useState(false);
  const [AddRoomOpen, setOpenRoomDialog] = useState(false);
  const [DeleteRoomOpen, setDeleteRoomDialog] = useState(false);
  const [selectedGroupId, setGroupId] = useState();
  const [selectedRoomId, setRoomId] = useState();
  const [deleteRoomId, setDeleteRoomId] = useState();
  //#endregion
  
  //#region 초기 값 가져오기
  const updateInitState = () => {
    fetchGroups().then((groups) => {
      dispatch(setGroup(groups));
      fetchRooms().then((rooms) => {
        dispatch(setRoom(rooms));
        fetchInfo(userInfo.id).then((info) =>
        {
          dispatch(setConnectInfo(info));
          setLoaded(rooms !== undefined)
          if (rooms !== undefined) {
            initSocketConnection();
            updateListState();
          }
        })
      })
    });
  }
  const updateListState = () => {
    var initGroups = [];
    var initOpenStates = [];
    var initSelectedStates = [];
    var initUnreadStates = [];

    var openStates = listState.groupOpenStates;
    var selectedStates = listState.roomSelectedStates;
    groupData.some(function(element){
      let rooms = roomData.filter(room => room.groupId === element._id).map(room => {return([room._id, room.title])});
      let group = [element.title, element._id, rooms]
      initGroups = [...initGroups, group];
      let openIndex = openStates.findIndex(open => open.id === element._id);
      let openValue = openIndex > -1 ? openStates[openIndex].open : false;
      initOpenStates = [...initOpenStates, { id : element._id, open : openValue }];
      return (roomData.length === 0)
    });

    var room_processed = 0;
    roomData.forEach(function(room){
      let selectedIndex = selectedStates.findIndex(open => open.id === room._id);
      let selectedValue = selectedIndex > -1 ? selectedStates[selectedIndex].selected : false;
      initSelectedStates = [...initSelectedStates, { id : room._id, selected : selectedValue}];
      var connectInfo = connectInfoData.filter(info => info.roomId === room._id);
      var unreadState = { id : room._id, messageCount : 0}
      if (connectInfo.length > 0)
      {
        var leaveDate = new Date(connectInfo[0].leaveTime);
        fetchChats(room._id).then((chats) => {
          var result = chats.filter((chat) => {
            let time = new Date(chat.createAt);
            return leaveDate.getTime() < time.getTime();
          });
          unreadState.messageCount = result.length;
          console.log(room._id, 'message count :', unreadState.messageCount);
        }).then(() => {
          initUnreadStates = [...initUnreadStates, unreadState];
          room_processed++;
          if (room_processed === roomData.length) {
            dispatch(initList({ group : initGroups, open : initOpenStates, selected : initSelectedStates, unread : initUnreadStates}));
          }
        })
      }
      else {
        initUnreadStates = [...initUnreadStates, unreadState];
        room_processed++;
        if (room_processed === roomData.length) {
          dispatch(initList({ group : initGroups, open : initOpenStates, selected : initSelectedStates, unread : initUnreadStates}));
        }
      }
    });
  };
  useEffect(()=>{
    updateInitState();
    socket.on('joinRoom', (roomId, name) => {
      updateMessageCount(roomId, true);
    });
    socket.on('pushMessage', (roomId) => {
      updateMessageCount(roomId, false);
    });
  }, []);

  useEffect(()=> {
    updateListState();
  }, [groupData, roomData, connectInfoData])
  //#endregion
  
  const updateConnectionToRoom = (roomId, connecting) => {
    if (connectInfoData.findIndex(info => info.roomId === roomId) !== -1) {
      updateConnectInfo(roomId, userInfo.id, connecting);
    }
    else {
      createConnectInfo(roomId, userInfo.id, connecting);
    }
    fetchInfo(userInfo.id).then((info) =>
    {
      dispatch(setConnectInfo(info));
    });
  }
  const updateMessageCount = (roomId, isRead) => {
    var unreadState = listState.unreadMesssageStates;
    const stateIndex = unreadState.findIndex(state => state.id === roomId);
    if(stateIndex !== -1)
    {
      let copyStates = [...unreadState];
      copyStates[stateIndex] = {...copyStates[stateIndex], messageCount : isRead ? 0 : copyStates[stateIndex].messageCount++};
      console.log(copyStates);
      if (isRead){
        dispatch(readMessage(copyStates));
      }
      else {
        dispatch(pushMessage(copyStates));
      }
    }
  }
  //#region Event handlers
  const clickAddGroup = () => {
    setOpenGroupDialog(true);
  }
  const clickAddRoom = (group_id) => {
    setOpenRoomDialog(true);
    setGroupId(group_id);
  }
  const clickSelectRoom = (room_id) => {
    // 접속 On
    setRoomId(room_id);
    updateConnectionToRoom(room_id, true);
    // 이전에 접속한 방에서 나가기
    if (selectedRoomId !== room_id) {
      socket.emit('leaveRoom', selectedRoomId, userInfo.nickname);
      updateConnectionToRoom(selectedRoomId, false);
    }
  }
  const clickDeleteRoom = (room_id) => {
    setDeleteRoomDialog(true);
    setDeleteRoomId(room_id);
  }
  const newGroup = (name) => {
    createGroup(name).then((group) => {
      console.log('newGroup :', group);
      dispatch(setGroup([...groupData, group]));
    });
  }
  const newRoom = (name) => {
    createRoom(selectedGroupId, name).then((room)=> {
      console.log('newRoom :', room);
      dispatch(setRoom([...roomData, room]));
    })
  }
  const deleteSelectedRoom = () => {
    deleteRoom(deleteRoomId).then((resData) => {
      let copyRooms = [...roomData];
      var index = copyRooms.findIndex(r => r._id === deleteRoomId);
      copyRooms.splice(index, 1);
      setRoom(copyRooms);
      console.log('deleteRoom :', resData);
    });
  }
  const clickLogout = () => {
    dispatch(logout());
    navigate(`/`, {replace : false, state : { user : ''}});
  }
  //#endregion
  return (
    <div className="container">
      <div className="left">
          <div className="left-top">
            <CustomButton type="button btn-2" id="btn-new-group" text={'Add Group'} onClick={clickAddGroup} width={200}/>
            <IconButton id="btn-logout" onClick={clickLogout}>
              <LogoutIcon color="secondary" aria-label="Logout"/>
            </IconButton>
            <FormDialog title={'그룹 추가'} content={'추가할 그룹 명을 입력하세요.'} placeholder={'Group Name'} isOpen={AddGroupOpen} submitValue={newGroup}/>
            <FormDialog title={'방 추가'} content={'추가할 방 명을 입력하세요.'} placeholder={'Room Name'} isOpen={AddRoomOpen} submitValue={newRoom}/>
            <AlertDialog title={'방 추가'} Discription={'선택한 방을 삭제하시겠습니까?'} isOpen={DeleteRoomOpen} visibleCancelButton={true} visibleOKButton={true} okCallback={deleteSelectedRoom}/>
          </div>
          <div className="left-bottom">
            {
              isLoaded ? (<GroupList header={'공고리스트'} add_room_handler={clickAddRoom} select_room_handler={clickSelectRoom} delete_room_handler={clickDeleteRoom}/>) :
              null
            }
          </div>
      </div>
      <div className="right">
          <TalkControl roomId={selectedRoomId} updateBadge={updateMessageCount}/>
      </div>
    </div>
  );
  }
  
  export default Main;