import React from 'react';
import '../css/link.css';


function Link(props: { link: string, a_style?: boolean, children: React.ReactNode }) {
	const { a_style = false, link, children } = props;
	const handleMouseDown = () => {
		// eslint-disable-next-line no-restricted-globals
		history.pushState(null, '', props.link);
	};

	const onClick = (e: React.MouseEvent) => {
		e.preventDefault();
	};

	return (
		<a
			className={`link ${a_style ? "a-style-link" : "standard-style-link"}`}
			href={link}
			onMouseDown={handleMouseDown}
			onClick={onClick}
		>
			{children}
		</a>
	);
}

export default Link;
