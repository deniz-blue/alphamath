import { createContext, useContext } from "react";
import type { PolyculeManifest } from "../types/types";
import type { Updater } from "use-immer";

export interface IPolyculeContext {
    root: PolyculeManifest;
    update: Updater<PolyculeManifest>;
};

export const PolyculeContext = createContext<IPolyculeContext>(null as any);

export const usePolycule = () => useContext(PolyculeContext);
