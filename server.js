const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
const port = process.env.PORT || 3000;

var indexRouter = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

let clients = 0;
io.on('connection', function(socket){
  console.log('connected clients --->>',clients)
  socket.on("NewClient", function(){
    if(clients < 2){
      if(clients == 1 ){
        this.emit('CreatePeer');
      }
    }
    else
      this.emit('SessionActive')
    
    clients++;
  });
  
  socket.on('Offer', SendOffer)
  socket.on('Answer', SendAnswer)
  socket.on('disconnect', Disconnect)
})

function Disconnect(){
  if(clients > 0){
    clients--;
  }
}

function SendOffer(offer){
  this.broadcast.emit("BackOffer",offer);
}

function SendAnswer(data){
  this.broadcast.emit("BackAnswer",data);
}

http.listen(port, () => console.log(`Active on  ${port} port`))