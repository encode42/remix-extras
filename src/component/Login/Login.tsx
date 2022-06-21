import React, { ReactElement } from "react";
import { useSubmit } from "@remix-run/react";
import { Button, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconBrandDiscord, IconBrandFacebook, IconBrandGithub, IconBrandGoogle, IconBrandWindows } from "@tabler/icons";
import { RegisteredProvider } from "../../util";

/**
 * Options for the {@link LoginProps} component.
 */
export interface LoginProps {
    /**
     * Providers to display login buttons for.
     */
    "providers": RegisteredProvider[],

    /**
     * Name of the website.
     */
    "name"?: string
}

/**
 * Structure for the {@link brandIcons} object.
 */
interface BrandIcons {
    /**
     * An available brand icon.
     */
    [key: string]: ReactElement
}

/**
 * Object of available brand icons.
 */
const brandIcons: BrandIcons = {
    "discord": <IconBrandDiscord />,
    "github": <IconBrandGithub />,
    "google": <IconBrandGoogle />,
    "facebook": <IconBrandFacebook />,
    "microsoft": <IconBrandWindows />
};

/**
 * Prefix for the title.
 */
const prefix = "Login";

export function Login({ providers, name }: LoginProps) {
    const submit = useSubmit();

    // Calculate padding around the title.
    const theme = useMantineTheme();
    const titlePadding = theme.spacing.xl * 1.5;

    return (
        <Stack spacing={theme.spacing.xl}>
            <Stack align="center" spacing="xs" sx={{
                "paddingTop": titlePadding,
                "paddingBottom": titlePadding
            }}>
                <Text weight="bold" sx={theme => ({
                    "fontSize": theme.fontSizes.xl * 2,
                    "fontFamily": "Montserrat",
                    "color": theme.colors[theme.primaryColor][5]
                })}>{name ? `${prefix} to ${name}` : prefix}</Text>
                <Text size="lg">Choose an authentication method to continue.</Text>
            </Stack>
            <Stack spacing="lg">
                {providers.map(provider => (
                    <Stack key={provider.name}>
                        <Button size="lg" leftIcon={brandIcons[provider.provider]} onClick={() => {
                            submit(null, {
                                "method": "post",
                                "action": provider.route.default
                            });
                        }}>
                            Login with {provider.name}
                        </Button>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
}
