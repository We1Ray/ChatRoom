import React, { useContext, useEffect, useState } from "react";
import {
  SystemContext,
  Column,
  Row,
  DraggableDialog,
  CallApi,
  TextBox,
} from "../../../../resource";
import "ds-widget/dist/index.css";
import { Button, DialogActions, DialogContent } from "@material-ui/core";

export default function File_dialog({ dialogOn, setDialogOn, room }) {
  const { System } = useContext(SystemContext);
  const [fileList, setFileList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (dialogOn) {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/get_room_file_message",
        {
          room_id: room.room_id,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setFileList(res.data);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_file_message");
          console.log(error);
        });
    } else {
      setSearchValue("");
    }
  }, [dialogOn]);

  useEffect(() => {
    if (searchValue == "") {
      setDisplayList(fileList);
    } else {
      setDisplayList(
        fileList.filter((value) => value.name.includes(searchValue))
      );
    }
  }, [searchValue, JSON.stringify(fileList)]);

  return (
    <DraggableDialog
      open={dialogOn}
      style={{ width: "800px", height: "600px" }}
    >
      <Row>
        <Column
          style={{
            justifyContent: "flex-start",
          }}
          md={11}
        >
          <DialogActions>
            <em
              className="fas fa-search"
              style={{
                color: "rgb(197, 197, 197)",
                fontSize: "16px",
              }}
            />
            <TextBox
              result={(value) => {
                setSearchValue(value);
              }}
            />
          </DialogActions>
        </Column>
        <Column
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          md={1}
        >
          <DialogActions>
            <Button
              onClick={async () => {
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
          </DialogActions>
        </Column>
      </Row>
      <DialogContent>
        {displayList.length > 0 ? (
          <Row>
            {displayList.map((file, i) => (
              <Column lg="4" md="6">
                <div className="card" data-filter-group="code">
                  <div className="card-body text-center">
                    <a
                      className="px-4"
                      href={file.url + "/download"}
                      title={file.name}
                    >
                      <em className="fa-5x far fa-file-code text-green" />
                    </a>
                    <p>
                      <big className="text-dark">{file.name}</big>
                    </p>
                    <div className="d-flex m-0 text-muted">
                      <p>
                        {file.size > 1024
                          ? file.size > 1048576
                            ? file.size > 1073741824
                              ? Math.round(file.size / 1073741824) + "GB"
                              : Math.round(file.size / 1048576) + "MB"
                            : Math.round(file.size / 1024) + "KB"
                          : file.size + "B"}
                      </p>
                      <p className="ml-auto">{file.create_date}</p>
                    </div>
                  </div>
                </div>
              </Column>
            ))}
          </Row>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <big>
              <b>無分享任何檔案!</b>
            </big>
          </div>
        )}
      </DialogContent>
    </DraggableDialog>
  );
}
