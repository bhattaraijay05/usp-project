import React from "react";
import ChatMessages from "./components/ChatMessages";
import { io } from "socket.io-client";
const ENDPOINT = "https://chat-application-usp.herokuapp.com/";

var socket = io(ENDPOINT);

const App = () => {
	return (
		<div class="smartphone">
			<div className="screen">
				<ChatMessages socket={socket} />
			</div>
		</div>
	);
};

export default App;
