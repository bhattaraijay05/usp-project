import React from "react";
import "./chat.css";

const Messages = ({ msg, userId }) => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: msg.id === userId ? "flex-end" : "flex-start",
				padding: 3,
			}}
		>
			<div
				style={{
					backgroundColor: msg.id === userId ? "#aede2e" : "#e0e0e0",
					width: 200,
					position: "relative",
				}}
				className="message"
			>
				<h5
					style={{
						color: "black",
						marginLeft: 5,
						position: "absolute",
						marginTop: -3,
					}}
				>
					{msg.name}
				</h5>

				<p
					style={{
						color: "black",
						marginLeft: 10,
					}}
				>
					{msg.message}
				</p>

				<h5
					style={{
						color: "black",
						marginLeft: 2,
						position: "absolute",
						right: 3,
						bottom: -15,
					}}
				>
					{msg.time}
				</h5>
			</div>
		</div>
	);
};

export default Messages;
