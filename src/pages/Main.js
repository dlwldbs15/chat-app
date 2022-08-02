import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups, fetchRooms, createGroup, createRoom, deleteRoom } from '../client';
import { socket, initSocketConnection } from '../client/socketio';
import { logout, setGroup, setRoom } from "../redux/action";

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
  const user = useSelector((state) => state.userReducer.user);
  const groupData = useSelector((state) => state.chatReducer.Data.groupData);
  const roomData = useSelector((state) => state.chatReducer.Data.roomData);
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
    fetchGroups().then((groupData) => {
      dispatch(setGroup(groupData));
      fetchRooms().then((roomData) => {
        dispatch(setRoom(roomData));
        setLoaded(roomData !== undefined)
        if (roomData !== undefined) {
          initSocketConnection();
        }
      })
    });
  }  
  useEffect(()=>{
    updateInitState();
  }, []);
  //#endregion
  
  //#region Event handlers
  const clickAddGroup = () => {
    setOpenGroupDialog(true);
  }
  const clickAddRoom = (group_id) => {
    setOpenRoomDialog(true);
    setGroupId(group_id);
  }
  const clickSelectRoom = (room_id) => {
    setRoomId(room_id);
    // 이전에 접속한 방에서 나가기
    if (selectedRoomId !== room_id) {
      socket.emit('leaveRoom', selectedRoomId, user);
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
          <TalkControl roomId={selectedRoomId}/>
      </div>
    </div>
  );
  }
  
  export default Main;