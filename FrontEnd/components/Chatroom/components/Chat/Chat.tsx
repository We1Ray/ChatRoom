import React, { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";
import Input from "../Input/Input";
import InfoBar from "../InfoBar/InfoBar";
import Message from "../Message/Message";

import {
  CallApi,
  None,
  System,
  SystemContext,
  SystemFunc,
  useLatest,
} from "../../../../resource/index";
import "./Chat.css";
import "loaders.css/loaders.css";
import "spinkit/css/spinkit.css";

let socket = null;

interface ChatProps {
  room: roomProps;
  user: userProps;
}
interface roomProps {
  room_name: string;
  room_id: string;
  is_group: string;
  room_member: string;
}

interface messageProps {
  d: string;
  hm: string;
  isread: string;
  message_id: string;
  message_content: string;
  message_seq?: number;
  message_type: string;
  room_id: string;
  file_id: string;
  send_member: string;
  send_member_name: string;
}

interface userProps {
  account: string;
  account_uid: string;
  email: string;
  name: string;
}

interface usersProps {
  id: string;
  info: userProps;
  room: roomProps;
}

interface fileMessageProps {
  file_id: string;
  name: string;
  path: string;
  url: string;
  type: string;
  size: number;
}

const DateMessage = ({ date }) => (
  <p
    style={{
      color: "darkgray",
      width: "100%",
      letterSpacing: "0",
      float: "inherit",
      fontSize: "1.1em",
      wordWrap: "break-word",
      textAlign: "center",
    }}
  >
    {date}
  </p>
);

const Chat: React.FC<ChatProps> = ({ room, user }) => {
  const { System } = useContext(SystemContext);
  const [init, setInit] = useState(false); /** 是否初始化 */
  const [users, setUsers] = useState<usersProps[]>(
    []
  ); /** 目前聊天室內的人員 */
  const [pastScroll, setPastScroll] =
    useState(0); /** 延展scrollbar前 scrollbar的位置 */
  const [extendScrollbar, setExtendScrollbar] =
    useState(false); /** 判斷延展scrollbar*/
  const [scrollTop, setScrollTop] =
    useState(null); /** 是否滑到scrollbar 頂部 */
  const [isScrollingBottom, setIsScrollingBottom] =
    useState(true); /** 是否滑到srollbar底部 */
  const [messages, setMessages] = useState<messageProps[]>(
    []
  ); /** 目前抓取的所有訊息 */
  const [needGetMoreMsg, setNeedGetMoreMsg] =
    useState(false); /** 是否要抓取新訊息 */
  const [newMsg, setNewMsg] = useState<messageProps>(null); /** 新訊息 */
  const [notReadMsg, setNotReadMsg] =
    useState<messageProps>(null); /** 未讀訊息 */
  const [message, setMessage] = useState(""); /** 目前打字的訊息 */
  const [searchedValue, setSearchedValue] =
    useState(""); /** 目前查詢的關鍵字 */
  const [searchedMessage, setSearchedMessage] =
    useState<messageProps>(null); /** 目前查詢指定的訊息 */
  const [searchedMessagesList, setSearchedMessagesList] =
    useState<messageProps[]>(null); /** 目前查詢指定的訊息列表 */

  const [messageLoading, setMessageLoading] =
    useState(false); /** 是否要抓取新訊息 */
  const scrollRef = useRef<any>(null);

  /**
   *  初始取得聊天紀錄
   */
  useEffect(() => {
    socket = io(System.factory.ip);
    socket.emit("join", { room: room, userInfo: user }, (error: any) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [System.factory.ip]);

  /**
   *  初始取得聊天紀錄
   */
  useEffect(() => {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/chat/get_room_current_messages",
      {
        room_id: room.room_id,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          setMessages(res.data);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_room_current_messages");
        console.log(error);
      });

    setInit(true);
  }, [JSON.stringify(room)]);

  /**
   * 設定初始置底、自己發訊息也置底
   */
  useEffect(() => {
    if (newMsg) {
      if (newMsg.send_member === user.account_uid) {
        if (scrollRef.current.clientHeight < scrollRef.current.scrollHeight) {
          setNewMsg(null);
          scrollToBottom();
        }
      } else {
        if (!isScrollingBottom) {
          setNewMsg(null);
          setNotReadMsg(null);
          scrollToBottom();
        } else {
          if (scrollRef.current.clientHeight < scrollRef.current.scrollHeight) {
            setNotReadMsg(newMsg);
          }
        }
      }
    }
  }, [JSON.stringify(messages), JSON.stringify(newMsg), isScrollingBottom]);

  /**
   * 設定訊息置底
   */
  function scrollToBottom() {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }

  /**
   * 增加Srollbar 長度 回復原scrollbar位置
   */
  useEffect(() => {
    if (isScrollingBottom && extendScrollbar) {
      const currentScroll = scrollRef.current.scrollHeight - pastScroll;
      scrollRef.current.scrollTo(0, currentScroll);
      setExtendScrollbar(false);
    }
  }, [JSON.stringify(messages), extendScrollbar]);

  /**
   * 判斷聊天室scrollbar是否滑動和判斷scrollbar置底
   */
  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.scrollTop);

      if (e.target.scrollTop == 0) {
        setNeedGetMoreMsg(true);
        setMessageLoading(true);
        setPastScroll(e.target.scrollHeight);
      }

      if (
        e.target.scrollHeight - e.target.scrollTop ===
        e.target.offsetHeight
      ) {
        setIsScrollingBottom(false);
      } else {
        setIsScrollingBottom(true);
      }
    };
    scrollRef.current.addEventListener("scroll", onScroll);

    return () =>
      scrollRef.current
        ? scrollRef.current.removeEventListener("scroll", onScroll)
        : null;
  }, [scrollTop]);

  /**
   * 聊天室新訊息更新
   */
  useEffect(() => {
    socket.on("message", ({ sendMessage, userInfo, socket_user }) => {
      if (
        !(
          user.account_uid === userInfo.account_uid &&
          socket.id === socket_user &&
          sendMessage.room_id === room.room_id
        )
      ) {
        CallApi.ExecuteApi(
          System.factory.name,
          System.factory.ip + "/chat/update_message_read",
          {
            room_id: room.room_id,
            account_uid: user.account_uid,
          }
        )
          .then((res) => {
            if (res.status !== 200) {
              console.log(res);
            }
          })
          .catch((error) => {
            console.log("EROOR: Chat: /chat/update_message_read");
            console.log(error);
          });
        let today = new Date();
        let msg = {
          d:
            today.getFullYear() +
            "/" +
            (today.getMonth() + 1 < 10
              ? "0" + (today.getMonth() + 1)
              : today.getMonth() + 1) +
            "/" +
            (today.getDate() < 10 ? "0" + today.getDate() : today.getDate()),
          hm:
            (today.getHours() < 10
              ? "0" + today.getHours()
              : today.getHours()) +
            ":" +
            (today.getMinutes() < 10
              ? "0" + today.getMinutes()
              : today.getMinutes()),
          isread: "0",
          message_id: sendMessage.message_id,
          message_type: sendMessage.message_type,
          message_content: sendMessage.message_content,
          room_id: room.room_id,
          file_id: sendMessage.file_id,
          send_member: userInfo.account_uid,
          send_member_name: userInfo.name,
        };
        setMessages((prev) => [...prev, ...[msg]]);
        setNewMsg(msg);
      }
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [JSON.stringify(user)]);

  /**
   * 更新訊息已讀狀態
   */
  useEffect(() => {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/chat/update_message_read",
      {
        room_id: room.room_id,
        account_uid: user.account_uid,
      }
    )
      .then((res) => {
        if (res.status !== 200) {
          console.log(res);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/update_message_read");
        console.log(error);
      });
  }, [JSON.stringify(users)]);

  /**
   * 獲得更多聊天紀錄
   */
  function get_room_scroll_up_messages() {
    if (messages.length > 0) {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/get_room_scroll_up_messages",
        {
          room_id: room.room_id,
          message_id: messages[0].message_id,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setMessages((prev) => [...res.data, ...prev]);
            setExtendScrollbar(true);
            setNeedGetMoreMsg(false);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_scroll_up_messages");
          console.log(error);
        })
        .finally(() => setMessageLoading(false));
    } else {
      setMessageLoading(false);
    }
  }
  /**
   * 往上滾抓取以前的訊息
   */
  useEffect(() => {
    if (needGetMoreMsg) {
      get_room_scroll_up_messages();
    }
  }, [needGetMoreMsg]);

  useLatest(
    (latest) => {
      /**
       * 設定messages為查詢指定的訊息
       */
      async function get_room_keyword_seq_messages() {
        await CallApi.ExecuteApi(
          System.factory.name,
          System.factory.ip + "/chat/get_room_keyword_seq_messages",
          {
            room_id: room.room_id,
            message_id: searchedMessage.message_id,
            current_firsy_message_id: messages[0].message_id,
          }
        )
          .then((res) => {
            if (res.status === 200 && latest()) {
              setMessages((prev) => [...res.data, ...prev]);
            }
          })
          .catch((error) => {
            console.log("EROOR: Chat: /chat/get_room_keyword_seq_messages");
            console.log(error);
          })
          .finally(() => setMessageLoading(false));
      }
      if (searchedMessage) {
        if (
          !messages.find(
            (element) => element.message_id === searchedMessage.message_id
          )
        ) {
          get_room_keyword_seq_messages();
        } else {
          setMessageLoading(false);
        }
      } else {
        setMessageLoading(false);
      }
    },
    [JSON.stringify(searchedMessage)]
  );

  /**
   * 發送訊息
   */
  const sendMessage = (event?: { preventDefault: () => void }) => {
    if (event.preventDefault) event.preventDefault();

    if (message) {
      let message_id = "Msg-" + SystemFunc.uuid();
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/insert_room_message",
        {
          room_id: room.room_id,
          message_id: message_id,
          message_type: "string",
          message_content: message,
          send_member: user.account_uid,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            let today = new Date();
            let send_msg = {
              d:
                today.getFullYear() +
                "/" +
                (today.getMonth() + 1 < 10
                  ? "0" + (today.getMonth() + 1)
                  : today.getMonth() + 1) +
                "/" +
                (today.getDate() < 10
                  ? "0" + today.getDate()
                  : today.getDate()),
              hm:
                (today.getHours() < 10
                  ? "0" + today.getHours()
                  : today.getHours()) +
                ":" +
                (today.getMinutes() < 10
                  ? "0" + today.getMinutes()
                  : today.getMinutes()),
              isread: "0",
              message_id: message_id,
              message_type: "string",
              message_content: message,
              room_id: room.room_id,
              file_id: null,
              send_member: user.account_uid,
              send_member_name: user.name,
            };

            socket.emit(
              "sendMessage",
              { room: room, message: send_msg, userInfo: user },
              () => {
                setMessage("");
                setMessages((prev) => [...prev, ...[send_msg]]);
                setNewMsg(send_msg);
              }
            );
          } else {
            console.log(res);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/insert_room_message");
          console.log(error);
        });
    }
  };

  const sendFileMessage = async (fileMessage: fileMessageProps) => {
    if (sendFileMessage) {
      let message_id = "Msg-" + SystemFunc.uuid();
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/insert_room_message",
        {
          room_id: room.room_id,
          message_id: message_id,
          message_type: fileMessage.type,
          message_content: fileMessage.name,
          send_member: user.account_uid,
          file_id: fileMessage.file_id,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            let today = new Date();
            let send_msg = {
              d:
                today.getFullYear() +
                "/" +
                (today.getMonth() + 1 < 10
                  ? "0" + (today.getMonth() + 1)
                  : today.getMonth() + 1) +
                "/" +
                (today.getDate() < 10
                  ? "0" + today.getDate()
                  : today.getDate()),
              hm:
                (today.getHours() < 10
                  ? "0" + today.getHours()
                  : today.getHours()) +
                ":" +
                (today.getMinutes() < 10
                  ? "0" + today.getMinutes()
                  : today.getMinutes()),
              isread: "0",
              message_id: message_id,
              message_type: fileMessage.type,
              message_content: fileMessage.name,
              room_id: room.room_id,
              file_id: fileMessage.file_id,
              send_member: user.account_uid,
              send_member_name: user.name,
            };

            socket.emit(
              "sendMessage",
              { room: room, message: send_msg, userInfo: user },
              () => {
                setMessages((prev) => [...prev, ...[send_msg]]);
                setNewMsg(send_msg);
              }
            );
          } else {
            console.log(res);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/insert_room_message");
          console.log(error);
        });
    }
  };

  /**
   * 設定初始置底、自己發訊息也置底
   */
  useEffect(() => {
    if (init && messages.length > 0) {
      setInit(false);
      scrollToBottom();
    }
  }, [init, JSON.stringify(messages)]);

  return (
    <div className="container">
      <InfoBar
        room={room}
        user={user}
        searchedValue={(value) => {
          setSearchedValue(value);
        }}
        searchedMessage={(searchedMessage) => {
          setMessageLoading(true);
          setSearchedMessage(searchedMessage);
        }}
        searchedMessagesList={(searchedMessagesList) => {
          setSearchedMessagesList(searchedMessagesList);
        }}
      />
      {messageLoading ? (
        <div className="message-loading">
          <div className="ball-beat">
            <br />
            <div />
            <div />
            <div />
          </div>
        </div>
      ) : (
        <None />
      )}
      <div className="messages" ref={scrollRef}>
        {socket ? (
          messages.map((message, i) => (
            <div key={i}>
              {i == 0 ? (
                <DateMessage date={message.d} />
              ) : messages[i - 1].d !== message.d ? (
                <DateMessage date={message.d} />
              ) : (
                <None />
              )}
              <Message
                message={message}
                user={user}
                users={users}
                searchedValue={searchedValue}
                searchedMessage={searchedMessage}
                searchedMessagesList={searchedMessagesList}
              />
            </div>
          ))
        ) : (
          <None />
        )}
      </div>
      {notReadMsg ? (
        <div
          className="notReadMsg"
          onClick={(e) => {
            scrollToBottom();
          }}
        >
          &ensp;
          {notReadMsg.send_member_name + ": " + notReadMsg.message_content}
        </div>
      ) : (
        <None />
      )}
      <Input
        room={room}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendFileMessage={sendFileMessage}
      />
    </div>
  );
};

export default Chat;
export type {
  messageProps,
  userProps,
  usersProps,
  roomProps,
  fileMessageProps,
};
