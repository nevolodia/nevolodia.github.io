import React from 'react';
import '../css/link.css';

function Link(props: { link: string, children: React.ReactNode }) {
	const handleMouseDown = () => {
		// eslint-disable-next-line no-restricted-globals
		history.pushState(null, '', props.link);
	};

	const onClick = (e: React.MouseEvent) => {
		e.preventDefault();
	};

	return (
		<a
			className="link" href={props.link}
			onMouseDown={handleMouseDown}
			onClick={onClick}
		>
			{props.children}
		</a>
	);
}

export default Link;
