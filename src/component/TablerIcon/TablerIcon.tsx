import { TablerIconsType } from "@encode42/tabler-icons-types";
import SVG from "react-inlinesvg";
import { Loader } from "@mantine/core";
import { TablerIconProps as IconProps } from "@tabler/icons";
import React from "react";
import { leadingSlash } from "@encode42/node-extras";
import { APIRoute } from "../../util";

/**
 * Options for the {@link TablerIcon} component.
 */
export interface TablerIconProps extends IconProps, APIRoute {
    /**
     * The type of Tabler Icon to display.
     */
    "type": TablerIconsType
}

/**
 * A component to fetch and display a [Tabler Icon](https://tabler-icons.io/) on demand.
 *
 * @remarks
 * Relies on a proper {@link API} splat with {@link APIPropsDefaults#icon} enabled.
 */
export function TablerIcon({ type, apiRoute = "/api/v1/icon/", ...other }: TablerIconProps) {
    return (
        // @ts-ignore // TODO
        <SVG src={`${leadingSlash(apiRoute)}${type}`} loader={<Loader size="sm" />} {...other} />
    );
}
