import React from "react";
import "./send.css";

const SendButton = ({ onClick }) => {
	return (
		<div className="btn-send" onClick={onClick}>
			<svg viewBox="0 0 74.433 60.908" width={25} height={25}>
				<path
					fill="#fff"
					d="M 0 0 L 74.22 26.562 L 0.246 60.712 L 7.608 34.535 L 27.831 28.259 L 6.91 25.469 L 0 0 Z"
				/>
			</svg>
		</div>
	);
};

export default SendButton;
