export const MODALS = {
} as const;

declare module '@mantine/modals' {
	export interface MantineModalsOverride {
		modals: typeof MODALS;
	}
}
