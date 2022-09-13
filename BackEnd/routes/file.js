const DataBaseInfo = require("../DataBaseInfo.json");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const lib = require("../library");

router.route("/get_file").post(async (req, res) => {
  let DBConfig = req.headers.factory ? DataBaseInfo[req.headers.factory] : {};
  let sql = fs
    .readFileSync(path.resolve(__dirname, "../sql/file/get_file.sql"))
    .toString();

  await lib.executeSQL(
    "/get_file",
    DBConfig,
    sql,
    {
      file_id: req.body["file_id"] ? req.body["file_id"] : null,
    },
    (response) => {
      res.send(response.rows);
    },
    (error) => {
      res.status(400).json({ error: error });
    }
  );
});

module.exports = router;
