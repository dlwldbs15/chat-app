import * as React from 'react';
import {ListSubheader, List, ListItemButton, ListItemIcon, ListItemText, Collapse} from '@mui/material';
import {ExpandLess, ExpandMore } from '@mui/icons-material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function NestedList({header, group_data, room_data, add_room_handler, select_room_handler, delete_room_handler}) {
  const [openStates, setOpen] = React.useState([]);
  const [selectedStates, setSelectedStates] = React.useState([]);
  const [group, setGroup] = React.useState([]);

  //초기 그룹/방목록 가져오기
  React.useEffect(() => {
    var initGroups = [];
    var initOpenStates = [];
    var initSelectedStates = [];
    group_data.some(function(element){
      let rooms = room_data.filter(room => room.groupId === element._id).map(room => {return([room._id, room.title])});
      let group = [element.title, element._id, rooms]
      initGroups = [...initGroups, group];
      initOpenStates = [...initOpenStates, { id : element._id, open : false }];
      return (room_data.length === 0)
    });

    room_data.forEach(function(room){
      initSelectedStates = [...initSelectedStates, { id : room._id, selected : false}];
    });

    setSelectedStates(initSelectedStates);
    setGroup(initGroups);
    setOpen(initOpenStates);
  },[group_data, room_data]);

  const handleClick = (e, key) => {
    const index = openStates.findIndex(open => open.id === key);
    let copyStates = [...openStates];
    if(index !== -1) {
      copyStates[index] = {...copyStates[index], open: !openStates[index].open};
    }
    setOpen(copyStates);
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
    setSelectedStates(copyStates);
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
  const groupList = group.map((item, index) => (
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