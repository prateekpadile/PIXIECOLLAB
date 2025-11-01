const express = require('express');
const path = require('path');
const cors = require('cors');

const channelRouter = require('./Routes/channelRoutes');
const editorRouter = require('./Routes/editorRoutes');
const streamRouter = require('./Routes/streamingRoutes.js');
const projectRouter = require('./Routes/projectRoutes');
const videoRouter = require('./Routes/videoRoutes.js');
const oAuthRouter = require('./Routes/oauthRoute.js');
const chatRouter = require('./Routes/chatRoutes.js');

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};


app.use(cors(corsOptions));

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

io.listen(5505 || process.env.SocketPort);

io.on('connection', (socket) => {
  socket.on('join', ({ channelUsername, editorUsername, roomId }) => {
    if (!channelUsername || !editorUsername) return;
    socket.join(roomId);
    //emit another event fot the other client
    io.emit('joinAlso', { channelUsername, editorUsername, roomId });
    //handle that in other event handler
  });
  socket.on('finalJoin', ({ channelUsername, editorUsername, roomId }) => {
    if (!channelUsername || !editorUsername || roomId === null) return;
    socket.join(roomId);
  });
  socket.on(
    'sendMessage',
    ({ message, channelUsername, editorUsername, sender, roomId }) => {
      //broadcast the message event to all the client in the fetched room
      io.to(roomId).emit('addMessage', {
        message,
        channelUsername,
        editorUsername,
        sender,
      });
    }
  );
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/channel', channelRouter);
app.use('/editor', editorRouter);
app.use('/stream', streamRouter);
app.use('/project', projectRouter);

app.use('/video', videoRouter);
app.use('/youtube', oAuthRouter);
app.use('/chat', chatRouter);

module.exports = app;
