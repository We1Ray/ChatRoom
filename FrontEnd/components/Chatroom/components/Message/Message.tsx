import React, { useContext, useEffect, useRef, useState } from "react";
import Crypto from "crypto-js";
import { Button, DialogActions } from "@material-ui/core";
import {
  CallApi,
  None,
  SystemContext,
  Row,
  Column,
  DraggableDialog,
} from "../../../../resource";
import {
  messageProps,
  userProps,
  usersProps,
  fileMessageProps,
} from "../Chat/Chat";
import "./Message.css";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

interface Props {
  message: messageProps;
  previousMessage?: messageProps;
  user: userProps;
  users: usersProps[];
  searchedValue: string;
  searchedMessage?: messageProps;
  searchedMessagesList?: messageProps[];
  replyMessage?: (message: messageProps) => any;
  retractMessage?: (message: messageProps) => any;
  clickReplyMessage?: messageProps;
  setClickReplyMessage?: (message: messageProps) => any;
}

const Message: React.FC<Props> = ({
  message,
  previousMessage,
  user,
  users,
  searchedValue,
  searchedMessage,
  searchedMessagesList,
  replyMessage,
  retractMessage,
  clickReplyMessage,
  setClickReplyMessage,
}) => {
  const { System } = useContext(SystemContext);
  const [thisMessage, setThisMessage] = useState(message);
  const [isRead, setIsRead] = useState(message ? parseInt(message.isread) : 0);
  const [messageClassType, setMessageClassType] = useState({});
  const [file, setFile] = useState<fileMessageProps>(null);
  const [isImage, setIsImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOn, setDialogOn] = useState(false);
  const [reply_Message, setReply_Message] = useState<messageProps>(null);

  const messageRef = useRef(null);

  useEffect(() => {
    setThisMessage(message);
  }, [JSON.stringify(message)]);

  useEffect(() => {
    if (thisMessage.reply_message_id) {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/get_message",
        {
          message_id: thisMessage.reply_message_id,
        }
      )
        .then((res) => {
          if (res.status !== 200) {
            console.log(res);
          } else {
            setReply_Message(res.data[0]);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_message_state");
          console.log(error);
        });
    } else {
      setReply_Message(null);
    }
  }, [JSON.stringify(thisMessage.reply_message_id)]);

  useEffect(() => {
    if (clickReplyMessage) {
      if (thisMessage.message_id === clickReplyMessage.message_id) {
        messageRef.current.scrollIntoView(); /** 設定scrollbar至被查詢的訊息 */
        setClickReplyMessage(null);
      }
    }
  }, [JSON.stringify(thisMessage), JSON.stringify(clickReplyMessage)]);

  useEffect(() => {
    if (searchedMessage) {
      if (thisMessage.message_id === searchedMessage.message_id) {
        messageRef.current.scrollIntoView(); /** 設定scrollbar至被查詢的訊息 */
      } else {
        if (thisMessage.send_member === user.account_uid) {
          setMessageClassType({
            color: "white",
          });
        } else {
          setMessageClassType({
            color: "#353535",
          });
        }
      }
    } else {
      if (thisMessage.send_member === user.account_uid) {
        setMessageClassType({
          color: "white",
        });
      } else {
        setMessageClassType({
          color: "#353535",
        });
      }
    }
  }, [
    JSON.stringify(thisMessage),
    JSON.stringify(searchedMessage),
    JSON.stringify(user),
  ]);

  const searchListStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "white",
    backgroundColor: "orange",
    marginBottom: "3%",
  };

  const searchValueStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "white",
    backgroundColor: "red",
    marginBottom: "3%",
  };

  const commonMessageStyle: React.CSSProperties = {
    marginBottom: "1%",
    alignItems: "center",
  };

  function ReplaceSearchMessage(text: string) {
    let replace_statement = [];
    if (thisMessage && searchedMessage && searchedValue !== "") {
      if (thisMessage.message_id === searchedMessage.message_id) {
        if (text === searchedValue) {
          replace_statement.push(
            <span style={searchValueStyle}>{searchedValue}</span>
          );
        } else {
          let statement = text.split(searchedValue);
          for (let index = 0; index < statement.length; index++) {
            replace_statement.push(<span>{statement[index]}</span>);
            index + 1 === statement.length
              ? replace_statement.push(<None />)
              : replace_statement.push(
                  <span style={searchValueStyle}>{searchedValue}</span>
                );
          }
        }
      } else if (
        searchedMessagesList.find(
          (element) => element.message_id === thisMessage.message_id
        )
      ) {
        if (text === searchedValue) {
          replace_statement.push(
            <span style={searchListStyle}>{searchedValue}</span>
          );
        } else {
          let statement = text.split(searchedValue);
          for (let index = 0; index < statement.length; index++) {
            replace_statement.push(<span>{statement[index]}</span>);
            index + 1 === statement.length
              ? replace_statement.push(<None />)
              : replace_statement.push(
                  <span style={searchListStyle}>{searchedValue}</span>
                );
          }
        }
      } else {
        replace_statement.push(<p style={commonMessageStyle}>{text}</p>);
      }
    } else {
      replace_statement.push(<p style={commonMessageStyle}>{text}</p>);
    }

    return replace_statement;
  }

  useEffect(() => {
    if (!isLoading) {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/get_message_state",
        {
          room_id: thisMessage.room_id,
          message_id: thisMessage.message_id,
        }
      )
        .then((res) => {
          if (res.status !== 200) {
            console.log(res);
          } else {
            setIsRead(parseInt(res.data[0].isread));
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_message_state");
          console.log(error);
        });
    }
  }, [JSON.stringify(users), JSON.stringify(thisMessage), isLoading]);

  useEffect(() => {
    if (thisMessage.message_id.includes("loading-")) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (thisMessage.message_type !== "string") {
        CallApi.ExecuteApi(
          System.factory.name,
          System.factory.ip + "/file/get_file",
          {
            file_id: thisMessage.file_id,
          }
        )
          .then((res) => {
            if (res.status === 200) {
              setFile(res.data[0]);
            }
          })
          .catch((error) => {
            console.log("EROOR: Chat: /file/get_file");
            console.log(error);
          });
        if (thisMessage.message_type) {
          if (thisMessage.message_type.indexOf("image") > -1) {
            setIsImage(true);
          } else {
            setIsImage(false);
          }
        } else {
          setIsImage(false);
        }
      } else {
        setFile(null);
      }
    }
  }, [JSON.stringify(thisMessage)]);

  function handleContextClick(
    e:
      | React.TouchEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
    { action, name: id }
  ) {
    switch (action) {
      case "copy":
        if (navigator.clipboard && window.isSecureContext) {
          // navigator clipboard 向剪贴板写文本
          navigator.clipboard.writeText(thisMessage.message_content);
        } else {
          // 创建text area
          let textArea = document.createElement("textarea");
          textArea.value = thisMessage.message_content;
          // 使text area不在viewport，同时设置不可见
          textArea.style.position = "absolute";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand("copy") ? res : rej;
            textArea.remove();
          });
        }
        break;
      case "reply":
        if (replyMessage) {
          replyMessage(thisMessage);
        }
        break;
      case "retract":
        CallApi.ExecuteApi(
          System.factory.name,
          System.factory.ip + "/chat/retract_message",
          {
            message_id: thisMessage.message_id,
            message_content: user.name + " 已收回訊息",
            room_id: thisMessage.room_id,
            file_id: file ? file.file_id : null,
            path: file ? file.path : null,
          }
        )
          .then((res) => {
            if (res.status === 200) {
              setThisMessage((prev) => {
                prev.message_content = user.name + "已收回訊息";
                prev.send_member = "system";
                return prev;
              });
              retractMessage(thisMessage);
            } else {
              console.log(res);
            }
          })
          .catch((error) => {
            console.log("EROOR: Chat: /chat/retract_message");
            console.log(error);
          });
        break;
      default:
        break;
    }
  }

  function isValidURL(cointent: string) {
    var res = cointent.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  }

  return thisMessage.send_member === user.account_uid ? (
    <div className="messageContainer justifyEnd" ref={messageRef}>
      <p
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {isRead > 0 ? (
          <>
            {System.getLocalization("CHAT", "READ")}
            {users[0].room.is_group === "Y" ? isRead : ""}
            <br />
          </>
        ) : (
          <None />
        )}
        {thisMessage.hm}
      </p>
      &emsp;
      <div className="messageBox backgroundBlue">
        <ContextMenu id={isLoading ? "loading" : thisMessage.message_id}>
          <MenuItem data={{ action: "copy" }} onClick={handleContextClick}>
            <em className="fas fa-clone" />
            &ensp;
            {"複製"}
          </MenuItem>
          <MenuItem data={{ action: "reply" }} onClick={handleContextClick}>
            <em className="fas fa-reply" />
            &ensp;
            {"回復訊息"}
          </MenuItem>
          <MenuItem data={{ action: "retract" }} onClick={handleContextClick}>
            <em className="fas fa-comment-slash" />
            &ensp;
            {"收回訊息"}
          </MenuItem>
        </ContextMenu>
        <DraggableDialog open={dialogOn}>
          <DialogActions>
            <Button
              onClick={() => setDialogOn(false)}
              style={{
                backgroundColor: "rgb(171, 219, 241)",
              }}
            >
              <i className="fas fa-times" />
            </Button>
          </DialogActions>
          {file ? (
            <img
              src={file.url + "/download"}
              title={file.name}
              alt={file.name}
            />
          ) : (
            <None />
          )}
        </DraggableDialog>
        <ContextMenuTrigger id={thisMessage.message_id}>
          {reply_Message ? (
            <>
              <div
                onClick={() => {
                  setClickReplyMessage(reply_Message);
                }}
                style={{
                  color: "#D4D4D4",
                  cursor: "pointer",
                }}
              >
                {reply_Message.send_member_name +
                  ":" +
                  (reply_Message.message_content.length > 50
                    ? reply_Message.message_content.substring(0, 49) + " ....."
                    : reply_Message.message_content)}
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  borderTop: "solid #ACC0D8 1px",
                  borderColor: "#D4D4D4",
                }}
              />
            </>
          ) : (
            <None />
          )}
          {file ? (
            isImage ? (
              <img
                src={file.url + "/download"}
                alt={file.name}
                title={file.name}
                style={{
                  height: "50px",
                  width: "50px",
                  cursor: "pointer",
                }}
                onClick={(e) => setDialogOn(true)}
              />
            ) : (
              <a
                className="messageText fileMessage"
                style={messageClassType}
                href={file.url + "/download"}
                download={file.name}
              >
                <Column>
                  <Row>
                    <i
                      className="fas fa-file-alt"
                      style={{ fontSize: "20px" }}
                    />
                    &ensp;
                    {ReplaceSearchMessage(thisMessage.message_content)}
                  </Row>
                  <Row>
                    {System.getLocalization("CHAT", "FILE_SIZE") + ": "}
                    {file.size > 1024
                      ? file.size > 1048576
                        ? file.size > 1073741824
                          ? Math.round(file.size / 1073741824) + "GB"
                          : Math.round(file.size / 1048576) + "MB"
                        : Math.round(file.size / 1024) + "KB"
                      : file.size + "B"}
                  </Row>
                </Column>
              </a>
            )
          ) : isLoading ? (
            <a className="messageText fileMessage" style={messageClassType}>
              <Column>
                <Row>
                  <i className="fas fa-file-alt" style={{ fontSize: "20px" }} />
                  &ensp;
                  {ReplaceSearchMessage(thisMessage.message_content)}
                </Row>
                <Row style={{ display: "flex", justifyContent: "center" }}>
                  <div className="ball-clip-rotate">
                    <div></div>
                  </div>
                </Row>
              </Column>
            </a>
          ) : (
            <p className="messageText" style={messageClassType}>
              {ReplaceSearchMessage(thisMessage.message_content)}
            </p>
          )}
        </ContextMenuTrigger>
      </div>
      &emsp;
    </div>
  ) : (
    <>
      {thisMessage.send_member === "system" ? (
        <div
          className="messageContainer"
          ref={messageRef}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="messageBox backgroundLight">
            <p className="messageText" style={messageClassType}>
              <b>{thisMessage.message_content}</b>
            </p>
          </div>
        </div>
      ) : (
        <div className="messageContainer justifyStart" ref={messageRef}>
          <ContextMenu id={isLoading ? "loading" : thisMessage.message_id}>
            <MenuItem data={{ action: "copy" }} onClick={handleContextClick}>
              <em className="fas fa-clone" />
              &ensp;
              {"複製"}
            </MenuItem>
            <MenuItem data={{ action: "reply" }} onClick={handleContextClick}>
              <em className="fas fa-reply" />
              &ensp;
              {"回復訊息"}
            </MenuItem>
          </ContextMenu>
          <DraggableDialog open={dialogOn}>
            <DialogActions>
              <Button
                onClick={() => setDialogOn(false)}
                style={{
                  backgroundColor: "rgb(171, 219, 241)",
                }}
              >
                <i className="fas fa-times" />
              </Button>
            </DialogActions>
            {file ? (
              <img
                src={file.url + "/download"}
                title={file.name}
                alt={file.name}
              />
            ) : (
              <None />
            )}
          </DraggableDialog>
          {previousMessage ? (
            previousMessage.send_member === thisMessage.send_member ? (
              <None />
            ) : (
              <>
                <p className="sentText pl-10">
                  <b>{thisMessage.send_member_name}</b>
                </p>
              </>
            )
          ) : (
            <>
              <p className="sentText pl-10">
                <b>{thisMessage.send_member_name}</b>
              </p>
            </>
          )}
          &emsp;
          <div className="messageBox backgroundLight">
            <ContextMenuTrigger id={thisMessage.message_id}>
              {file ? (
                isImage ? (
                  <img
                    src={file.url + "/download"}
                    alt={file.name}
                    title={file.name}
                    style={{
                      height: "50px",
                      width: "50px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => setDialogOn(true)}
                  />
                ) : (
                  <a
                    className="messageText fileMessage"
                    style={messageClassType}
                    href={file.url + "/download"}
                    download={file.name}
                  >
                    <i className="fas fa-file-alt" />
                    &ensp;
                    {ReplaceSearchMessage(thisMessage.message_content)}
                  </a>
                )
              ) : (
                <p className="messageText" style={messageClassType}>
                  {ReplaceSearchMessage(thisMessage.message_content)}
                </p>
              )}
            </ContextMenuTrigger>
          </div>
          &emsp;
          <p
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {thisMessage.hm}
          </p>
        </div>
      )}
    </>
  );
};

export default Message;
