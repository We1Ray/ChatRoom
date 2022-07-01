const express = require("express");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

const routes = [
  { src: "/login", dest: "/pages/login" },
  { src: "/register", dest: "/pages/register" },
  { src: "/recover", dest: "/pages/recover" },
  { src: "/lock", dest: "/pages/lock" },
  { src: "/notfound", dest: "/pages/notfound" },
  { src: "/error500", dest: "/pages/error500" },
  { src: "/maintenance", dest: "/pages/maintenance" },
  { src: "/forum", dest: "/forum/categories" },
  { src: "/forum/topics/:catid", dest: "/forum/topics" },
  {
    src: "/forum/discussion/:catid/:topid",
    dest: "/forum/discussion",
  },
];

app
  .prepare()
  .then(() => {
    const server = express();

    routes.forEach((r) =>
      server.get(r.src, (req, res) => app.render(req, res, r.dest, req.params))
    );

    server.get("*", (req, res) => handle(req, res));

    server.listen(port);

    console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
  })
  .catch((e) => console.log(e));

const XMLHttpRequest = require("xmlhttprequest-ssl");
global.XMLHttpRequest = XMLHttpRequest;
