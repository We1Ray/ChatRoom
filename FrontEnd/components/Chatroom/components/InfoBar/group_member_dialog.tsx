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
} from "../../../../resource/";
import "ds-widget/dist/index.css";
import { DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

interface groupMember {
  account_uid: string;
  name: string;
}

export default function Group_member_dialog({
  dialogOn,
  setDialogOn,
  setGroupSearchName,
  notSelectGroupMemberList,
  selectGroupMember,
  setSelectGroupMember,
}) {
  const { System } = useContext(SystemContext);
  const [selectDisplayList, setSelectDisplayList] = useState<groupMember[]>([]);

  useEffect(() => {
    setSelectDisplayList([]);
  }, [dialogOn]);

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
          <DialogTitle>建立群組</DialogTitle>
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
