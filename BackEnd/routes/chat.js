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

  await lib.executeSQL(
    "/get_userInfo",
    DBConfig,
    sql,
    {
      token: req.body["access_token"] ? req.body["access_token"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_roomList_info").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_roomList_info.sql"))
    .toString();

  await lib.executeSQL(
    "/get_roomList_info",
    DBConfig,
    sql,
    {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/qry_memberList").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/qry_memberList.sql"))
    .toString();

  await lib.executeSQL(
    "/qry_memberList",
    DBConfig,
    sql,
    {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
      searchAccount: req.body["searchAccount"]
        ? req.body["searchAccount"]
        : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/qry_chat_name").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/qry_chat_name.sql"))
    .toString();

  await lib.executeSQL(
    "/qry_chat_name",
    DBConfig,
    sql,
    {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_groupMemberList").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_groupMemberList.sql")
    )
    .toString();

  await lib.executeSQL(
    "/get_groupMemberList",
    DBConfig,
    sql,
    {
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_message.sql"))
    .toString();

  await lib.executeSQL(
    "/get_message",
    DBConfig,
    sql,
    {
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_room_current_messages").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_current_messages.sql")
    )
    .toString();

  await lib.executeSQL(
    "/get_room_current_messages",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_room_scroll_up_messages").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_scroll_up_messages.sql")
    )
    .toString();

  await lib.executeSQL(
    "/get_room_scroll_up_messages",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_room_scroll_down_messages").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_scroll_down_messages.sql")
    )
    .toString();

  await lib.executeSQL(
    "/get_room_scroll_down_messages",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_message_state").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/get_message_state.sql"))
    .toString();

  await lib.executeSQL(
    "/get_message_state",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      message_id: req.body["message_id"] ? req.body["message_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_room_search_keyword").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_search_keyword.sql")
    )
    .toString();

  await lib.executeSQL(
    "/get_room_search_keyword",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      keyWord: req.body["keyWord"] ? req.body["keyWord"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_room_keyword_seq_messages").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_keyword_seq_messages.sql")
    )
    .toString();

  await lib.executeSQL(
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
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_room_image_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_image_message.sql")
    )
    .toString();

  await lib.executeSQL(
    "/get_room_image_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_room_file_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_file_message.sql")
    )
    .toString();

  await lib.executeSQL(
    "/get_room_file_message",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/get_room_group_member").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/get_room_group_member.sql")
    )
    .toString();

  await lib.executeSQL(
    "/get_room_group_member",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/create_room").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let create_room_sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/create_room.sql"))
    .toString();
  let insert_room_member_sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/insert_room_member.sql"))
    .toString();

  let list = [
    {
      sql: create_room_sql,
      parameter: {
        room_id: req.body["room_id"] ? req.body["room_id"] : null,
        room_name: req.body["room_name"] ? req.body["room_name"] : null,
        is_group: req.body["is_group"] ? req.body["is_group"] : null,
        create_user: req.body["create_user"] ? req.body["create_user"] : null,
      },
    },
  ];

  let member = req.body["room_member"] ? req.body["room_member"] : [];
  for (let index = 0; index < member.length; index++) {
    list.push({
      sql: insert_room_member_sql,
      parameter: {
        room_id: req.body["room_id"] ? req.body["room_id"] : null,
        room_member: member[index],
        create_user: req.body["create_user"] ? req.body["create_user"] : null,
      },
    });
  }

  await lib.executeSQLs(
    "/create_room",
    DBConfig,
    list,
    (response) => {
      res.send(response);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/insert_room_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/insert_room_message.sql")
    )
    .toString();
  await lib.executeSQL(
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
    (response) => {
      res.send(response);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/insert_message_have_read").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/insert_message_have_read.sql")
    )
    .toString();
  await lib.executeSQL(
    "/insert_message_have_read",
    DBConfig,
    sql,
    {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      account_uid: req.body["account_uid"] ? req.body["account_uid"] : null,
    },
    (response) => {
      res.send(response);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/update_room_group_info").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let update_room_group_info_sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/update_room_group_info.sql")
    )
    .toString();

  let delete_chat_room_member_sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/delete_chat_room_member.sql")
    )
    .toString();

  let insert_room_member_sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/insert_room_member.sql"))
    .toString();

  let room_member_array = req.body["room_member"]
    ? req.body["room_member"]
    : null;
  let room_member = "";

  let list = [
    {
      sql: update_room_group_info_sql,
      parameter: {
        room_name: req.body["room_name"] ? req.body["room_name"] : null,
        create_user: req.body["account_uid"] ? req.body["account_uid"] : null,
        room_id: req.body["room_id"] ? req.body["room_id"] : null,
      },
    },
  ];

  for (let index = 0; index < room_member_array.length; index++) {
    room_member += room_member_array[index] + ",";
    list.push({
      sql: insert_room_member_sql,
      parameter: {
        room_id: req.body["room_id"] ? req.body["room_id"] : null,
        room_member: room_member_array[index],
        create_user: req.body["account_uid"] ? req.body["account_uid"] : null,
      },
    });
  }

  if (room_member.length > 0) {
    room_member = room_member.substring(0, room_member.length - 1);
  }

  list.push({
    sql: delete_chat_room_member_sql,
    parameter: {
      room_id: req.body["room_id"] ? req.body["room_id"] : null,
      room_member: room_member,
    },
  });

  await lib.executeSQLs(
    "/update_room_group_info",
    DBConfig,
    list,
    (response) => {
      res.send(response);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

router.route("/upload_file").post(async (req, res) => {
  try {
    let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
    let sql = fs
      .readFileSync(path.resolve(__dirname, "../sql/file/insert_file.sql"))
      .toString();

    const server = new Server({
      basicAuth: { username: "dsit.rd", password: "deanshoes.dsit.rd" },
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
      await lib.executeSQL(
        "/insert_file",
        DBConfig,
        sql,
        fileInfo,
        null,
        (error) => {
          res.status(400).json({ error: error });
        }
      );
    }
    res.send(filelink);
  } catch (error) {
    console.log(error);
  }
});

router.route("/retract_message").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let update_retract_message_sql = fs
    .readFileSync(
      path.resolve(__dirname, "../sql/chat/update_retract_message.sql")
    )
    .toString();
  let delete_file_sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/chat/delete_file.sql"))
    .toString();
  let file = req.body["file_id"] ? req.body["file_id"] : null;
  if (file) {
    const server = new Server({
      basicAuth: { username: "dsit.rd", password: "deanshoes.dsit.rd" },
      url: "http://10.1.1.231/",
    });
    const client = new Client(server);
    let path = req.body["path"] ? req.body["path"] : null;
    await client.deleteFile(path);

    await lib.executeSQLs(
      "/retract_message",
      DBConfig,
      [
        {
          sql: update_retract_message_sql,
          parameter: {
            message_content: req.body["message_content"]
              ? req.body["message_content"]
              : null,
            room_id: req.body["room_id"] ? req.body["room_id"] : null,
            message_id: req.body["message_id"] ? req.body["message_id"] : null,
          },
        },
        {
          sql: delete_file_sql,
          parameter: {
            file_id: req.body["file_id"] ? req.body["file_id"] : null,
          },
        },
      ],
      (response) => {
        res.send(response);
      },
      (error) => {
        res.status(400).json({ error: error });
      }
    );
  } else {
    await lib.executeSQL(
      "/retract_message",
      DBConfig,
      update_retract_message_sql,
      {
        message_content: req.body["message_content"]
          ? req.body["message_content"]
          : null,
        room_id: req.body["room_id"] ? req.body["room_id"] : null,
        message_id: req.body["message_id"] ? req.body["message_id"] : null,
      },
      (response) => {
        res.send(response);
      },
      (error) => {
        res.status(400).json({ error: error });
      }
    );
  }
});

module.exports = router;
