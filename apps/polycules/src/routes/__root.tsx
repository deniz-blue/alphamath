import { MantineProvider, ScrollArea } from "@mantine/core";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ComponentType, type PropsWithChildren } from "react";
import { queryClient } from "../query-client";
import { theme } from "../styles/theme";
import { MODALS } from "../modals";

export const Route = createRootRoute({
	component: RootPage,
});

export function RootPage() {
	return (
		<ProviderStack
			providers={[
				[MantineProvider, { forceColorScheme: "dark", theme }],
				[QueryClientProvider, { client: queryClient }],
				[ModalsProvider, {
					modals: MODALS,
					modalProps: {
						size: "xl",
						scrollAreaComponent: ScrollArea.Autosize,
					}
				}],
			]}
		>
			<Notifications />
			<Outlet />
		</ProviderStack>
	);
}

type ProviderEntry<T = any> = [ComponentType<T>, T];
interface ProviderStackProps<T extends ProviderEntry[]> extends PropsWithChildren {
	providers: [...T];
};
export const ProviderStack = <T extends ProviderEntry[]>({
	providers,
	children,
}: ProviderStackProps<T>) => {
	return (
		<>
			{providers.reduceRight((acc, [Provider, props]) => {
				return <Provider {...props}>{acc}</Provider>;
			}, children)}
		</>
	);
};
