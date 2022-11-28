import { TablerIconsType } from "@encode42/tabler-icons-types";
import SVG from "react-inlinesvg";
import { Loader } from "@mantine/core";
import { TablerIconProps as IconProps } from "@tabler/icons";
import React from "react";
import { leadingSlash } from "@encode42/node-extras";

export interface TablerIconProps extends IconProps {
    "type": TablerIconsType
}

// TODO: Way to change apiRoute
export function TablerIcon({ type, ...other }: TablerIconProps) {
    return (
        // @ts-ignore // TODO
        <SVG src={`${leadingSlash("/api/v1/icon/")}${type}`} loader={<Loader size="sm" />} {...other} />
    );
}
