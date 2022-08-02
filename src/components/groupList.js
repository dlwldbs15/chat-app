import React, {useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { openGroup, selectRoom, initList } from "../redux/action";

import {ListSubheader, List, ListItemButton, ListItemIcon, ListItemText, Collapse} from '@mui/material';
import {ExpandLess, ExpandMore } from '@mui/icons-material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function GroupList({header, add_room_handler, select_room_handler, delete_room_handler}) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.chatReducer);
  const openStates = state.ListState.groupOpenStates;
  const selectedStates = state.ListState.roomSelectedStates;
  const groupStates = state.ListState.groupStates;
  const unreadStates = state.ListState.unreadMesssageStates;
  const groupData = state.Data.groupData;
  const roomData = state.Data.roomData;

  //초기 그룹/방목록 가져오기
  React.useEffect(() => {
    var initGroups = [];
    var initOpenStates = [];
    var initSelectedStates = [];
    var initUnreadStates = [];
    groupData.some(function(element){
      let rooms = roomData.filter(room => room.groupId === element._id).map(room => {return([room._id, room.title])});
      let group = [element.title, element._id, rooms]
      initGroups = [...initGroups, group];
      let openIndex = openStates.findIndex(open => open.id === element._id);
      let openValue = openIndex > -1 ? openStates[openIndex].open : false;
      initOpenStates = [...initOpenStates, { id : element._id, open : openValue }];
      return (roomData.length === 0)
    });

    roomData.forEach(function(room){
      let selectedIndex = selectedStates.findIndex(open => open.id === room._id);
      let selectedValue = selectedIndex > -1 ? openStates[selectedIndex].open : false;
      initSelectedStates = [...initSelectedStates, { id : room._id, selected : selectedValue}];
      initUnreadStates = [...initUnreadStates, { id : room._id, messageCount : 0}];
    });
    dispatch(initList({ group : initGroups, open : initOpenStates, selected : initSelectedStates, unread : initUnreadStates}));
  },[groupData, roomData]);

  const handleClick = (e, key) => {
    const index = openStates.findIndex(open => open.id === key);
    let copyStates = [...openStates];
    if(index !== -1) {
      copyStates[index] = {...copyStates[index], open: !openStates[index].open};
    }
    dispatch(openGroup(copyStates));
  };

  const addRoomClick = (e, group_id) => {
    e.stopPropagation();
    add_room_handler(group_id);
  };

  const selectRoomClick = (e, room_id) => {
    select_room_handler(room_id);
    const prevIndex = selectedStates.findIndex(room => room.selected === true);
    const curIndex = selectedStates.findIndex(room => room.id === room_id);

    let copyStates = [...selectedStates];
    if(prevIndex !== -1)
      copyStates[prevIndex] = {...copyStates[prevIndex], selected : !selectedStates[prevIndex].selected};
    if(curIndex !== -1)
      copyStates[curIndex] = {...copyStates[curIndex], selected : !selectedStates[curIndex].selected};
    dispatch(selectRoom(copyStates));
  }

  const deleteRoomClick = (e, room_id) => {
    e.stopPropagation();
    delete_room_handler(room_id);
  }
  const roomList = (rooms) => {
    return rooms.map((item) => (
      <ListItemButton key={item[0]} onClick={(e) => selectRoomClick(e, item[0])} sx={{ pl: 4}} selected={selectedStates[selectedStates.findIndex(room => room.id === item[0])].selected}>
      <ListItemIcon onClick={(e) => deleteRoomClick(e, item[0])}>
        <RemoveCircleIcon/>
      </ListItemIcon>
      <ListItemText primary={item[1]} />
      </ListItemButton>
    ));
  }
  const groupList = groupStates.map((item, index) => (
    <div>
      <ListItemButton key={item[1]} onClick={(e) => handleClick(e, item[1])}>
      <ListItemIcon onClick={(e) => addRoomClick(e, item[1])}>
        <AddBoxIcon />
      </ListItemIcon>
      <ListItemText primary={item[0]} />
      <React.Fragment>
      {
        (item[2].length > 0 ? (openStates[openStates.findIndex(open => open.id === item[1])].open ? <ExpandLess /> : <ExpandMore />) : null)
      }
      </React.Fragment>
      </ListItemButton>
      <React.Fragment>
      {item[2].length > 0 ? 
        <Collapse in={openStates[openStates.findIndex(open => open.id === item[1])].open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {roomList(item[2])}
        </List>
        </Collapse> : null
      }
      </React.Fragment>
    </div>
  ));

  return (
    <List
      sx={{ width: '100%', height:'100%', maxWidth: 460, bgcolor: 'rgb(250, 250, 250)' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" sx={{bgcolor: 'rgb(250, 250, 250)' }}>
          {header}
        </ListSubheader>
      }
    >
    {groupList}
    </List>
  );
};