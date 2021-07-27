import React from "react";
import ChatMessages from "./components/ChatMessages";
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:3001";

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
