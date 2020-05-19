const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http").createServer(app);
const mongoose = require("mongoose");
const socketio = require("socket.io")(http);
const vote=require('./controllers/vote');

dotenv.config();
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false },
  () => console.log("connected successfully")
);

// socket.on('connection', (socket) => {
//     console.log('a user connected');
//   });

const authRoute = require("./routes/auth");
const sugRoute = require("./routes/sug");
const voteRoute = require("./routes/vote");

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/sug", sugRoute);
app.use("/api/vote", voteRoute);

http.listen(process.env.PORT, () => console.log("Server up and running"));

// io.on("connection", (socket) => {
//   socket.on("recieve_message", (data) => {
//     console.log(data.option_id);
//     var total=10;
//     var result="All are fine";
//     socket.broadcast.emit("send_message",{total,result});
//   })
// });

/*socketio.on("connection", (userSocket) => {
  console.log("new device connected");
  userSocket.on("casted", (data) => {
    console.log(data);
    //console.log(data["message"]);
    vote.castingVote(data,callback).then(ok=>{
      if(ok){
        userSocket.broadcast.emit("updated_data",ok);
      }
      else{
        console.log('Something went wrong!');
      }
    }).catch(err=>{
      console.log(err);
    }
    );
  });
});*/

socketio.on("connection", (userSocket) => {
  console.log("new device connected");
  userSocket.on("casted", (data) => {
    //console.log(data["message"]);
  
    vote.castingVote(data,function(res){
      console.log(res);
      if(res){
          console.log(res);
          socketio.emit("updated_data",res);
      } else {
        console.log('Something went wrong!');
      }
    });
  });
});
