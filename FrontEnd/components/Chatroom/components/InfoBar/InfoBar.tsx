import React, { useState, useEffect, useCallback, useContext } from "react";
import "./InfoBar.css";
import {
  CallApi,
  Column,
  None,
  Row,
  SystemContext,
  TextBox,
} from "../../../../resource";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { roomProps, userProps, messageProps, groupMember } from "../Chat/Chat";
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import Group_info_dialog from "./group_info_dialog";
import Pic_dialog from "./pic_dialog";
import File_dialog from "./file_dialog";

interface InfoBarProps {
  room: roomProps;
  user: userProps;
  searchedValue?: (searchedValue: string) => any;
  searchedMessage?: (searchedMessage: messageProps) => any;
  searchedMessagesList?: (searchedMessagesList: messageProps[]) => any;
  updateGroupRoomInfo?: (
    room: roomProps
  ) => any | ((room: roomProps) => Promise<any>);
}

const InfoBar: React.FC<InfoBarProps> = ({
  room,
  user,
  searchedValue,
  searchedMessage,
  searchedMessagesList,
  updateGroupRoomInfo,
}) => {
  const { System } = useContext(SystemContext);
  const [onSearch, setOnSearch] = useState(false);
  const [keyWord, setKeyWord] = useState("");
  const [searchedMessageList, setSearchedMessageList] = useState<
    messageProps[]
  >([]);
  const [searchedMessageNumber, setSearchedMessageNumber] = useState(null);
  const [ddOpen, setDdOpen] = useState(false);
  const [groupMemberDialogOn, setGroupMemberDialogOn] = useState(false);
  const [groupMember, setGroupMember] = useState<groupMember[]>([]);
  const [picDialogOn, setPicDialogOn] = useState(false);
  const [fileDialogOn, setFileDialogOn] = useState(false);

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      setOnSearch(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  useEffect(() => {
    if (room.is_group === "Y") {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/get_room_group_member",
        {
          room_id: room.room_id,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setGroupMember(res.data);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_group_member");
          console.log(error);
        });
    }
  }, [JSON.stringify(room)]);

  useEffect(() => {
    searchedMessage(searchedMessageList[searchedMessageNumber - 1]);
    searchedMessagesList(searchedMessageList);
  }, [searchedMessageNumber, searchedMessageList]);

  useEffect(() => {
    if (!onSearch) {
      searchedMessage(null);
      setSearchedMessageList([]);
      setSearchedMessageNumber(null);
    }
  }, [onSearch]);

  useEffect(() => {
    searchedValue(keyWord);
  }, [keyWord]);

  function searchValue(event: { preventDefault: () => void }) {
    if (event.preventDefault) event.preventDefault();

    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/chat/get_room_search_keyword",
      {
        room_id: room.room_id,
        keyWord: keyWord,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          setSearchedMessageList(res.data);
          setSearchedMessageNumber(res.data.length);
          if (res.data.length === 0) {
            toast(System.getLocalization("CHAT", "NO_MATCH_DATA_FIND"), {
              type: "error",
              position: "top-right",
            });
          }
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_room_search_keyword");
        console.log(error);
      });
  }

  function toggle() {
    setDdOpen((prev) => !prev);
  }

  return (
    <>
      <Group_info_dialog
        dialogOn={groupMemberDialogOn}
        setDialogOn={setGroupMemberDialogOn}
        user={user}
        room={room}
        groupMember={groupMember}
        updateGroupRoomInfo={updateGroupRoomInfo}
      />
      <Pic_dialog
        dialogOn={picDialogOn}
        setDialogOn={setPicDialogOn}
        room={room}
      />
      <File_dialog
        dialogOn={fileDialogOn}
        setDialogOn={setFileDialogOn}
        room={room}
      />
      <div className="infoBar">
        <div className="leftInnerContainer">
          <h3
            style={{
              marginTop: "5%",
              marginBottom: "5%",
            }}
          >
            {room.room_name}
            {room.is_group === "Y"
              ? "(" + room.room_member.split(";").length + ")"
              : ""}
          </h3>
        </div>
        <div className="rightInnerContainer">
          <Dropdown isOpen={ddOpen} toggle={toggle}>
            <DropdownToggle>
              <i className="fas fa-bars a" />
            </DropdownToggle>
            <DropdownMenu className="fadeInLeft">
              <DropdownItem>
                <div
                  onClick={() => {
                    setOnSearch((prev) => !prev);
                  }}
                >
                  <em className="fab fa-sistrix" />
                  &ensp;
                  {"搜尋關鍵字"}
                </div>
              </DropdownItem>
              {room.is_group === "Y" ? (
                <DropdownItem>
                  <div
                    onClick={() => {
                      setGroupMemberDialogOn(true);
                    }}
                  >
                    <em className="fas fa-users" />
                    &ensp;
                    {"群組資訊"}
                  </div>
                </DropdownItem>
              ) : (
                <None />
              )}
              <DropdownItem>
                <div
                  onClick={() => {
                    setPicDialogOn(true);
                  }}
                >
                  <em className="fas fa-image" />
                  &ensp;
                  {"照片"}
                </div>
              </DropdownItem>
              <DropdownItem>
                <div
                  onClick={() => {
                    setFileDialogOn(true);
                  }}
                >
                  <em className="fas fa-file-alt" />
                  &ensp;
                  {"檔案"}
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {onSearch ? (
        <div className="searchKeyword">
          <Row>
            <Column md={searchedMessageList.length > 0 ? 10 : 11}>
              <TextBox
                placeholder="搜尋訊息..."
                onKeyPress={(event: any) =>
                  event.key === "Enter" ? searchValue(event) : null
                }
                onChange={(event: any) => setKeyWord(event.target.value)}
              />
            </Column>
            <Column
              md={searchedMessageList.length > 0 ? 2 : 1}
              className="updown"
            >
              <Row>
                {searchedMessageList.length > 0 ? (
                  <>
                    <Column>
                      <span
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        {searchedMessageNumber +
                          "/" +
                          searchedMessageList.length}
                      </span>
                    </Column>
                    <Column>
                      <em
                        className="fas fa-angle-up"
                        onClick={() => {
                          setSearchedMessageNumber((prev: number) =>
                            prev > 1 ? prev - 1 : prev
                          );
                        }}
                      />
                    </Column>
                    <Column>
                      <em
                        className="fas fa-angle-down"
                        onClick={() => {
                          setSearchedMessageNumber((prev: number) =>
                            prev < searchedMessageList.length ? prev + 1 : prev
                          );
                        }}
                      />
                    </Column>
                    <Column>
                      <em
                        className="fas fa-times-circle"
                        title={"關閉"}
                        onClick={() => {
                          setOnSearch(false);
                        }}
                      />
                    </Column>
                  </>
                ) : (
                  <div className="backspace">
                    <em
                      className="fab fa-sistrix c"
                      title={"搜尋"}
                      onClick={(event) => {
                        searchValue(event);
                      }}
                    />
                    &emsp; &ensp;
                    <em
                      className="fas fa-times-circle"
                      title={"關閉"}
                      onClick={() => {
                        setOnSearch(false);
                      }}
                    />
                  </div>
                )}
              </Row>
            </Column>
            <ToastContainer />
          </Row>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default InfoBar;
