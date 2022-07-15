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

interface pic {
  file_id: string;
  name: string;
  path: string;
  url: string;
  type: string;
  size: number;
  message_id: string;
  create_date: string;
}

export default function Pic_dialog({ dialogOn, setDialogOn, room }) {
  const { System } = useContext(SystemContext);
  const [picList, setPicList] = useState<pic[]>([]);
  const [displayList, setDisplayList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectPicDialogOn, setSelectPicDialogOn] = useState(false);
  const [selectPic, setSelectPic] = useState<pic>({
    file_id: null,
    name: null,
    path: null,
    url: null,
    type: null,
    size: null,
    message_id: null,
    create_date: null,
  });

  useEffect(() => {
    if (dialogOn) {
      CallApi.ExecuteApi(
        System.factory.name,
        System.factory.ip + "/chat/get_room_image_message",
        {
          room_id: room.room_id,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setPicList(res.data);
          }
        })
        .catch((error) => {
          console.log("EROOR: Chat: /chat/get_room_image_message");
          console.log(error);
        });
    } else {
      setSearchValue("");
    }
  }, [dialogOn]);

  useEffect(() => {
    if (searchValue == "") {
      setDisplayList(picList);
    } else {
      setDisplayList(
        picList.filter((value) => value.name.includes(searchValue))
      );
    }
  }, [searchValue, JSON.stringify(picList)]);

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
      <DraggableDialog open={selectPicDialogOn}>
        <DialogActions>
          <Button
            onClick={() => setSelectPicDialogOn(false)}
            style={{
              backgroundColor: "rgb(171, 219, 241)",
            }}
          >
            <i className="fas fa-times" />
          </Button>
        </DialogActions>
        <img
          src={selectPic.url + "/download"}
          title={selectPic.name}
          alt={selectPic.name}
        />
      </DraggableDialog>
      <DialogContent>
        {displayList.length > 0 ? (
          <Row>
            {displayList.map((pic, i) => (
              <Column lg="4" md="6">
                <div className="card" data-filter-group="code">
                  <div className="card-body text-center">
                    <div
                      className="px-4"
                      style={{ height: "100%" }}
                      onClick={() => {
                        setSelectPic(pic);
                        setSelectPicDialogOn(true);
                      }}
                    >
                      <img
                        src={pic.url + "/download"}
                        style={{ height: "100%", width: "100%" }}
                        alt={pic.name}
                        title={pic.name}
                      />
                    </div>
                    <p>
                      <big className="text-dark">{pic.name}</big>
                    </p>
                    <div className="d-flex m-0 text-muted">
                      <p>
                        {pic.size > 1024
                          ? pic.size > 1048576
                            ? pic.size > 1073741824
                              ? Math.round(pic.size / 1073741824) + "GB"
                              : Math.round(pic.size / 1048576) + "MB"
                            : Math.round(pic.size / 1024) + "KB"
                          : pic.size + "B"}
                      </p>
                      <p className="ml-auto">{pic.create_date}</p>
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
              <b>無分享任何圖片!</b>
            </big>
          </div>
        )}
      </DialogContent>
    </DraggableDialog>
  );
}
