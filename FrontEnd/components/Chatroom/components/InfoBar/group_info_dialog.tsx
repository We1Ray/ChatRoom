import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import {
  SystemContext,
  Column,
  Row,
  DraggableDialog,
  Label,
  TextBox,
  CheckBox,
  None,
  CallApi,
  SystemFunc,
} from "../../../../resource";
import "ds-widget/dist/index.css";
import { roomProps, userProps, groupMember } from "../Chat/Chat";

interface Group_info_dialog {
  dialogOn: boolean;
  setDialogOn: React.Dispatch<React.SetStateAction<boolean>>;
  user: userProps;
  room: roomProps;
  groupMember: groupMember[];
  updateGroupRoomInfo: (
    room: roomProps
  ) => any | ((room: roomProps) => Promise<any>);
}

const Group_info_dialog: React.FC<Group_info_dialog> = ({
  dialogOn,
  setDialogOn,
  user,
  room,
  groupMember,
  updateGroupRoomInfo,
}) => {
  const { System } = useContext(SystemContext);
  const [groupMemberList, setGroupMemberList] = useState<groupMember[]>([]);
  const [groupName, setGrouphName] = useState(room.room_name);
  const [groupSearchName, setGroupSearchName] = useState("");
  const [selectMemberSearchName, setSelectMemberSearchName] = useState("");
  const [selectDisplayList, setSelectDisplayList] =
    useState<groupMember[]>(groupMember);
  const [selectGroupMember, setSelectGroupMember] =
    useState<groupMember[]>(groupMember);
  const [notSelectGroupMemberList, setNotSelectGroupMemberList] = useState<
    groupMember[]
  >([]);

  useEffect(() => {
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/chat/get_groupMemberList",
      {
        account_uid: user.account_uid,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          setGroupMemberList(res.data);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/get_groupMemberList");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setSelectGroupMember(groupMember);
  }, [JSON.stringify(groupMember)]);

  /**
   * 查詢關鍵字重新查詢群組人員名單(沒被選擇)
   */
  useEffect(() => {
    if (groupSearchName === "") {
      setNotSelectGroupMemberList(groupMemberList.slice(0, 99));
    } else {
      setNotSelectGroupMemberList(
        groupMemberList.filter((value) =>
          value.name ? value.name.includes(groupSearchName) : false
        )
      );
    }
  }, [groupSearchName, JSON.stringify(groupMemberList)]);

  useEffect(() => {
    if (selectMemberSearchName === "") {
      setSelectDisplayList(selectGroupMember);
    } else {
      setSelectDisplayList(
        selectGroupMember.filter((value) =>
          value.name ? value.name.includes(selectMemberSearchName) : false
        )
      );
    }
  }, [selectMemberSearchName, JSON.stringify(selectGroupMember)]);

  function select(value: string, text: string) {
    if (value !== "") {
      setSelectDisplayList((prev: groupMember[]) => [
        ...prev.filter((obj: groupMember) => obj.name !== text),
        { account_uid: value, name: text },
      ]);

      setSelectGroupMember((prev: groupMember[]) => [
        ...prev,
        { account_uid: value, name: text },
      ]);
    }
  }

  function unselect(value: string, text: string) {
    if (value === "") {
      setSelectGroupMember((prev: groupMember[]) =>
        prev.filter((obj) => obj.name !== text)
      );
    }
  }

  function insert_system_room_add_remove_message(
    roomMember: string,
    newName: string
  ) {
    let addMember = selectGroupMember.filter(
      (member) =>
        groupMember.findIndex(
          (value) => value.account_uid === member.account_uid
        ) < 0
    );
    let removeMember = groupMember.filter(
      (member) =>
        selectGroupMember.findIndex(
          (value) => value.account_uid === member.account_uid
        ) < 0
    );

    if (addMember.length > 0 || removeMember.length > 0) {
      let addMessage = "";
      if (addMember.length > 0) {
        addMessage = user.name + "已將";
        for (let index = 0; index < addMember.length; index++) {
          addMessage += addMember[index].name + ",";
        }
        addMessage =
          addMessage.substring(0, addMessage.length - 1) + "加入群組";
      }

      let removeMessage = "";
      if (removeMember.length > 0) {
        removeMessage = user.name + "已將";
        for (let index = 0; index < removeMember.length; index++) {
          removeMessage += removeMember[index].name + ",";
        }
        removeMessage =
          removeMessage.substring(0, removeMessage.length - 1) + "移出群組";
      }

      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/insert_room_message",
        {
          room_id: room.room_id,
          message_id: "Msg-" + SystemFunc.uuid(),
          message_type: "string",
          message_content:
            addMessage !== "" && removeMessage !== ""
              ? `${addMessage}
${removeMessage}`
              : addMessage !== ""
              ? `${addMessage}`
              : `${removeMessage}`,
          send_member: "system",
        }
      )
        .then((res) => {
          if (res.status === 200) {
            let newGroupMembers = room;
            newGroupMembers.room_name = groupName;
            newGroupMembers.room_member = roomMember;
            updateGroupRoomInfo(newGroupMembers);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/insert_room_message");
          console.log(error);
        });
    } else if (newName == "") {
      let newGroupMembers = room;
      newGroupMembers.room_name = groupName;
      newGroupMembers.room_member = roomMember;
      updateGroupRoomInfo(newGroupMembers);
    }
  }

  function updateRoomInfo() {
    let roomMember = "";
    for (let index = 0; index < selectGroupMember.length; index++) {
      roomMember += selectGroupMember[index].account_uid + ";";
    }
    roomMember = roomMember.substring(0, roomMember.length - 1);
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/chat/update_room_group_info",
      {
        room_id: room.room_id,
        room_name: groupName,
        room_member: roomMember,
      }
    )
      .then((res) => {
        if (res.status === 200) {
          let newName = room.room_name !== groupName ? groupName : "";
          if (newName !== "") {
            CallApi.ExecuteApi(
              System.factory.name,
              System.factory.ip + "/chat/insert_room_message",
              {
                room_id: room.room_id,
                message_id: "Msg-" + SystemFunc.uuid(),
                message_type: "string",
                message_content: `${user.name} 已將群組名稱 ${room.room_name} 更改為 ${groupName}`,
                send_member: "system",
              }
            )
              .then((res) => {
                if (res.status === 200) {
                  insert_system_room_add_remove_message(roomMember, newName);
                }
              })
              .catch((error) => {
                console.log("EROOR: Chat: /chat/insert_room_message");
                console.log(error);
              });
          } else {
            insert_system_room_add_remove_message(roomMember, newName);
          }
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/update_room_group_info");
        console.log(error);
      });
    setDialogOn(false);
  }

  return (
    <DraggableDialog open={dialogOn} style={{ width: "auto", height: "auto" }}>
      <Row>
        <Column
          style={{
            justifyContent: "flex-start",
          }}
        >
          <DialogTitle>
            <b>修改群組人員</b>
          </DialogTitle>
        </Column>
        <DialogActions>
          <Column
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => {
                setDialogOn(false);
              }}
            >
              <h4
                className="fas fa-times"
                style={{
                  color: "gray",
                }}
              />
            </Button>
          </Column>
        </DialogActions>
      </Row>
      <DialogContent>
        <Row>
          <Column>
            <Label bind={true} name="group_member">
              群組名稱
            </Label>
            <TextBox
              maxLength={60}
              defaultValue={groupName}
              result={(value) => {
                setGrouphName(value);
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Label bind={true} name="group_member">
              群組人員
            </Label>
            <Row>
              <div className="selectBlock">
                <Column>
                  <Row>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <em
                        className="fas fa-search"
                        style={{
                          color: "rgb(197, 197, 197)",
                          fontSize: "16px",
                        }}
                      />
                    </div>
                    &ensp;
                    <TextBox
                      style={{
                        width: "90%",
                      }}
                      result={(value) => {
                        setGroupSearchName(value);
                      }}
                    />
                  </Row>
                </Column>
                <br />
                <div style={{ overflow: "auto", height: "85%" }}>
                  {notSelectGroupMemberList.map(function (object: groupMember) {
                    return (
                      <>
                        {selectGroupMember.find(
                          (obj: groupMember) =>
                            obj.account_uid === object.account_uid
                        ) ? (
                          <None />
                        ) : (
                          <Column>
                            <Row>
                              <CheckBox
                                style={{
                                  color: "gray",
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                                checkedText={object.name}
                                notCheckedText={object.name}
                                checkedValue={object.account_uid}
                                notCheckedValue={""}
                                defaultValue={""}
                                result={select}
                              />
                            </Row>
                          </Column>
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="selectBlock">
                <Column>
                  <Row>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <em
                        className="fas fa-search"
                        style={{
                          color: "rgb(197, 197, 197)",
                          fontSize: "16px",
                        }}
                      />
                    </div>
                    &ensp;
                    <TextBox
                      style={{
                        width: "90%",
                      }}
                      result={(value) => {
                        setSelectMemberSearchName(value);
                      }}
                    />
                  </Row>
                </Column>
                <br />
                <div style={{ overflow: "auto", height: "85%" }}>
                  {selectDisplayList.map(function (object: groupMember) {
                    return (
                      <>
                        {selectGroupMember.find(
                          (obj: groupMember) =>
                            obj.account_uid === object.account_uid
                        ) ? (
                          <Column>
                            <Row>
                              <CheckBox
                                style={{
                                  color: "gray",
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                                checkedText={object.name}
                                notCheckedText={object.name}
                                checkedValue={object.account_uid}
                                notCheckedValue={""}
                                defaultValue={object.account_uid}
                                result={unselect}
                                disabled={
                                  object.account_uid === user.account_uid
                                }
                              />
                            </Row>
                          </Column>
                        ) : (
                          <None />
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
            </Row>
          </Column>
        </Row>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => updateRoomInfo()}
        >
          <i
            className="fas fa-check"
            title="儲存"
            style={{
              color: "green",
            }}
          />
        </Button>
      </DialogActions>
    </DraggableDialog>
  );
};
export default Group_info_dialog;
