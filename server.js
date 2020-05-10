const express=require('express');
const app=express();
const dotenv = require('dotenv');
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const socketio = require('socket.io')(http);


dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connected successfully'));

// socket.on('connection', (socket) => {
//     console.log('a user connected');
//   });

const authRoute = require('./routes/auth');
const sugRoute= require('./routes/sug');
const voteRoute=require('./routes/vote');

app.use(express.json());

app.use('/api/auth',authRoute);
app.use('/api/sug',sugRoute);
app.use('/api/vote',voteRoute);



http.listen(process.env.PORT,()=>console.log('Server up and running'))

// io.on("connection", (socket) => {
//   socket.on("recieve_message", (data) => {
//     console.log(data.option_id);
//     var total=10;
//     var result="All are fine";
//     socket.broadcast.emit("send_message",{total,result});
//   })
// });

socketio.on("connection", (userSocket) => {
  console.log("new device connected");
  userSocket.on("send_message", (data) => {
    console.log(data["message"]);
    userSocket.broadcast.emit("receive_message", data);
  });
});