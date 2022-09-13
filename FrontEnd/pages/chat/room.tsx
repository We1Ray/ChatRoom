import React from "react";
import { Column, Row } from "../../resource/index";
import "ds-widget/dist/index.css";
import { roomList } from "./chat";
import moment, { now } from "moment";

export default function Room({ roomList, setRoom, room }) {
  return (
    <>
      {roomList.map(function (object: roomList) {
        return (
          <li
            className="nav-item"
            onClick={() => {
              setRoom({
                room_name: object.room_name,
                room_id: object.room_id,
                is_group: object.is_group,
                room_member: object.room_member,
              });
            }}
            style={
              room
                ? room.room_id === object.room_id
                  ? {
                      backgroundColor: "#C0D0D3",
                    }
                  : {}
                : {}
            }
          >
            <a className="nav-link d-flex align-items-center">
              <p
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  verticalAlign: "middle",
                }}
              >
                <Column>
                  <Row>
                    <span
                      style={{
                        fontSize: "20px",
                        color: "#27397a",
                        fontFamily: "'Source Sans Pro', sans-serif",
                        fontWeight: "bold",
                      }}
                    >
                      {object.room_name}
                      {object.is_group === "Y"
                        ? "(" + object.room_member.length + ")"
                        : ""}
                    </span>

                    {object.last_d ? (
                      moment(now()).year() === moment(object.last_d).year() ? (
                        moment(now()).date() === moment(object.last_d).date() &&
                        moment(now()).month() ===
                          moment(object.last_d).month() ? (
                          <span
                            className="ml-auto "
                            style={{
                              color: "gray",
                              fontSize: "16px",
                            }}
                          >
                            {object.last_hm ? object.last_hm : ""}
                          </span>
                        ) : (
                          <span
                            className="ml-auto "
                            style={{
                              color: "gray",
                              fontSize: "16px",
                            }}
                          >
                            {moment(object.last_d).month() +
                              1 +
                              "/" +
                              moment(object.last_d).date()}
                          </span>
                        )
                      ) : (
                        <span
                          className="ml-auto "
                          style={{
                            color: "gray",
                            fontSize: "16px",
                          }}
                        >
                          {object.last_d}
                        </span>
                      )
                    ) : (
                      ""
                    )}
                  </Row>
                  <Row>
                    <span
                      style={{
                        color: "gray",
                        fontSize: "16px",
                      }}
                    >
                      {object.last_sender ? object.last_sender + ":" : ""}
                    </span>
                    &nbsp;
                    <span
                      style={{
                        color: "gray",
                        fontSize: "16px",
                      }}
                    >
                      {object.last_message
                        ? object.last_message.length > 10
                          ? object.last_message.substr(0, 9) + "..."
                          : object.last_message
                        : ""}
                    </span>
                    <span className="ml-auto badge badge-green">
                      {parseInt(object.not_read_message_count) > 0
                        ? object.not_read_message_count
                        : ""}
                    </span>
                  </Row>
                </Column>
              </p>
            </a>
          </li>
        );
      })}
    </>
  );
}
