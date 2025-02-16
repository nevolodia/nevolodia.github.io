import React from 'react';
import '../css/link.css';

function Link(props: { link: string, children: React.ReactNode }) {
	const handleMouseDown = () => {
		window.location.href = props.link;
	};

	return (
		<a
			className="link" href={props.link}
			onMouseDown={handleMouseDown}
		>
			{props.children}
		</a>
	);
}

export default Link;
