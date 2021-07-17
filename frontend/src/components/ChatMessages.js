import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import moment from "moment";

import "./chat.css";
import ImageLoadButton from "./ImageLoadButton";
import SendButton from "./SendButton";

const ENDPOINT = "http://localhost:3001";
const CONNECT = "connect";
const ADDUSER = "adduser";
const SENDMESSAGE = "send message";
const TYPING = "typing";
const USERJOINED = "user joined";
const USERLEFT = "user left";

var socket = io(ENDPOINT);

const ChatMessages = () => {
	const [image, setImage] = useState({ preview: "", raw: "" });
	const [imageDisplay, setImageDisplay] = useState("none");

	const hiddenFileInput = useRef(null);

	const messageRef = useRef(null);

	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = useState("");
	const [allMessages, setAllMessages] = useState([]);
	const [name, setName] = useState("");
	const [id, setId] = useState("");
	const [isUserSet, setIsUserSet] = useState(false);
	const [typing, setTyping] = useState("");
	const [newUser, setNewUser] = useState("");
	const [leftUser, setLeftUser] = useState("");

	useEffect(() => {
		socket.on(CONNECT, () => {
			setId(socket.id);
		});
	}, []);

	socket.on(USERLEFT, (data) => setLeftUser(data));

	useEffect(() => {
		socket.on(SENDMESSAGE, (msg) => {
			setAllMessages((messages) => [...messages, msg]);

			if (messageRef.current) {
				messageRef.current.scrollIntoView({
					behavior: "smooth",
				});
			}
		});
	}, []);

	socket.on(USERJOINED, (data) => {
		setNewUser(data.data.name);
	});

	const addUserToChat = () => {
		socket.emit(USERJOINED, { name: name, id: id });
		socket.emit(ADDUSER, { name: name, id: id });
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

	const sendMessage = () => {
		socket.emit(SENDMESSAGE, {
			id: id,
			message: message,
			name: name,
			time: moment().format("MM ddd, YYYY hh:mm:ss a"),
		});
		setMessage("");
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

	const sendMedia = () => {
		setImage({ preview: "", raw: "" });
		setImageDisplay("none");
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
					<input
						type="text"
						value={name}
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
							<div
								className="message"
								key={index}
								style={{
									float: msg.id === id ? "right" : "left",
									backgroundColor:
										msg.id === id ? "" : "#e0e0e0",
								}}
							>
								{msg.message}
								<span>{msg.time}</span>
							</div>
						))}
					</div>
					{typing}

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
								});
							}}
							onKeyUp={() => {
								setTimeout(() => {
									socket.emit(TYPING, {
										userName: name,
										typing: false,
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
