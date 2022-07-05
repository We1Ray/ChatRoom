import React, { useContext } from "react";
import {
  SystemContext,
  Column,
  Row,
  DraggableDialog,
  Label,
  BtnSave,
  BtnCancel,
  TextQryBox,
} from "../../resource/index";
import "ds-widget/dist/index.css";
import { DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Qry_chat_member from "./Qry_chat_member";

export default function Member_select_dialog({
  user,
  dialogOn,
  setDialogOn,
  setMemberName,
}) {
  const { System } = useContext(SystemContext);

  async function NotNull_handleValidation(value) {
    let msg = "";
    if (!value) {
      msg = System.getLocalization("Public", "ErrorMsgEmpty");
      return msg;
    }
  }
  return (
    <DraggableDialog open={dialogOn} style={{ width: "500px", height: "auto" }}>
      <Row>
        <Column
          style={{
            justifyContent: "flex-start",
          }}
        >
          <DialogTitle>建立聊天</DialogTitle>
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
            <Label bind={true} name="member">
              人員
            </Label>
            <TextQryBox
              maxLength={1000}
              bind={true}
              name="member"
              dialog={{
                window: Qry_chat_member,
                parameter: {
                  account_uid: user ? user.account_uid : null,
                },
                style: {
                  height: "500px",
                  width: "850px",
                },
              }}
              text={{
                name: "account_uid",
                disabled: true,
                visible: false,
              }}
              label={{
                name: "name",
                api: "/chat/qry_chat_name",
              }}
              handleValidation={NotNull_handleValidation}
              result={(value, disply) => {
                setMemberName(disply);
              }}
            />
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
              title="建立聊天室"
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
