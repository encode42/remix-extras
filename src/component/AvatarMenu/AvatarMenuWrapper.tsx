import React, { PropsWithChildren } from "react";
import { useUser } from "../../provider";
import { Button, ButtonProps, Optional } from "@encode42/mantine-extras";
import { Link, LinkProps } from "../Link";
import { AvatarMenu, AvatarMenuProps } from "./AvatarMenu";

/**
 * Options for the {@link AvatarMenuWrapper} component.
 */
export interface AvatarMenuWrapperProps extends AvatarMenuProps, Optional<PropsWithChildren, "children"> {
    /**
     * Where the logout button links to.
     *
     * Defaults to {@code /login}.
     */
    "to"?: LinkProps["to"],

    /**
     * Options for the {@link Link} component.
     */
    "linkProps"?: Omit<LinkProps, "to">,

    /**
     * Options for the {@link https://mantine.dev/core/button Button} component.
     */
    "buttonProps"?: ButtonProps
}

/**
 * Wrapper for the {@link AvatarMenu} component that displays a login button when logged out.
 */
export function AvatarMenuWrapper({ to = "/login", linkProps, buttonProps, children = "Login", ...other }: AvatarMenuWrapperProps) {
    const { user } = useUser();

    return (
        user ? (
            <AvatarMenu {...other} />
        ) : (
            <Link to={to} {...linkProps}>
                <Button {...buttonProps}>
                    {children}
                </Button>
            </Link>
        )
    );
}
