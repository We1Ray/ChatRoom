import React, { useContext, useEffect, useRef, useState } from "react";
import {
  CallApi,
  None,
  SystemContext,
  Row,
  Column,
  DraggableDialog,
} from "../../../../resource";
import "./Message.css";
import {
  messageProps,
  userProps,
  usersProps,
  fileMessageProps,
} from "../Chat/Chat";
import Crypto from "crypto-js";
import { Button, DialogActions } from "@material-ui/core";

interface Props {
  message: messageProps;
  user: userProps;
  users: usersProps[];
  searchedValue: string;
  searchedMessage?: messageProps;
  searchedMessagesList?: messageProps[];
}

const Message: React.FC<Props> = ({
  message,
  user,
  users,
  searchedValue,
  searchedMessage,
  searchedMessagesList,
}) => {
  const { System } = useContext(SystemContext);
  const [isRead, setIsRead] = useState(message ? parseInt(message.isread) : 0);
  const [messageClassType, setMessageClassType] = useState({});
  const [file, setFile] = useState<fileMessageProps>(null);
  const [isImage, setIsImage] = useState(false);
  const [dialogOn, setDialogOn] = useState(false);

  const messageRef = useRef(null);

  useEffect(() => {
    if (searchedMessage) {
      if (message.message_id === searchedMessage.message_id) {
        messageRef.current.scrollIntoView(); /** 設定scrollbar至被查詢的訊息 */
      } else {
        if (message.send_member === user.account_uid) {
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
      if (message.send_member === user.account_uid) {
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
    JSON.stringify(message),
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

  function ReplaceSearchMessage(text) {
    let replace_statement = [];
    if (message && searchedMessage && searchedValue !== "") {
      if (message.message_id === searchedMessage.message_id) {
        if (text === searchedValue) {
          replace_statement.push(
            <span style={searchValueStyle}>{searchedValue}</span>
          );
        } else {
          let statement = text.split(searchedValue);
          for (let index = 0; index < statement.length; index++) {
            replace_statement.push(<span>{statement[index]}</span>);
            index + 1 === statement.length
              ? replace_statement.push(<></>)
              : replace_statement.push(
                  <span style={searchValueStyle}>{searchedValue}</span>
                );
          }
        }
      } else if (
        searchedMessagesList.find(
          (element) => element.message_id === message.message_id
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
              ? replace_statement.push(<></>)
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
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/chat/get_message_state",
      {
        room_id: message.room_id,
        message_id: message.message_id,
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
  }, [JSON.stringify(users), JSON.stringify(message)]);

  useEffect(() => {
    if (message.message_type !== "string") {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/file/get_file",
        {
          file_id: message.file_id,
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
      if (message.message_type) {
        if (message.message_type.indexOf("image") > -1) {
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
  }, [JSON.stringify(message)]);

  return message.send_member === user.account_uid ? (
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
        {message.hm}
      </p>
      &emsp;
      {file ? (
        isImage ? (
          <div className="messageBox backgroundBlue">
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
              <img
                src={file.url + "/download"}
                title={file.name}
                alt={file.name}
              />
            </DraggableDialog>
          </div>
        ) : (
          <div className="messageBox backgroundBlue">
            <a
              className="messageText fileMessage"
              style={messageClassType}
              href={file.url + "/download"}
              download={file.name}
            >
              <Column>
                <Row>
                  <i className="fas fa-file-alt" style={{ fontSize: "20px" }} />
                  &ensp;
                  {ReplaceSearchMessage(message.message_content)}
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
          </div>
        )
      ) : (
        <div className="messageBox backgroundBlue">
          <p className="messageText" style={messageClassType}>
            {ReplaceSearchMessage(message.message_content)}
          </p>
        </div>
      )}
      &emsp;
    </div>
  ) : (
    <>
      {message.send_member === "system" ? (
        <div
          className="messageContainer"
          ref={messageRef}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="messageBox backgroundLight">
            <p className="messageText" style={messageClassType}>
              <b>{message.message_content}</b>
            </p>
          </div>
        </div>
      ) : (
        <div className="messageContainer justifyStart" ref={messageRef}>
          <p className="sentText pl-10">{message.send_member_name}</p>
          &emsp;
          {file ? (
            isImage ? (
              <div className="messageBox backgroundLight">
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
                  <img
                    src={file.url + "/download"}
                    alt={file.name}
                    title={file.name}
                  />
                </DraggableDialog>
              </div>
            ) : (
              <div className="messageBox backgroundLight">
                <a
                  className="messageText fileMessage"
                  style={messageClassType}
                  href={file.url + "/download"}
                  download={file.name}
                >
                  <i className="fas fa-file-alt" />
                  &ensp;
                  {ReplaceSearchMessage(message.message_content)}
                </a>
              </div>
            )
          ) : (
            <div className="messageBox backgroundLight">
              <p className="messageText" style={messageClassType}>
                {ReplaceSearchMessage(message.message_content)}
              </p>
            </div>
          )}
          &emsp;
          <p
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {message.hm}
          </p>
        </div>
      )}
    </>
  );
};

export default Message;
