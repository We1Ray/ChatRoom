import React, { useContext, useEffect, useState } from "react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import "./Input.css";
import { CallApi, SystemContext } from "../../../../resource";
import { fileMessageProps, roomProps } from "../Chat/Chat";

interface inputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (event?: { preventDefault: () => void }) => void;
  sendFileMessage: (fileMessage: fileMessageProps) => Promise<void>;
  room: roomProps;
}

const Input: React.FC<inputProps> = ({
  message,
  setMessage,
  sendMessage,
  sendFileMessage,
  room,
}) => {
  const { System } = useContext(SystemContext);
  const [showPicker, setShowPicker] = useState(false);
  useEffect(() => {
    /**
     *
     * @param {MouseEvent} event
     */
    function checkClickOutside(event) {
      /** @type {HTMLElement} */
      // @ts-ignore
      const element = event.target;

      if (
        element.classList.contains("react-input-emoji--button") ||
        element.classList.contains("react-input-emoji--button--icon")
      ) {
        return;
      }

      setShowPicker(false);
    }

    document.addEventListener("click", checkClickOutside);

    return () => {
      document.removeEventListener("click", checkClickOutside);
    };
  }, []);

  function addEmoji(e: any) {
    let emoji = e.native;
    setMessage((prev) => prev + emoji);
  }

  /**
   *
   * @param {React.MouseEvent} event
   */
  function toggleShowPicker(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    setShowPicker((currentShowPicker) => !currentShowPicker);
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formData = new FormData();
    let files = e.target.files;
    for (let index = 0; index < e.target.files.length; index++) {
      formData.append(index.toLocaleString(), files[index], files[index].name);
    }
    formData.append("room_id", room.room_id);
    CallApi.ExecuteApi(
      System.factory.name,
      System.factory.ip + "/chat/upload_file",
      formData
    )
      .then(async (res) => {
        if (res.status === 200) {
          for (let index = 0; index < res.data.length; index++) {
            await sendFileMessage({
              file_id: res.data[index].file_id,
              name: res.data[index].name,
              type: res.data[index].type,
              url: res.data[index].url,
              path: res.data[index].path,
              size: res.data[index].size,
            });
          }
        } else {
          console.log(res);
        }
      })
      .catch((error) => {
        console.log("EROOR: Chat: /chat/upload_file");
        console.log(error);
      })
      .finally(() => {
        e.target.value = null;
      });
  };

  return (
    <form className="form">
      <textarea
        className="input"
        placeholder="Type a message..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={(event) => {
          event.key === "Enter"
            ? event.shiftKey
              ? setMessage((prev) => prev)
              : sendMessage(event)
            : null;
        }}
      />
      <div className="react-emoji">
        <div className="react-emoji-picker--container">
          {showPicker && (
            <div
              className="react-emoji-picker--wrapper"
              onClick={(evt) => evt.stopPropagation()}
            >
              <div className="react-emoji-picker">
                <Picker
                  onSelect={addEmoji}
                  native={true}
                  showPreview={false}
                  showSkinTones={false}
                />
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          className={`react-input-emoji--button${
            showPicker ? " react-input-emoji--button__show" : ""
          }`}
          onClick={toggleShowPicker}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="react-input-emoji--button--icon"
          >
            {/* eslint-disable-next-line max-len */}
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10" />
            {/* eslint-disable-next-line max-len */}
            <path d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0" />
          </svg>
        </button>
        <label className="fas fa-cloud-upload-alt upload">
          <input
            type="file"
            multiple={true}
            id="upload-button"
            style={{ display: "none" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleUpload(event)
            }
          />
        </label>
      </div>
      <button className="sendButton" onClick={(event) => sendMessage(event)}>
        <i className="fas fa-paper-plane" />
      </button>
    </form>
  );
};

export default Input;
