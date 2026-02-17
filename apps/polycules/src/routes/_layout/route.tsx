import { Anchor, Code, Container, Text, Title } from "@mantine/core";
import { createFileRoute, Outlet, type ErrorComponentProps } from "@tanstack/react-router"
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/_layout")({
	component: LayoutPage,
	errorComponent: ErrorBoundary,
})

function LayoutPage() {
	return (
		<Fragment>
			<Outlet />
			<Shortcuts />
		</Fragment>
	)
}

const Overlays = () => {
	return (
		<Fragment>
		</Fragment>
	);
};

const Shortcuts = () => {
	return null;
};

export function ErrorBoundary({ error, reset, info }: ErrorComponentProps) {
	let title = "";
	let codeContent = "";

	if (error instanceof Error) {
		title = error.message;
		codeContent = error.stack || "";
	} else {
		title = "Unknown Error";
		codeContent = String(error);
	}

	if (info?.componentStack) codeContent += `\n\nComponent Stack:\n${info.componentStack}`;

	return (
		<Container my="xl" size="sm" py="xl">
			<Title>
				Fuck
			</Title>

			<Text>
				The Application crashed! Please report the following error to the developers:
			</Text>

			<Text>
				{title}
			</Text>

			<Code block>
				{codeContent}
			</Code>

			<Anchor component="button" onClick={() => reset()} mt="md" display="block">
				Reset
			</Anchor>
		</Container>
	);
};
