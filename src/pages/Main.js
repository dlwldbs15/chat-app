import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchGroups, fetchRooms, createGroup, createRoom, deleteRoom } from '../client';
import { socket, initSocketConnection } from '../client/socketio';

import '../css/styles.css';
import '../css/main-styles.css';
import FormDialog from '../components/formDialog';
import GroupList from '../components/groupList';
import CustomButton from '../components/button';
import AlertDialog from '../components/alertDialog';
import TalkControl from '../components/talkControl';

function Main (){
  var location = useLocation();
  //#region States
  const [groups, setGroup] = useState([]);
  const [rooms, setRoom] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [AddGroupOpen, setOpenGroupDialog] = useState(false);
  const [AddRoomOpen, setOpenRoomDialog] = useState(false);
  const [DeleteRoomOpen, setDeleteRoomDialog] = useState(false);
  const [selectedGroupId, setGroupId] = useState();
  const [selectedRoomId, setRoomId] = useState();
  const [deleteRoomId, setDeleteRoomId] = useState();
  const [user, setUser] = useState(location.state.user);
  //#endregion
  
  //#region 초기 값 가져오기
  const updateInitState = () => {
    fetchGroups().then((groupData) => {
      console.log('group data in', groupData);
      setGroup(groupData);
      fetchRooms().then((roomData) => {
        console.log('room data in', roomData);
        setRoom(roomData);
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
    createGroup(name).then((groupData) => {
      console.log('newGroup :', groupData);
      setGroup([...groups, groupData]);
    });
  }
  const newRoom = (name) => {
    createRoom(selectedGroupId, name).then((roomData)=> {
      console.log('newRoom :', roomData);
      setRoom([...rooms, roomData]);
    })
  }
  const deleteSelectedRoom = () => {
    deleteRoom(deleteRoomId).then((resData) => {
      let copyRooms = [...rooms];
      var index = copyRooms.findIndex(r => r._id === deleteRoomId);
      copyRooms.splice(index, 1);
      setRoom(copyRooms);
      console.log('deleteRoom :', resData);
    });
  }
  //#endregion
  return (
    <div className="container">
      <div className="left">
          <div className="left-top">
            <CustomButton type="button btn-2" id="btn-new-group" text={'Add Group'} onClick={clickAddGroup} width={200}/>
            <FormDialog title={'그룹 추가'} content={'추가할 그룹 명을 입력하세요.'} placeholder={'Group Name'} isOpen={AddGroupOpen} submitValue={newGroup}/>
            <FormDialog title={'방 추가'} content={'추가할 방 명을 입력하세요.'} placeholder={'Room Name'} isOpen={AddRoomOpen} submitValue={newRoom}/>
            <AlertDialog title={'방 추가'} Discription={'선택한 방을 삭제하시겠습니까?'} isOpen={DeleteRoomOpen} okCallback={deleteSelectedRoom}/>
          </div>
          <div className="left-bottom">
            {
              isLoaded ? (<GroupList header={'공고리스트'} group_data={groups} room_data={rooms} add_room_handler={clickAddRoom} select_room_handler={clickSelectRoom} delete_room_handler={clickDeleteRoom}/>) :
              null
            }
          </div>
      </div>
      <div className="right">
          <TalkControl roomId={selectedRoomId} currnetUser={user}/>
      </div>
    </div>
  );
  }
  
  export default Main;