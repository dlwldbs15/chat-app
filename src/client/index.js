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

export async function login(nickname) {
    let success = false;
        try {
            await axios.get(`${base_url}/api/user`)
            .then((res)=>{
                //모든 유저 가져와서 닉네임 비교
                var find = false;
                if (res.data) {
                    res.data.forEach(element => {
                        if (element.nickname === nickname) find = true;                    
                    });
                } 
                if (!find)
                //없을 경우 전송 시도
                    try {
                        let data = {
                            'nickname' : nickname
                        }
                        axios.post(`${base_url}/api/user`, JSON.stringify(data),{
                          headers: { "Content-Type": `application/json`},
                        }).then((res) => {
                          console.log('User 생성 :', res.data);
                          success = true;
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    } catch (e) { 
                        console.log(e);
                    }
                else {
                    success = true;
                }
            });
        } catch (err) {
            console.log(err);
        };
    return success
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

