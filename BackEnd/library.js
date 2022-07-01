const pg = require("pg");
const logger = require("./logger");

class library {
  queryConvert(parameterizedSql, params) {
    const [text] = Object.entries(params).reduce(
      ([sql, array, index], [key, value]) => [
        sql.replaceAll(
          "${" + `${key}` + "}",
          value === null ? null : `'${value}'`
        ),
        [...array, value],
        index + 1,
      ],
      [parameterizedSql, [], 1]
    );
    return { text };
  }

  async requestAPI(path, config, sql, parameter, res) {
    try {
      let pool = new pg.Pool(config);
      const client = await pool.connect();
      try {
        let result = await client.query(this.queryConvert(sql, parameter));
        if (res) {
          await res.send(result.rows);
        } else {
          return result.rows;
        }
      } catch (error) {
        console.error(path);
        logger.error(path, config, parameter, error);
        if (res) {
          await res.status(400).json({ error: error });
        } else {
          return { error: error };
        }
      } finally {
        client.release();
        pool.end();
      }
    } catch (err) {
      console.error(path);
      logger.error(path, config, parameter, err);
      if (res) {
        await res.status(400).json({ error: err });
      } else {
        return { error: err };
      }
    }
  }

  async executeAPI(path, config, sql, parameter, res) {
    try {
      let pool = new pg.Pool(config);
      const client = await pool.connect();
      if (Array.isArray(parameter)) {
        try {
          await client.query("BEGIN");
          let result = null;
          for (let index = 0; index < parameter.length; index++) {
            result = await client.query(
              this.queryConvert(sql, parameter[index])
            );
          }
          await client.query("COMMIT");
          if (res) {
            await res.send(result);
          } else {
            return result;
          }
        } catch (err) {
          console.error(path);
          logger.error(path, config, err);
          await client.query("ROLLBACK");
          if (res) {
            await res.status(400).json({ error: err });
          } else {
            return { error: err };
          }
        } finally {
          client.release();
          pool.end();
        }
      } else {
        try {
          await client.query("BEGIN");
          const result = await client.query(this.queryConvert(sql, parameter));
          await client.query("COMMIT");
          if (res) {
            await res.send(result);
          } else {
            return result;
          }
        } catch (err) {
          console.error(path);
          logger.error(path, config, err);
          await client.query("ROLLBACK");
          if (res) {
            await res.status(400).json({ error: err });
          } else {
            return { error: err };
          }
        } finally {
          client.release();
          pool.end();
        }
      }
    } catch (err) {
      console.error(path);
      logger.error(path, config, parameter, err);
      if (res) {
        await res.status(400).json({ error: err });
      } else {
        return { error: err };
      }
    }
  }

  async executeAPIs(path, config, executeList, res) {
    try {
      let pool = new pg.Pool(config);
      const client = await pool.connect();
      let result = null;
      await client.query("BEGIN");
      try {
        for (let index = 0; index < executeList.length; index++) {
          if (Array.isArray(executeList[index].parameter)) {
            for (let j = 0; j < executeList[index].parameter.length; j++) {
              result = await client.query(
                this.queryConvert(
                  executeList[index].sql,
                  executeList[index].parameter[j]
                )
              );
            }
          } else {
            result = await client.query(
              this.queryConvert(
                executeList[index].sql,
                executeList[index].parameter
              )
            );
          }
        }
        await client.query("COMMIT");
        if (res) {
          await res.send(result);
        } else {
          return result;
        }
      } catch (err) {
        console.error(path);
        logger.error(path, config, err);
        await client.query("ROLLBACK");
        if (res) {
          await res.status(400).json({ error: err });
        } else {
          return { error: err };
        }
      } finally {
        client.release();
        pool.end();
      }
    } catch (err) {
      console.error(path);
      logger.error(path, config, parameter, err);
      if (res) {
        await res.status(400).json({ error: err });
      } else {
        return { error: err };
      }
    }
  }

  uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }
}
const lib = new library();
module.exports = lib;
