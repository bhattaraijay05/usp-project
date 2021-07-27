import React from "react";
import "./chat.css";

const Messages = ({ msg, userId }) => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent:
					msg.id === 0
						? "center"
						: msg.id === userId
						? "flex-end"
						: "flex-start",
				padding: 3,
			}}
		>
			<div
				style={{
					backgroundColor:
						msg.id === 0
							? "dodgerblue"
							: msg.id === userId
							? "#aede2e"
							: "#e0e0e0",
					width: 200,
					position: "relative",
				}}
				className="message"
			>
				<h5
					style={{
						color: msg.id === 0 ? "#fff" : "#000",
						marginLeft: 5,
						position: "absolute",
						marginTop: -3,
					}}
				>
					{msg.name.toUpperCase()}
				</h5>

				<p
					style={{
						color: msg.id === 0 ? "#fff" : "#000",
						marginLeft: 10,
					}}
				>
					{msg.message}
				</p>

				<h5
					style={{
						color: msg.id === 0 ? "#fff" : "#000",
						marginLeft: 2,
						position: "absolute",
						right: 3,
						bottom: -15,
					}}
				>
					{msg.time}
				</h5>
				{msg.image && (
					<img
						style={{
							width: 150,
							height: 150,
							backgroundColor: "transparent",
							padding: 20,
						}}
						src={msg.image.preview}
						alt={msg.name}
					/>
				)}
			</div>
		</div>
	);
};

export default Messages;
