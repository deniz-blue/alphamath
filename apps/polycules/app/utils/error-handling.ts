import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { prettifyError, ZodError } from "zod";

export const reportError = (e: any) => {
    notifications.show({
        title: "Error",
        message: e instanceof ZodError ? prettifyError(e) : ("" + e),
        color: "red",
        autoClose: e instanceof ZodError ? false : undefined,
    });
};

export const useReportError = (e: any) => {
    useEffect(() => {
        if (!e) return;
        reportError(e);
    }, [e]);
};
