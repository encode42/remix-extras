import React from "react";
import { Link, LinkProps } from "@remix-run/react";
import { Anchor as MantineAnchor, AnchorProps as MantineAnchorProps } from "@mantine/core";
import { Optional } from "@encode42/mantine-extras";

export type AnchorProps = MantineAnchorProps & Optional<LinkProps, "to">;

/**
 * An anchor that uses Remix's {@link Link} component.
 */
export function Anchor({ to, ...other }: AnchorProps) {
    return (to && !/.?:\/\//.test(to.toString())) ? (
        <MantineAnchor to={to} component={Link} {...other} />
    ) : (
        <MantineAnchor href={to ? to.toString() : "#"} {...other} />
    );
}
