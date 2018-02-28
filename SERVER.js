var express=require("express");
var app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

var server=require('http').Server(app);
var io=require('socket.io')(server);
var user_online_arr=[];
//Tao random color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



io.on("connection",function(socket){
	var color_username= getRandomColor();



	var side=Math.floor((Math.random() * 2) + 1);
	console.log(socket.id+ " vua ket noi");
	socket.on("client-send-username",function(data){
		if(user_online_arr.indexOf(data.username)>=0){

			socket.emit("server-send-login-failed");
			
		}
		else
		{
			var rand_ava=data.gender+Math.floor((Math.random()*5)+1);

			user_online_arr.push({username:data.username,gender:rand_ava});
			socket.username=data.username;
			console.log(data.gender);
			socket.emit("server-send-username",{username:data.username,gender:rand_ava});
			io.sockets.emit("server-send-userarr",user_online_arr);
			
		}
	});
	socket.on("user-send-mess",function(data){
				var currentdate = new Date().toLocaleString();
				io.sockets.emit("server-send-mess",{username:socket.username,mess:data,date:currentdate,s:side,color:color_username});
			});

	//Xoa userkhi disconnect
	socket.on("disconnect",function(){
		user_online_arr.splice(user_online_arr.indexOf(socket.username),1);
		io.sockets.emit("server-send-userarr",user_online_arr);
	});
});
	

  server.listen(process.env.PORT||8080);
 // server.listen(8080);
app.get("/",function(req,res){
	res.render("chatpage");
});
