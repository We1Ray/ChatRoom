import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { Collapse } from "reactstrap";
import { Chat, groupMember } from "../../components/Chatroom";
import {
  None,
  ProgramProvider,
  SystemContext,
  ComponentProvider,
  CallApi,
  Column,
  Row,
  SystemFunc,
  Form,
  BtnCreate,
  BtnQuery,
  ProgramContext,
} from "../../resource/index";
import "ds-widget/dist/index.css";
import {
  userProps,
  roomProps,
} from "../../components/Chatroom/components/Chat/Chat";
import moment, { now } from "moment";
import "./chat.css";
import Member_select_dialog from "./member_select_dialog";
import Member_group_select_dialog from "./member_group_select_dialog";
import Room from "./room";

let socket = null;

interface roomList {
  room_member: string;
  room_id: string;
  room_name: string;
  create_date: string;
  create_d: string;
  create_hm: string;
  is_group: string;
  create_user: string;
  not_read_message_count: string;
  last_sender: string;
  message_id: string;
  last_message: string;
  last_date: string;
  last_d: string;
  last_hm: string;
}

export type { roomList };

export default function ChatRoom() {
  return (
    <ComponentProvider>
      <ProgramProvider>
        <ChatRoom_Content />
      </ProgramProvider>
    </ComponentProvider>
  );
}

