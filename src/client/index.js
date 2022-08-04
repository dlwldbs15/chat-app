import axios from 'axios';
const base_url = 'http://localhost:8080';

export async function fetchGroups() {
    try {
        var res = await axios.get(`${base_url}/api/group`);
        console.log('Fetch Groups :', res.data);    
        return res.data;
    } catch (err) { console.log(err); }
}

export async function fetchRooms() {
    try {
        var res = await axios.get(`${base_url}/api/room`);
        console.log('Fetch Rooms :', res.data);
        return res.data;
    } catch (err) { console.log(err); }
}

export async function fetchChats(room_id){
    try {
        var res = await axios.get(`${base_url}/api/chat/${room_id}`);
        console.log('Fetch Chats :', res.data);
        return res.data;
    } catch (err) { console.log(err); }
}

export async function fetchInfo(user_id) {
    try {
        var res = await axios.get(`${base_url}/api/connectInfo/${user_id}`);
        console.log('Fetch Info :', res.data);    
        return res.data;
    } catch (err) { console.log(err); }
}

export async function fetchUsers() {
    try {
        var res = await axios.get(`${base_url}/api/user`);
        console.log('Fetch User :', res.data);
        return res.data;
    } catch (e) { console.log(e); }
}
export async function createUser(nickname) {
    try {
        let data = {
            'nickname' : nickname
        }
        var res = await axios.post(`${base_url}/api/user`, JSON.stringify(data),{
          headers: { "Content-Type": `application/json`},
        });
        console.log('User 생성 :', res.data);
        return res.data;
    } catch (e) { 
        console.log(e);
    }
}

export async function createGroup (group_name) {
    try {
        let data = {
            'title' : group_name
        }
        var res = await axios.post(`${base_url}/api/group`, JSON.stringify(data),{
          headers: { "Content-Type": `application/json`},
        });
        console.log('그룹 생성 :', res.data);
        return res.data;
    } catch (e) { 
        console.log(e);
    }
}

export async function createRoom(group_id, room_name) {
  try {
      let data = {
          'groupId' : group_id,
          'title' : room_name
      }
      var res = await axios.post(`${base_url}/api/room`, JSON.stringify(data),{
        headers: { "Content-Type": `application/json`},
      });
      console.log('방 생성 :', res.data);
      return res.data;
  } catch (e) { 
      console.log(e);
  }
}

export async function createChat(room_id, user_name, msg){
    try {
        let data = {
            'roomId' : room_id,
            'userName' : user_name,
            'message' : msg
        }
        var res = await axios.post(`${base_url}/api/chat`, JSON.stringify(data),{
          headers: { "Content-Type": `application/json`},
        });
        console.log('Chat 생성 :', res.data);
        return res.data;
    } catch (e) { 
        console.log(e);
    }
}

export async function deleteRoom(room_id) {
    try {
        var res = await axios.delete(`${base_url}/api/room/${room_id}`);
        console.log('방 삭제 :', res.data);
        return res.data;
    } catch (e) { 
        console.log(e);
    }
}

export async function createConnectInfo(room_id, user_id, connecting) {
    try {
        let data = {
            'roomId' : room_id,
            'userId' : user_id,
            'connecting' : connecting
        }
        var res = await axios.post(`${base_url}/api/connectInfo`, JSON.stringify(data),{
            headers: { "Content-Type": `application/json`},
          });
          console.log('ConnectInfo 생성 :', res.data);
          return res.data;
    } catch (e) { 
        console.log(e);
    }
}

export async function deleteConnectInfo(room_id, user_id) {
    try {
        var res = await axios.delete(`${base_url}/api/connectInfo?userId=${user_id}&roomId=${room_id}`);
          console.log('ConnectInfo 삭제 :', res.data);
          return res.data;
    } catch (e) { 
        console.log(e);
    }
}

export async function updateConnectInfo(room_id, user_id, connecting) {
    try {
        let data = {
            'leaveTime' : new Date(),
            'connecting' : connecting
        }
        var res = await axios.put(`${base_url}/api/connectInfo?userId=${user_id}&roomId=${room_id}`, JSON.stringify(data),{
            headers: { "Content-Type": `application/json`},
          });
          console.log('ConnectInfo 업데이트 :', res.data);
          return res.data;
    } catch (e) { 
        console.log(e);
    }
}


