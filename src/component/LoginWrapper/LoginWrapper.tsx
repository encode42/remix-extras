import React, { PropsWithChildren } from "react";
import { Button, ButtonProps } from "@encode42/mantine-extras";
import { Link, LinkProps } from "../Link";
import { useUser } from "../../provider";

/**
 * Options for the {@link LoginWrapper} component.
 */
export interface LoginWrapperProps extends PropsWithChildren {
    /**
     * Where the logout button links to.
     *
     * Defaults to {@code /login}.
     */
    "to"?: LinkProps["to"],

    /**
     * Label of the login button.
     */
    "label"?: string,

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
export function LoginWrapper({ to = "/login", linkProps, buttonProps, label = "Login", children }: LoginWrapperProps) {
    const { user } = useUser();

    return (
        user ? (
            {children}
        ) : (
            <Link to={to} {...linkProps}>
                <Button {...buttonProps}>
                    {label}
                </Button>
            </Link>
        )
    );
}
