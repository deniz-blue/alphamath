import { useGlobalTransformStore, Workspace } from "@alan404/react-workspace";
import { Affix, Anchor, Code, Container, Text, Title } from "@mantine/core";
import { createFileRoute, Outlet, type ErrorComponentProps } from "@tanstack/react-router"
import { Fragment } from "react/jsx-runtime";
import { useRenderer } from "../../lib/rendering/useRenderer";
import { useHotkeys } from "@mantine/hooks";
import { vec2 } from "@alan404/vec2";
import { WorkspaceInfo } from "../../components/WorkspaceInfo";

export const Route = createFileRoute("/_layout")({
	component: LayoutPage,
	errorComponent: ErrorBoundary,
})

function LayoutPage() {
	useRenderer();

	return (
		<Workspace>
			<Outlet />
			<Shortcuts />
			<Overlays />
		</Workspace>
	)
}

const Overlays = () => {
	return (
		<Fragment>
			<Affix>
				<Affix style={{ left: 20, bottom: 20, userSelect: "none", pointerEvents: "none" }}>
					<WorkspaceInfo />
				</Affix>
			</Affix>
		</Fragment>
	);
};

const Shortcuts = () => {
	useHotkeys([
		["v", () => useGlobalTransformStore.getState().reset()],
		["plus", () => useGlobalTransformStore.getState().changeScaleFrom(vec2(), 1.1)],
		["-", () => useGlobalTransformStore.getState().changeScaleFrom(vec2(), 0.9)],
	]);

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
