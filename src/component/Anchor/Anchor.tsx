import React from "react";
import { Link, LinkProps } from "@remix-run/react";
import { Anchor as MantineAnchor, AnchorProps as MantineAnchorProps } from "@mantine/core";
import { Optional } from "@encode42/mantine-extras";

type BaseProps = MantineAnchorProps & Optional<LinkProps, "to">;

/**
 * Props for the {@link} Anchor component.
 */
export interface AnchorProps extends BaseProps {
    /**
     * Whether the provided URL is external.
     *
     * @defaultValue false
     */
    "external"?: boolean
}

/**
 * An anchor that uses Remix's {@link Link} component.
 */
export function Anchor({ to, external = false, color = "primary", ...other }: AnchorProps) {
    return (to && !external) ? (
        <MantineAnchor to={to} component={Link} color={color} {...other} />
    ) : (
        <MantineAnchor href={to ? to.toString() : "#"} color={color} {...other} />
    );
}