function ChatRoom_Content() {
  const { System } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);
  const [user, setUser] = useState<userProps>(null);
  const [room, setRoom] = useState<roomProps>(null);
  const [roomKey, setRoomKey] = useState("");
  const [roomList, setRoomList] = useState<roomList[]>([]);
  const [newMessage, setNewMessage] = useState(null);
  const [addGroupChatRoomOn, setAddGroupChatRoomOn] = useState(false);
  const [addChatRoomOn, setAddChatRoomOn] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [selectMembers, setSelectMembers] = useState<groupMember[]>([]);

  /**
   * 取得使用者資訊
   */
  useEffect(() => {
    if (System.factory) {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/get_userInfo",
        {
          access_token: System.token,
        }
      )
        .then((res) => {
          if (res ? res.status === 200 : false) {
            setUser(res.data[0]);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_userInfo");
          console.log(error);
        });

      socket = io(System.factory.ip);
    }
  }, [JSON.stringify(System.factory)]);

  /**
   * 取得使用者聊天室列表
   */
  useEffect(() => {
    if (user) {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/get_roomList_info",
        {
          account_uid: user.account_uid,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setRoomList(res.data);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_roomList_info");
          console.log(error);
        });

      socket.emit(
        "join",
        {
          room: {
            room_name: "public",
            room_id: "public",
            is_group: "Y",
          },
          userInfo: user,
        },
        (error: any) => {
          if (error) {
            alert(error);
          }
        }
      );
    } else {
      setRoomList([]);
    }
  }, [JSON.stringify(user)]);

  /**
   * 聊天室新訊息
   */
  useEffect(() => {
    if (roomList.length > 0) {
      socket.on("message", ({ sendMessage }) => {
        setNewMessage(sendMessage);
      });
    } else {
      setNewMessage(null);
    }
  }, [JSON.stringify(roomList), JSON.stringify(room)]);

  function notInRoomUpdateMessageCount(originalRoom: roomList) {
    let messageRoom = originalRoom;
    messageRoom.last_message = newMessage.message_content;
    messageRoom.not_read_message_count = (
      parseInt(originalRoom.not_read_message_count) + 1
    ).toString();
    messageRoom.last_d = newMessage.d;
    messageRoom.last_hm = newMessage.hm;
    messageRoom.last_sender = newMessage.send_member_name;

    let newRoomlist = roomList.filter(
      (item) => item.room_id !== newMessage.room_id
    );
    newRoomlist.unshift(messageRoom);
    setRoomList(newRoomlist);
  }

  function inRoomUpdateMessageCount(originalRoom: roomProps) {
    let newRoomList = roomList;
    let index = roomList.findIndex(
      (value) => value.room_id === originalRoom.room_id
    );
    if (index > -1) {
      let messageRoom = newRoomList[index];
      messageRoom.not_read_message_count = (0).toString();

      newRoomList[index] = messageRoom;
      setRoomList(newRoomList);
    }
  }

  /**
   * 更新聊天室列表資訊
   */
  useEffect(() => {
    if (newMessage) {
      let originalRoom = roomList.find(
        (data) => data.room_id === newMessage.room_id
      );
      if (originalRoom) {
        if (room) {
          if (room.room_id === newMessage.room_id) {
            let messageRoom = originalRoom;
            messageRoom.last_message = newMessage.message_content;
            messageRoom.not_read_message_count = (0).toString();
            messageRoom.last_d = newMessage.d;
            messageRoom.last_hm = newMessage.hm;
            messageRoom.last_sender = newMessage.send_member_name;

            let newRoomlist = roomList.filter(
              (item) => item.room_id !== newMessage.room_id
            );
            newRoomlist.unshift(messageRoom);
            setRoomList(newRoomlist);
          } else {
            notInRoomUpdateMessageCount(originalRoom);
          }
        } else {
          notInRoomUpdateMessageCount(originalRoom);
        }
      } else {
        //新創的聊天室訊息
      }
    }
  }, [JSON.stringify(newMessage)]);

  /**
   * 更新Key重置ChatRoom
   */
  useEffect(() => {
    if (room) {
      setRoomKey(SystemFunc.uuid());
      inRoomUpdateMessageCount(room);
    } else {
      setRoomKey("");
    }
  }, [JSON.stringify(room)]);

  async function createRoom() {
    let flag = false;
    if (addChatRoomOn) {
      let room_id = "chat-" + SystemFunc.uuid();
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/create_room",
        {
          room_member:
            user.account_uid + ";" + Program.insertParameters["member"],
          room_id: room_id,
          room_name: null,
          is_group: "N",
          create_user: user.account_uid,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setRoomList((prev) => [
              {
                room_member:
                  user.account_uid + ";" + Program.insertParameters["member"],
                room_id: room_id,
                room_name: memberName,
                create_date: now().toString(),
                create_d: moment(now()).toDate().toISOString(),
                create_hm: moment(now()).toDate().getTime().toString(),
                is_group: "N",
                create_user: user.account_uid,
                not_read_message_count: "0",
                last_sender: null,
                message_id: null,
                last_message: null,
                last_date: null,
                last_d: null,
                last_hm: null,
              },
              ...prev,
            ]);
            flag = true;
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/create_room");
          console.log(error);
        });
    }
    setAddChatRoomOn(false);
    return flag;
  }

  async function createGroupRoom() {
    let flag = false;
    let room_member = user.account_uid;
    for (let index = 0; index < selectMembers.length; index++) {
      room_member = room_member + ";" + selectMembers[index].account_uid;
    }
    if (addGroupChatRoomOn) {
      let room_id = "chat-" + SystemFunc.uuid();
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/create_room",
        {
          room_member: room_member,
          room_id: room_id,
          room_name: Program.insertParameters["group_name"],
          is_group: "Y",
          create_user: user.account_uid,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setRoomList((prev) => [
              {
                room_member: room_member,
                room_id: room_id,
                room_name: Program.insertParameters["group_name"],
                create_date: now().toString(),
                create_d: moment(now()).toDate().toISOString(),
                create_hm: moment(now()).toDate().getTime().toString(),
                is_group: "Y",
                create_user: user.account_uid,
                not_read_message_count: "0",
                last_sender: null,
                message_id: null,
                last_message: null,
                last_date: null,
                last_d: null,
                last_hm: null,
              },
              ...prev,
            ]);
            flag = true;
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/create_room");
          console.log(error);
        });
    }
    setAddGroupChatRoomOn(false);
    return flag;
  }

  function updateGroupRoomInfo(newGroupMember: roomProps) {
    setRoom(newGroupMember);
    setRoomList((prev) => {
      let index = prev.findIndex(
        (value) => value.room_id === newGroupMember.room_id
      );
      prev[index].room_name = newGroupMember.room_name;
      prev[index].room_member = newGroupMember.room_member;
      return prev;
    });
    setRoomKey(SystemFunc.uuid());
  }

  return (
    <Form program_code="chat" dataKey={["room_id"]} style={{ height: "800px" }}>
      <BtnQuery
        queryApi={""}
        doQuery={async () => []}
        style={{ display: "none" }}
      />
      <div className="content-wrapper">
        <Member_select_dialog
          user={user}
          dialogOn={addChatRoomOn}
          setDialogOn={setAddChatRoomOn}
          setMemberName={setMemberName}
        />
        <Member_group_select_dialog
          dialogOn={addGroupChatRoomOn}
          setDialogOn={setAddGroupChatRoomOn}
          user={user}
          setSelectMembers={setSelectMembers}
        />
        <Row>
          <Column md={3}>
            <Collapse
              className="MessageRoomListBox"
              // className="mb-boxes"
              isOpen={true}
            >
              <div className="card card-default">
                <div className="card-body">
                  <ul className="nav nav-pills flex-column">
                    <li className="nav-item p-2">
                      <h3 className="text-muted">
                        <i className="fas fa-comments" />
                        &ensp;聊天室
                        <BtnCreate
                          doCreate={createGroupRoom}
                          onClick={async () => setAddGroupChatRoomOn(true)}
                          style={{
                            float: "right",
                            backgroundColor: "white",
                            border: "0",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="新增群組"
                          childObject={
                            <h4
                              className="fas fa-user-friends"
                              style={{
                                color: "#a7a7a7",
                              }}
                            />
                          }
                        />
                        <BtnCreate
                          doCreate={createRoom}
                          onClick={async () => {
                            setAddChatRoomOn(true);
                          }}
                          style={{
                            float: "right",
                            backgroundColor: "white",
                            border: "0",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="新增聊天"
                          childObject={
                            <h4
                              className="fas fa-user-plus"
                              style={{
                                color: "#a7a7a7",
                              }}
                            />
                          }
                        />
                      </h3>
                    </li>
                    <Room roomList={roomList} setRoom={setRoom} room={room} />
                  </ul>
                </div>
              </div>
            </Collapse>
          </Column>
          <Column md={9}>
            {roomKey !== "" ? (
              <div style={{ height: "800px", padding: "10px" }} key={roomKey}>
                <Chat
                  user={user}
                  room={room}
                  updateGroupRoomInfo={updateGroupRoomInfo}
                />
              </div>
            ) : (
              <None />
            )}
          </Column>
        </Row>
      </div>
    </Form>
  );
}
