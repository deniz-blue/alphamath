import { useContext } from "react";
import { ITransform, Transform } from "../core/index.js";

export const useTransform = (): ITransform => {
    return useContext(Transform);
};
