import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from '@mantine/notifications';
import { MantineProvider, createTheme } from '@mantine/core';
import { ContextMenuProvider } from 'mantine-contextmenu';

import '@mantine/core/styles.css';
import 'mantine-contextmenu/styles.css';
import "./style.css";
import "@alan404/react-workspace/styles.css";

const theme = createTheme({
	fontFamily: "Lexend-VariableFont",
	components: {
		Tooltip: {
			defaultProps: {
				withArrow: true,
				color: "dark",
			},
			styles: {
				color: "var(--mantine-color-text)",
			},
		}
	},
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
	<MantineProvider forceColorScheme='dark' theme={theme}>
		<Notifications />
		<ModalsProvider>
			<ContextMenuProvider
				shadow="md"
				borderRadius="md">
				<App />
			</ContextMenuProvider>
		</ModalsProvider>
	</MantineProvider>
);
