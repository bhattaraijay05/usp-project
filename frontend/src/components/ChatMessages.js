import React, { useRef, useState, useEffect } from "react";

import moment from "moment";

import "./chat.css";
import ImageLoadButton from "./ImageLoadButton";
import SendButton from "./SendButton";
import Messages from "./Messages";

const CONNECT = "connect";
const ADDUSER = "adduser";
const SENDMESSAGE = "send message";
const TYPING = "typing";
const SENDIMAGE = "send image";
const rooms = ["Gaming", "Science", "Programming", "Movie"];

const ChatMessages = ({ socket }) => {
	const [image, setImage] = useState({ preview: "", raw: "" });
	const [imageDisplay, setImageDisplay] = useState("none");

	const hiddenFileInput = useRef(null);

	const messageRef = useRef(null);

	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = useState("");
	const [allMessages, setAllMessages] = useState([]);
	const [name, setName] = useState("");
	const [room, setRoom] = useState(rooms[0]);
	const [id, setId] = useState("");
	const [isUserSet, setIsUserSet] = useState(false);
	const [typing, setTyping] = useState("");

	useEffect(() => {
		socket.on(CONNECT, () => {
			setId(socket.id);
		});
	}, []);

	useEffect(() => {
		socket.on(SENDMESSAGE, (msg) => {
			setAllMessages((messages) => [...messages, msg]);
			if (messageRef.current) {
				messageRef.current.scrollIntoView({
					behavior: "smooth",
				});
			}
		});
		socket.on(SENDIMAGE, (msg) => {
			setAllMessages((messages) => [...messages, msg]);
			if (messageRef.current) {
				messageRef.current.scrollIntoView({
					behavior: "smooth",
				});
			}
		});
	}, []);

	const addUserToChat = () => {
		socket.emit(ADDUSER, { name, id, room }, (error) => {
			if (error) {
				alert(error);
			}
		});
		setOpen(true);
		setIsUserSet(true);
	};

	useEffect(() => {
		socket.on(TYPING, (data) => {
			data.typing === true
				? setTyping(`${data.userName} is typing...`)
				: setTyping("");
		});
	}, []);

	const sendImage = () => {
		socket.emit(SENDIMAGE, {
			id: id,
			image: image,
			name: name,
			time: moment().format("MM ddd, YYYY hh:mm:ss a"),
		});
	};

	const sendingMessage = () => {
		socket.emit(SENDMESSAGE, {
			id: id,
			message: message,
			name: name,
			time: moment().format("MM ddd, YYYY hh:mm:ss a"),
		});
	};

	const sendMessage = () => {
		message !== "" && sendingMessage();
		image.preview !== "" && sendImage();
		setMessage("");
		setImage({ preview: "", raw: "" });
		setImageDisplay("none");
	};

	useEffect(() => {
		if (messageRef.current) {
			messageRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [message]);

	const handleClick = (event) => {
		hiddenFileInput.current.click();
	};

	const handleChange = (e) => {
		if (e.target.files.length) {
			setImage({
				preview: URL.createObjectURL(e.target.files[0]),
				raw: e.target.files[0],
			});
			setImageDisplay("block");
		}
	};

	return (
		<>
			{!isUserSet && (
				<div
					style={{
						flex: 1,
						display: "flex",
						width: "100%",
						height: "100%",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<img
						src="/logo.png"
						style={{
							width: "100px",
							height: "100px",
							position: "absolute",
							bottom: "60vh",
						}}
					/>

					<label for="room">Choose a room:</label>
					<select
						name="room"
						id="room"
						onChange={(e) => setRoom(e.target.value)}
					>
						{rooms.map((room, i) => (
							<option value={room} key={i}>
								{room}
							</option>
						))}
					</select>
					<div style={{ padding: "10px" }} />
					<input
						type="text"
						value={name}
						placeholder="Your name"
						style={{ padding: "10px" }}
						onChange={(e) => setName(e.target.value)}
						onKeyPress={(event) => {
							if (event.key === "Enter") {
								{
									addUserToChat();
								}
							}
						}}
					/>

					<div style={{ marginTop: 10 }} />

					<button
						onClick={addUserToChat}
						disabled={name === "" ? true : false}
						style={{
							color: "#00f",
							border: "none",
							padding: 10,
							cursor: "pointer",
							borderRadius: 15,
							fontSize: 18,
						}}
					>
						Enter Chat
					</button>
				</div>
			)}

			{isUserSet && (
				<>
					<div className="chat">
						{allMessages.map((msg, index) => (
							<Messages msg={msg} userId={id} key={index} />
						))}
						<span ref={messageRef} style={{ float: "top" }} />
					</div>
					<div
						style={{
							position: "absolute",
							bottom: 50,
							left: 8,
						}}
					>
						{typing}
					</div>

					{image && (
						<div
							style={{
								position: "absolute",
								top: 200,
								left: 500,
								display: imageDisplay,
							}}
						>
							<img
								src={image.preview}
								style={{ width: 100, height: 100 }}
							/>
						</div>
					)}

					<div className="input">
						<input
							type="text"
							placeholder="Write message"
							value={message}
							onChange={(e) => {
								setMessage(e.target.value);
							}}
							onKeyDown={() => {
								socket.emit(TYPING, {
									userName: name,
									typing: true,
									room,
								});
							}}
							onKeyUp={() => {
								setTimeout(() => {
									socket.emit(TYPING, {
										userName: name,
										typing: false,
										room,
									});
								}, 3000);
							}}
							onKeyPress={(event) => {
								if (event.key === "Enter") {
									{
										sendMessage();
									}
								}
							}}
						/>
					</div>
					<SendButton onClick={sendMessage} />
					<ImageLoadButton onClick={handleClick} />

					<input
						type="file"
						id="upload-button"
						style={{ display: "none" }}
						onChange={handleChange}
						ref={hiddenFileInput}
					/>
				</>
			)}
		</>
	);
};

export default ChatMessages;
