import React from "react";
import { useSubmit } from "@remix-run/react";
import { Avatar, Menu } from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import { useUser } from "../../provider";

/**
 * Options for the {@link AvatarMenu} component.
 */
export interface AvatarMenuProps {
    /**
     * Profile picture to display.
     */
    "picture": string
}

/**
 * Component for user management.
 */
export function AvatarMenu({ picture }: AvatarMenuProps) {
    const submit = useSubmit();
    const { logoutRoute } = useUser();

    return (
        <Menu control={<Avatar src={picture} />} sx={{
            "cursor": "pointer"
        }}>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item color="red" icon={<IconLogout />} onClick={() => {
                submit(null, {
                    "method": "post",
                    "action": logoutRoute
                });
            }}>Logout</Menu.Item>
        </Menu>
    );
}
