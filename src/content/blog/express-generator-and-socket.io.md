---
author: Josh Bicking
pubDatetime: 2017-07-30T00:00:00Z
title: Express Generator and Socket.io
postSlug: express-generator-and-socket.io
featured: false
draft: false
tags:
  - webdev
description: ""
---

A few months ago, I tried to start a Node project to further explore web development. [It's the LAN equivalent of a Jukebox](https://github.com/jibby0/lan-jukebox): people go to the site, add music from Youtube or a file, and the song is put into a queue. The server has a speaker, through which it plays each song. The basic elements of this include a playlist and media buttons, which are constantly changing as people add music and change the state of the player. This is a job for sockets. I used the Express Generator to start myself off. This tool gives you 4 basic pieces:

- `bin/www`, which starts the HTTP server.
- `app.js`, which starts Express, and connects to your routers.
- `routes/*.js`, which handle and display information depending on the URI.
- `views/*`, which display information to the browser.

Socket.io requires direct access to the HTTP server: otherwise, it can't filter out socket requests from other requests (things that Express needs to route).  Given that the HTTP server and Express starting were split up, this proposed a problem.

Originally, I fixed it by putting everything into one file. JavaScript is a mess, so why not solve a JavaScript problem with a mess, right? I couldn't stand that for more than a few minutes, so off I went to learn how to pass my Socket.io object correctly. Turns out, there isn't a fully functional, elegant way. But there is a way.

I came across a guide illustrating (what seemed like) exactly what I needed. I had to tweak it a bit. The process, in a nutshell, is:

- Move the starting of web server from `bin/www` to `app.js`.  - Expose the web server in `app.js`, so `bin/www` could have a reference to it.  - Start Socket.io in `app.js`, and connect it to the web server.  - Add the Socket.io reference to all routing requests, before they're sent to the router:

```javascript
app.use(function(req, res, next){
    res.io = io;
    next();
});
```

- Use the reference in get and post requests:

```javascript
router.get('/', function(req, res, next) {
    res.io.emit("socketToMe", "users");
    res.send("respond with a resource.");
});
```

However, this emitting of signals is all that's covered in the guide, and for a good reason: there's no way to listen to a socket inside these requests. I needed that to handle events such as Play/Pause button presses.

The workaround:

- Instead of adding `io` to your res object, put all of `routes/*.js` inside functions. Instead of an exports line at the bottom, return what you'd like to export:

```javascript
function (io) {
    // Require statements
    // get and post statements
    ...
    return router;
}
```

- From `app.js`, call all your route files with an argument including your Socket.io reference:
```javascript
var routes = require("./routes/index")(io);
```

So far, this seems to work for a little demonstration.
