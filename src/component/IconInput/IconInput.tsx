import { ActionIcon, Box, BoxProps, Group, Input, InputWrapperProps, Modal, ModalProps, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { IconMoodSmile, IconSearch } from "@tabler/icons";
import { TablerIconsKeys, TablerIconsTags, TablerIconsType } from "@encode42/tabler-icons-types";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Fuse from "fuse.js";
import { useDebouncedState } from "@mantine/hooks";
import deepmerge from "deepmerge";
import { Optional } from "@encode42/node-extras";
import { TablerIcon } from "../TablerIcon";
import { APIRoute } from "../../util";

/**
 * Options for the {@link IconInput} component.
 */
export interface IconSelectProps extends Omit<InputWrapperProps, "children">, APIRoute {
    /**
     * Number of columns to display in the modal.
     */
    "columns"?: number,

    /**
     * Options for the [Modal](https://mantine.dev/core/modal) component.
     */
    "modalProps"?: Optional<Omit<Omit<ModalProps, "children">, "opened">, "onClose">,

    /**
     * Options for the [Box](https://mantine.dev/core/box) component.
     */
    "boxProps"?: BoxProps
}

interface IconElement {
    "value": TablerIconsType,
    "label": string,
    "icon": ReactNode,
    "tags": string[]
}

// TODO:
// - Dynamically get group height
// - Make picker 1:1
// - Accessibility

/**
 * An input for choosing an icon amongst [Tabler Icon](https://tabler-icons.io/)'s library of icons.
 *
 * @remarks
 * Relies on a proper {@link API} splat with {@link APIPropsDefaults#icon} enabled.
 */
export function IconInput({
    columns = 5,
    placeholder,
    onChange,
    modalProps = {},
    apiRoute,
    ...other
}: IconSelectProps) {
    modalProps = deepmerge({
        "title": "Search",
        "size": "xl",
        "centered": true
    } as ModalProps, modalProps);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useDebouncedState("", 350);
    const [displayedIcons, setDisplayedIcons] = useState<IconElement[]>([]);
    const [selectedIcon, setSelectedIcon] = useState<IconElement>();

    const icons = useMemo(() => {
        const iconElements: IconElement[] = [];

        for (const key of TablerIconsKeys) {
            const icon = <TablerIcon apiRoute={apiRoute} type={key} />;
            const label = key.replace("Icon", "").replace(/(\w)([A-Z])/g, "$1 $2").replace(/([a-z])(\d)/g, "$1 $2");

            iconElements.push({
                "value": key,
                label,
                icon,
                "tags": TablerIconsTags[key].tags
            });
        }

        return iconElements;
    }, []);

    const pickerGroups = useMemo<ReactNode[]>(() => {
        const groups: ReactNode[] = [];

        for (let i = 0; i < displayedIcons.length; i += columns) {
            const columnElements: ReactNode[] = [];

            for (let column = 0; column < columns; column++) {
                const entry = displayedIcons[i + column];
                if (!entry) {
                    break;
                }

                columnElements.push(
                    <Tooltip key={entry.value} label={entry.label} position="bottom">
                        <ActionIcon size="xl" aria-label={entry.label} onClick={() => {
                            change(entry);

                            close();
                        }}>
                            {entry.icon}
                        </ActionIcon>
                    </Tooltip>
                );
            }

            groups.push(
                <Group grow>
                    {columnElements}
                </Group>
            );
        }

        return groups;
    }, [displayedIcons]);

    const index = useMemo<Fuse<IconElement>>(() => {
        return new Fuse<IconElement>(Object.values(icons), {
            "threshold": 0.15,
            "keys": ["label", "tags"]
        });
    }, [icons]);

    useEffect(() => {
        if (!query) {
            setDisplayedIcons(icons);

            return;
        }

        setDisplayedIcons(index.search(query).map(idx => idx.item));
    }, [query]);

    function Row({ index, style }) {
        return (
            <Box style={style}>
                {pickerGroups[index]}
            </Box>
        );
    }

    function close() {
        setOpen(false);
    }

    function change(icon: IconElement) {
        setSelectedIcon(icon);

        // @ts-ignore // TODO
        onChange?.(icon.value);
    }

    return (
        <>
            <Input.Wrapper {...other}>
                <Group spacing="xs" sx={theme => ({
                    "background": theme.colors.dark[6],
                    "border": `1px solid ${theme.colors.dark[4]}`,
                    "borderRadius": theme.radius.sm,
                    "padding": theme.radius.sm,
                    "userSelect": "none",
                    "cursor": "pointer"
                })} onClick={() => {
                    setOpen(true);
                }}>
                    {selectedIcon ? selectedIcon.icon : <IconMoodSmile />}
                    <Text size="sm" color={selectedIcon ? undefined : "dimmed"}>
                        {selectedIcon ? selectedIcon.label : placeholder}
                    </Text>
                </Group>
            </Input.Wrapper>
            <Modal opened={open} onClose={() => {
                close();
            }} {...modalProps}>
                <Stack spacing="lg">
                    <TextInput icon={<IconSearch />} defaultValue={query} onChange={event => {
                        setQuery(event.target.value);
                    }} />
                    <Box sx={{
                        "height": 44 * 5
                    }}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeList height={height} width={width} itemSize={44} itemCount={pickerGroups.length}>
                                    {Row}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </Box>
                </Stack>
            </Modal>
        </>
    );
}
