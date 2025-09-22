import { AppShell } from "@mantine/core";
import { Outlet } from "react-router";

export default function ShellLayout() {
    return (
        <AppShell>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}
