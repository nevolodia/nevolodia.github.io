import React from 'react';
import '../css/link.css';

function Link(props: { link: string, children: React.ReactNode }) {
	return (
		<a className="link" href={props.link}>
			{props.children}
		</a>
	);
}

export default Link;