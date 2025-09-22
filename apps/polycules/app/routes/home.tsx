import { Stack } from "@mantine/core";
import { PolyculeContext } from "../contexts/PolyculeContext";
import { useImmer } from "use-immer";
import { createPolyculeManifest } from "../types/graph";

export default function Home() {
	const [root, update] = useImmer(() => createPolyculeManifest());

	return (
		<PolyculeContext value={{
			root,
			update
		}}>

		</PolyculeContext>
	);
}
