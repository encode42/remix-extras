import React from "react";
import { Anchor as MantineAnchor, AnchorProps } from "@mantine/core";
import { Link } from "@remix-run/react";

/**
 * An anchor that uses Remix's {@link Link} component.
 */
export function Anchor({...other}: AnchorProps<typeof Link>) {
    return (
        <MantineAnchor component={Link} {...other} />
    );
}
