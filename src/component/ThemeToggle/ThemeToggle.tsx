import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons";
import React from "react";

export function ThemeToggle() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <ActionIcon size="xl" variant="filled" onClick={() => {
            toggleColorScheme();
        }}>
            {isDark ? <IconSun /> : <IconMoon />}
        </ActionIcon>
    );
}
