const log4js = require('log4js');

log4js.configure({
    appenders:{
        std: { type: "stdout", level: "all", layout:{type: "coloured", } },
        file: { type: 'dateFile', filename: 'log.log', pattern: '.yyyyMMdd', backups: 5, encoding: "utf-8", keepFileExt: true  }
    },
    categories: {
        default: {appenders: ["std"], level: "debug"},
        custom: {appenders: ["std", "file"], level: "all"}
    }
});

var logger = log4js.getLogger("custom")

module.exports = logger



