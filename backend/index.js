const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

app.use(cors());

const PORT = process.env.PORT || 3001;

const CONNECTION = "connection";
const DISCONNECT = "disconnect";
const TYPING = "typing";
const ADDUSER = "adduser";
const SENDMESSAGE = "send message";
const USERJOINED = "user joined";
const USERLEFT = "user left";

var users = [];

var userCount = 0;

app.get("/", (req, res) => {
	res.send("Running");
});

io.on(CONNECTION, (socket) => {
	socket.on(ADDUSER, function (data) {
		users.push(data);
		socket.once(DISCONNECT, function () {
			var pos = users.indexOf(data);
			if (pos >= 0) users.splice(pos, 1);
		});
	});

	socket.on(TYPING, (data) => {
		if (data.typing == true) {
			socket.broadcast.emit(TYPING, data);
		} else {
			socket.broadcast.emit(TYPING, data);
		}
	});

	socket.on(USERJOINED, (data) => {
		socket.userName = data.name;
		userCount++;
		socket.broadcast.emit(USERJOINED, { data: data, userCount: userCount });
	});

	socket.on(SENDMESSAGE, (data) => {
		io.emit(SENDMESSAGE, data);
	});

	socket.on(DISCONNECT, () => {
		userCount--;
		socket.broadcast.emit(USERLEFT, socket.userName);
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
