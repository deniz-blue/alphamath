import { create } from "zustand";

const DefaultGraphTheme = {
	nodeSize: 48,
	nodeColor: "#4c5155",
	nodePadding: 4,

	primaryTextColor: "#ffffff",
	primaryTextSize: 14,

	secondaryTextColor: "#cccccc",
	secondaryTextSize: 12,

	linkColor: "#333333",
	linkWidth: 12,
};

export const useGraphTheme = create<typeof DefaultGraphTheme>()(() => DefaultGraphTheme);
