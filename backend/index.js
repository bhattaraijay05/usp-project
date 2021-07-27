const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

app.use(cors());

const PORT = process.env.PORT || 3001;

const CONNECTION = "connection";
const DISCONNECT = "disconnect";
const TYPING = "typing";
const ADDUSER = "adduser";
const SENDMESSAGE = "send message";
const SENDIMAGE = "send image";

app.get("/", (req, res) => {
	res.send("Running");
});

io.on(CONNECTION, (socket) => {
	socket.on(ADDUSER, function ({ name, room }, callback) {
		const { error, user } = addUser({
			id: socket.id,
			name,
			room,
		});
		if (error) return callback(error);
		socket.join(user.room);
		socket.emit(SENDMESSAGE, {
			name: "Admin",
			message: `${user.name}, welcome to room ${user.room}.`,
			id: 0,
			time: "Welcome",
		});
		socket.broadcast.to(user.room).emit(SENDMESSAGE, {
			name: "Admin",
			message: `${user.name} has joined!`,
			id: 0,
			time: "Welcome",
		});

		io.to(user.room).emit("roomData", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});
	});

	socket.on(TYPING, (data) => {
		socket.broadcast.to(data.room).emit(TYPING, data);
	});

	socket.on(SENDMESSAGE, (data) => {
		const user = getUser(socket.id);
		io.to(user.room).emit(SENDMESSAGE, data);
	});

	//send image using socket
	socket.on(SENDIMAGE, (data) => {
		const user = getUser(socket.id);
		io.to(user.room).emit(SENDIMAGE, data);
	});

	socket.on(DISCONNECT, () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit(SENDMESSAGE, {
				name: "Admin",
				message: `${user.name} has left!`,
				id: 0,
				time: "Bye",
			});
			io.to(user.room).emit("roomData", {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		}
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
