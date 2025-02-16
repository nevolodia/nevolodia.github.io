import React from 'react';
import ReactDOM from 'react-dom/client';
import _main from './pages/_main';
import './css/index.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<_main />
	</React.StrictMode>
);
