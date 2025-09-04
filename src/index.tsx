import React from 'react';
import ReactDOM from 'react-dom/client';
import _main from './pages/_main';

// Fonts
import '@fontsource/abril-fatface';
import '@fontsource/space-mono';
import '@fontsource/roboto-mono';

// Styles
import './css/background-animation.css';
import './css/index.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<_main />
	</React.StrictMode>
);
