const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");
const Server = require("nextcloud-node-client").Server;
const Client = require("nextcloud-node-client").Client;
const utf8 = require("utf8");

router.route("/hello").get(async (req, res) => {
  try {
    res.send("hello!");
  } catch (error) {
    console.log(error);
  }
});

router.route("/get_userInfo").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_userInfo.sql"))
    .toString();

  await lib.requestAPI(
    "/get_userInfo",
    DBConfig,
    sql,
    {
      token: req.body["access_token"] ? req.body["access_token"] : null,
    },
    res
  );
});

router.route("/get_roomList_info").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_roomList_info.sql"))
    .toString();

  await lib.requestAPI(
    "/get_roomList_info",
    DBConfig,
    sql,
    {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    res
  );
});

router.route("/qry_memberList").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/qry_memberList.sql"))
    .toString();

  await lib.requestAPI(
    "/qry_memberList",
    DBConfig,
    sql,
    {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
      searchAccount: req.body["searchAccount"]
        ? req.body["searchAccount"]
        : null,
    },
    res
  );
});

router.route("/qry_chat_name").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/qry_chat_name.sql"))
    .toString();

  await lib.requestAPI(
    "/qry_chat_name",
    DBConfig,
    sql,
    {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    res
  );
});

router.route("/get_groupMemberList").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_groupMemberList.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_groupMemberList",
    DBConfig,
    sql,
    {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    res
  );
});

router.route("/get_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_message.sql"))
    .toString();

  await lib.requestAPI(
    "/get_message",
    DBConfig,
    sql,
    {
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    res
  );
});

router.route("/get_room_current_messages").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_current_messages.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_current_messages",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    },
    res
  );
});

router.route("/get_room_scroll_up_messages").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_scroll_up_messages.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_scroll_up_messages",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    res
  );
});

router.route("/get_room_scroll_down_messages").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_scroll_down_messages.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_scroll_down_messages",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    res
  );
});

router.route("/get_message_state").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_message_state.sql"))
    .toString();

  await lib.requestAPI(
    "/get_message_state",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    res
  );
});

router.route("/get_room_search_keyword").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_search_keyword.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_search_keyword",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      keyWord: req.body["keyWord"] ? req.body["keyWord"] : null,
    },
    res
  );
});

router.route("/get_room_keyword_seq_messages").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_keyword_seq_messages.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_keyword_seq_messages",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
      current_firsy_message_id: req.body["current_firsy_message_id"]
        ? req.body["current_firsy_message_id"]
        : null,
    },
    res
  );
});

router.route("/get_room_image_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_image_message.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_image_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    },
    res
  );
});

router.route("/get_room_file_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_file_message.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_file_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    },
    res
  );
});

router.route("/get_room_group_member").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_group_member.sql")
    )
    .toString();

  await lib.requestAPI(
    "/get_room_group_member",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    },
    res
  );
});

router.route("/create_room").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/create_room.sql"))
    .toString();
  await lib.requestAPI(
    "/create_room",
    DBConfig,
    sql,
    {
      room_member: req.body["room_member"] ? req.body["room_member"] : null,
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      room_name: req.body["room_name"] ? req.body["room_name"] : null,
      is_group: req.body["is_group"] ? req.body["is_group"] : null,
      create_user: req.body["create_user"] ? req.body["create_user"] : null,
    },
    res
  );
});

router.route("/insert_room_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/insert_room_message.sql")
    )
    .toString();
  await lib.requestAPI(
    "/insert_room_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
      message_type: req.body["message_type"] ? req.body["message_type"] : null,
      message_content: req.body["message_content"]
        ? req.body["message_content"]
        : null,
      send_member: req.body["send_member"] ? req.body["send_member"] : null,
      file_id: req.body["file_id"] ? req.body["file_id"] : null,
      reply_message_id: req.body["reply_message_id"]
        ? req.body["reply_message_id"]
        : null,
    },
    res
  );
});

router.route("/update_message_read").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/update_message_read.sql")
    )
    .toString();
  await lib.requestAPI(
    "/update_message_read",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    res
  );
});

router.route("/update_room_group_info").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/update_room_group_info.sql")
    )
    .toString();
  await lib.requestAPI(
    "/update_room_group_info",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      room_name: req.body["room_name"] ? req.body["room_name"] : null,
      room_member: req.body["room_member"] ? req.body["room_member"] : null,
    },
    res
  );
});

router.route("/upload_file").post(async (req, res) => {
  try {
    let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
    let sql = fs
      .readFileSync(path.resolve(__dirname, "../sql/file/insert_file.sql"))
      .toString();

    const server = new Server({
      basicAuth: { password: "deanshoes.dsit.rd", username: "dsit.rd" },
      url: "http://10.1.1.231/",
    });
    const client = new Client(server);
    const folder = await client.createFolder(
      "/ChatRoom/" + req.body["room_id"]
    );
    let filelink = [];
    for (let index = 0; index < Object.keys(req.files).length; index++) {
      let sourceFileName = utf8.decode(req.files[index.toLocaleString()].name);
      let fileName = sourceFileName;
      let exits_file = true;
      let exits_count = 0;
      while (exits_file) {
        if (await folder.getFile(fileName)) {
          exits_count++;
          fileName = "(" + exits_count + ")" + sourceFileName;
        } else {
          exits_file = false;
        }
      }

      const file = await folder.createFile(
        fileName,
        req.files[index.toLocaleString()].data
      );
      const share = await client.createShare({ fileSystemElement: file });
      const shareLink = share.url;

      let fileInfo = {
        file_id: "file-" + lib.uuid(),
        name: sourceFileName,
        path: req.body["room_id"]
          ? "/ChatRoom/" + req.body["room_id"] + "/" + fileName
          : "/ChatRoom/" + fileName,
        url: shareLink,
        type: req.files[index.toLocaleString()].mimetype,
        size: req.files[index.toLocaleString()].size,
      };
      filelink.push(fileInfo);
      await lib.requestAPI("/insert_file", DBConfig, sql, fileInfo, null);
    }

    res.send(filelink);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
