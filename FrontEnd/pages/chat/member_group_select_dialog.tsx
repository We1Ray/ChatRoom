import React, { useContext, useEffect, useState } from "react";
import {
  SystemContext,
  Column,
  Row,
  DraggableDialog,
  Label,
  TextBox,
  BtnSave,
  BtnCancel,
  CheckBox,
  None,
  CallApi,
} from "../../resource/index";
import "ds-widget/dist/index.css";
import { DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { groupMember } from "../../components/Chatroom";

export default function Member_group_select_dialog({
  dialogOn,
  setDialogOn,
  user,
  setSelectMembers,
}) {
  const { System } = useContext(SystemContext);
  const [groupMemberList, setGroupMemberList] = useState<groupMember[]>([]);
  const [groupSearchName, setGroupSearchName] = useState("");
  const [selectMemberSearchName, setSelectMemberSearchName] = useState("");
  const [selectDisplayList, setSelectDisplayList] = useState<groupMember[]>([]);
  const [selectGroupMember, setSelectGroupMember] = useState<groupMember[]>([]);
  const [notSelectGroupMemberList, setNotSelectGroupMemberList] = useState<
    groupMember[]
  >([]);

  useEffect(() => {
    if (user) {
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
    } else {
      setGroupMemberList([]);
    }
  }, [JSON.stringify(user)]);

  /**
   * 初始化群組人員名單(沒被選擇)
   */
  useEffect(() => {
    setNotSelectGroupMemberList(groupMemberList.slice(0, 99));
  }, [JSON.stringify(groupMemberList)]);

  /**
   * 查詢關鍵字重新查詢群組人員名單(沒被選擇)
   */
  useEffect(() => {
    if (user) {
      if (groupSearchName === "") {
        setNotSelectGroupMemberList(groupMemberList.slice(0, 99));
      } else {
        setNotSelectGroupMemberList(
          groupMemberList.filter((value) =>
            value.name ? value.name.includes(groupSearchName) : false
          )
        );
      }
    }
  }, [groupSearchName]);

  useEffect(() => {
    if (!dialogOn) {
      setNotSelectGroupMemberList(groupMemberList.slice(0, 99));
      setSelectGroupMember([]);
      setSelectDisplayList([]);
    }
  }, [dialogOn]);

  useEffect(() => {
    if (setSelectMembers) {
      setSelectMembers(selectGroupMember);
    }
  }, [JSON.stringify(selectGroupMember)]);

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

  async function NotNull_handleValidation(value: string) {
    let msg = "";
    if (!value) {
      msg = System.getLocalization("Public", "ErrorMsgEmpty");
      return msg;
    }
  }

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

  return (
    <DraggableDialog open={dialogOn} style={{ width: "auto", height: "auto" }}>
      <Row>
        <Column
          style={{
            justifyContent: "flex-start",
          }}
        >
          <DialogTitle>
            <b>建立群組</b>
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
            <BtnCancel
              style={{
                backgroundColor: "white",
              }}
              childObject={
                <h4
                  className="fas fa-times"
                  style={{
                    color: "gray",
                  }}
                />
              }
              onClick={async () => {
                setDialogOn(false);
              }}
            />
          </Column>
        </DialogActions>
      </Row>
      <DialogContent>
        <Row>
          <Column>
            <Label bind={true} name="group_name">
              群組名稱
            </Label>
            <TextBox
              name="group_name"
              bind={true}
              handleValidation={NotNull_handleValidation}
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
        <BtnSave
          style={{
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          childObject={
            <i
              className="fas fa-check"
              title="建立群組"
              style={{
                color: "green",
              }}
            />
          }
        />
      </DialogActions>
    </DraggableDialog>
  );
}
