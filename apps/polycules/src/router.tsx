import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from '@tanstack/react-router'

export const router = createRouter({
	routeTree,
	pathParamsAllowedCharacters: [":"],
});

export const AppRouter = () => (
	<RouterProvider router={router} />
);

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}

	interface StaticDataRouteOption {
		spaceless?: boolean;
	}
}
