const pg = require("pg");
const logger = require("./logger");

class library {
  queryConvert(parameterizedSql, params) {
    const [text] = Object.entries(params).reduce(
      ([sql, array, index], [key, value]) => [
        sql.replaceAll(
          "${" + `${key}` + "}",
          value === null
            ? null
            : (value[0] === "'" && value[value.length - 1] === "'") ||
                (value[0] == '"' && value[value.length - 1] === '"'
                  ? value
                  : `'${value}'`)
        ),
        [...array, value],
        index + 1,
      ],
      [parameterizedSql, [], 1]
    );
    return { text };
  }

  async executeSQL(path, config, sql, parameter, callback, errorCallback) {
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
          if (callback) {
            await callback(result);
          } else {
            return result;
          }
        } catch (err) {
          console.error(path, config);
          logger.error(path, config, sql, parameter, err);
          await client.query("ROLLBACK");
          if (errorCallback) {
            await errorCallback({ error: err });
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
          if (callback) {
            await callback(result);
          } else {
            return result;
          }
        } catch (err) {
          console.error(path, config);
          logger.error(path, config, sql, parameter, err);
          await client.query("ROLLBACK");
          if (errorCallback) {
            await errorCallback({ error: err });
          } else {
            return { error: err };
          }
        } finally {
          client.release();
          pool.end();
        }
      }
    } catch (err) {
      console.error(path, config);
      logger.error(path, config, sql, parameter, err);
      if (errorCallback) {
        await errorCallback({ error: err });
      } else {
        return { error: err };
      }
    }
  }

  async executeSQLs(path, config, executeList, callback, errorCallback) {
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
        if (callback) {
          await callback(result);
        } else {
          return result;
        }
      } catch (err) {
        console.error(path, config);
        logger.error(path, config, executeList, err);
        await client.query("ROLLBACK");
        if (errorCallback) {
          await errorCallback({ error: err });
        } else {
          return { error: err };
        }
      } finally {
        client.release();
        pool.end();
      }
    } catch (err) {
      console.error(path, config);
      logger.error(path, config, executeList, err);
      if (errorCallback) {
        await errorCallback({ error: err });
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
